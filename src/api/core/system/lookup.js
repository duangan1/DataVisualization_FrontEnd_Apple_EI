import request from '@/utils/request'

export function queryLookupTypeList(currentPage, limit) {
  return request({
    url: `/core/system/lookup/type/list/${currentPage}/${limit}`,
    method: 'get'
  })
}

export function queryLookupTypeByCriteria(params) {
  return request({
    url: `/core/system/lookup/type/list`,
    method: 'get',
    params
  })
}

export function updateLookupType(data) {
  return request({
    url: '/core/system/lookup/type',
    method: 'post',
    data
  })
}

export function deleteLookupType(id) {
  return request({
    url: `/core/system/lookup/type/${id}`,
    method: 'delete'
  })
}

export function deleteLookupCode(id) {
  return request({
    url: `/core/system/lookup/code/${id}`,
    method: 'delete'
  })
}

export function queryLookupTypeById(id) {
  return request({
    url: `/core/system/lookup/type/${id}`,
    method: 'get'
  })
}

export function queryLookupCodeByType(lookupType, currentPage, limit) {
  return request({
    url: `/core/system/lookup/code/${lookupType}/${currentPage}/${limit}`,
    method: 'get'
  })
}

export function updateLookupCode(data) {
  return request({
    url: '/core/system/lookup/code',
    method: 'post',
    data
  })
}

export function queryLookupCode(lookupTypes, lang) {
  const types = lookupTypes.join()
  return request({
    url: `/core/system/lookup/typeCode/${types}?language=${lang}`,
    method: 'get'
  })
}

export function queryDynamicLookup(entities) {
  const types = entities.join()
  return request({
    url: `/core/system/lookup/dynamic/${types}`,
    method: 'get'
  })
}

export function querySteelSerialLookup() {
  return request({
    url: `/crm/steelSerial/lookup`,
    method: 'get'
  })
}

export function updateLookupById(lookupTypeId, data) {
  return request({
    url: `/core/system/lookup/type/${lookupTypeId}`,
    method: 'put',
    data
  })
}

export const addCustomizedLookupCode = (lookupTypeCode, lookupCodes, lastSerialNumber) => {
  const lookupCodesWithSerialNumber = {}
  lookupCodes.forEach((code, index) => {
    lookupCodesWithSerialNumber[code] = lastSerialNumber + 1 + index
  })

  return request({
    url: '/core/system/lookup/code/customized',
    method: 'post',
    data: {
      lookupTypeCode,
      lookupCodesWithSerialNumber
    }
  })
}

export function getSysConfig(key) {
  return request({
    url: `/core/system/lookup/sysconfig/${key}`,
    method: 'get'
  })
}

