import * as lookup from '@/utils/lookup'

export function mapLookupLabel(lookups, value) {
  return lookup.queryLookupLabel(lookups, value)
}

export function mapAttachments(attachments) {
  const label = attachments.map(att => {
    return att.name
  })
  return label.join(',')
}
export function mapAttachmentType(name) {
  const index = name.lastIndexOf('.')
  if (index === -1) {
    return ''
  }
  return name.substring(index + 1, name.length)
}
export function mapAttachmentSize(size) {
  let unit = 'B'
  if (size > 1000) {
    size = size / 1024
    unit = 'KB'
  }
  if (size > 1000) {
    size = size / 1024
    unit = 'MB'
  }
  return parseFloat(size).toFixed(2) + unit
}

export function mapApproved(approved) {
  if (approved === 'PASS') {
    return '是'
  } else {
    return '否'
  }
}
