
export function addItemAttchName(item, attributeName = 'attachments', fileNameLength = 15) {
  if (item[attributeName]) {
    if (item[attributeName].length > 1) {
      item[attributeName.substring(0, attributeName.length - 1) + 'Names'] = shortName(item[attributeName][0].name, fileNameLength) + ',更多...'
    } else if (item[attributeName].length > 0) {
      item[attributeName.substring(0, attributeName.length - 1) + 'Names'] = shortName(item[attributeName][0].name, fileNameLength)
    } else {
      item[attributeName.substring(0, attributeName.length - 1) + 'Names'] = '无'
    }
  } else {
    item[attributeName.substring(0, attributeName.length - 1) + 'Names'] = '无'
  }
}
export function addItemsAttchName(items, attributeName = 'attachments', fileNameLength = 15) {
  items.forEach(item => {
    addItemAttchName(item, attributeName, fileNameLength)
  })
}

function shortName(fileName, fileNameLength) {
  const dotPosition = fileName.lastIndexOf('.')
  const fileExtName = fileName.substring(dotPosition)
  const newFileName = fileName.substring(0, dotPosition)
  if (newFileName.length > fileNameLength) {
    return newFileName.substring(0, fileNameLength / 2) + '...' + newFileName.substring(newFileName.length - fileNameLength / 2) + fileExtName
  } else { return fileName }
}
