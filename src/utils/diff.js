import {
  isPlainObject,
  isEqual,
  isEmpty,
  isArray,
  get,
  omit,
  keys,
  reduce,
  differenceBy,
  differenceWith,
  intersectionBy
} from 'lodash'

const diff = (entity, original, exclude) => {
  entity = filterExcludeColumns(entity, exclude)
  original = filterExcludeColumns(original, exclude)

  const differences = reduce(
    entity,
    (result, value, key) => {
      const originalValue = get(original, key)

      // 子对象
      if (isPlainObject(value)) {
        const subDifferences = diff(value, originalValue)
        if (subDifferences) {
          result[key] = subDifferences
        }
        return result
      }

      // 数组
      if (isArray(value) || isArray(originalValue)) {
        let subDifferences = null
        if (key === 'attachments') {
          subDifferences = diffOfSubAttachments(value, originalValue, exclude)
        } else {
          subDifferences = diffOfSubs(value, originalValue, exclude)
        }
        if (subDifferences) {
          result[key] = subDifferences
        }
        return result
      }

      // 值
      if (!isEqual(value, originalValue)) {
        result[key] = {
          prev: originalValue || null,
          current: value
        }
        return result
      }

      return result
    },
    {}
  )

  return isEmpty(keys(differences)) ? null : differences
}

const diffOfSubs = (entities, originals, exclude) => {
  //   console.log('diffOfSubs', entities, originals)

  entities = filterExcludeColumns(entities, exclude)
  originals = filterExcludeColumns(originals, exclude)

  const result = {}
  const add = differenceWith(entities, originals, isEqual)
  const del = differenceWith(originals, entities, isEqual)
  if (!isEmpty(add)) {
    result.add = add
  }
  if (!isEmpty(del)) {
    result.del = del
  }

  return isEmpty(keys(result)) ? null : result
}

const ATTACHMENT_EXCLUDE_COLUMNS = [
  'id',
  'referenceId',
  'type',
  'category',
  'size'
]

const diffOfSubAttachments = (entities, originals, exclude) => {
  return diffOfSubs(
    entities,
    originals,
    ATTACHMENT_EXCLUDE_COLUMNS.concat(exclude)
  )
}

const DEFAULT_EXCLUDE_COLUMNS = [
  'creatorName',
  'createdBy',
  'createdAt',
  'updaterName',
  'updatedBy',
  'updatedAt'
]

const filterExcludeColumns = (value, exclude) => {
  if (isArray(value)) {
    return value.map(item => filterExcludeColumns(item, exclude))
  }
  if (isPlainObject(value)) {
    return omit(value, exclude)
  }
  return value
}

export const calculateDiff = (entity, original, exclude) => {
  if (isEqual(entity, original)) {
    return { hasDiff: false }
  }

  const excludeColumns = DEFAULT_EXCLUDE_COLUMNS.concat(exclude || [])
  const differences = diff(entity, original, excludeColumns)

  return {
    ...differences,
    hasDiff: !isEmpty(keys(differences))
  }
}

export const calculateArrayDiff = (entities, originals, keyPath, exclude) => {
  if (isEqual(entities, originals)) {
    return { hasDiff: false }
  }

  const differences = {}
  const excludeColumns = DEFAULT_EXCLUDE_COLUMNS.concat(exclude || [])

  // 新增
  const added = differenceBy(entities, originals, keyPath)
  if (!isEmpty(added)) {
    differences.add = filterExcludeColumns(added, excludeColumns)
  }

  // 删除
  const deleted = differenceBy(originals, entities, keyPath)
  if (!isEmpty(deleted)) {
    differences.del = filterExcludeColumns(deleted, excludeColumns)
  }

  // 更新
  intersectionBy(entities, originals, keyPath).forEach(entity => {
    const original = originals.find(item => entity[keyPath] === item[keyPath])
    const updatedDiff = calculateDiff(entity, original, exclude)

    if (updatedDiff.hasDiff) {
      const key = entity[keyPath]
      differences.update = differences.update || {}
      differences.update[key] = omit(updatedDiff, 'hasDiff')
    }
  })

  return {
    ...differences,
    hasDiff: !isEmpty(keys(differences))
  }
}
