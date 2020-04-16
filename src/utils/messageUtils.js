import { MessageBox, Message } from 'element-ui'
import i18n from '@/i18n'
/**
 * MessageBox
 */
export function showConfirm(msg = '', type = 'warning') {
  return MessageBox.confirm(msg, i18n.tc('core.tips'), {
    confirmButtonText: i18n.tc('core.confirm'),
    type: type,
    dangerouslyUseHTMLString: true
  })
}

export function showDeleteConfirm(msg) {
  const message = msg || i18n.tc('core.deleteRemindMsg')
  return MessageBox.confirm(message, i18n.tc('core.tips'), {
    confirmButtonText: i18n.tc('core.confirm'),
    cancelButtonText: i18n.tc('core.cancel'),
    type: 'warning'
  })
}

export const showSubmitConfirm = () =>
  MessageBox.confirm('确认提交?', '提示', {
    confirmButtonText: i18n.tc('core.confirm'),
    cancelButtonText: i18n.tc('core.cancel'),
    type: 'info'
  })

export const showCancelConfirm = () =>
  MessageBox.confirm('您有修改未保存，是否继续?', '提示', {
    confirmButtonText: i18n.tc('core.confirm'),
    cancelButtonText: i18n.tc('core.cancel'),
    type: 'info'
  })

export function transTableFormInvalidMsg(title, invalidateMsg) {
  for (const prop in invalidateMsg) {
    let lineId
    invalidateMsg[prop].forEach(item => {
      lineId = (parseInt(prop.split('.')[1]) + 1)
      if (lineId) {
        item.message = title + '-第' + lineId + '行:' + item.message
      }
    })
  }
}
export function showFormInvalidateMessage(inValidates, titleMessage = '') {
  // debugger
  let message = '<ul class="formErrorMessage">'
  for (const p in inValidates) {
    inValidates[p].forEach(item => {
      message = message + '<li>' + item.message + '</li>'
    })
  }
  message = message + '</ul>'
  return MessageBox.confirm(message, '错误' + titleMessage, {
    confirmButtonText: i18n.tc('core.confirm'),
    showCancelButton: false,
    // type: 'error',
    dangerouslyUseHTMLString: true
  })
}
export function showInvalidateMessage(inValidates, titleMessage = '') {
  return MessageBox.confirm(inValidates, '错误' + titleMessage, {
    confirmButtonText: i18n.tc('core.confirm'),

    dangerouslyUseHTMLString: true
  })
}

/**
 * Message
 */
const showsMessage = (msg, type) => {
  Message({
    type: type,
    message: msg,
    duration: 3 * 1000,
    dangerouslyUseHTMLString: true
  })
}

export const showsSuccessMessage = msg => showsMessage(msg, 'success')
export const showsErrorMessage = msg => showsMessage(msg, 'error')
export const showsInfoMessage = msg => showsMessage(msg, 'info')
export const showsWarningMessage = msg => showsMessage(msg, 'warning')

// common
export const showSaveSuccess = () => showsSuccessMessage(i18n.tc('core.saveSuccess'))
export const showSubmitSuccess = () => showsSuccessMessage(i18n.tc('core.submitSuccess'))
export const showFinishSuccess = () => showsSuccessMessage(i18n.tc('core.finishSuccess'))
export const showUploadSuccess = () => showsSuccessMessage(i18n.tc('core.uploadSuccess'))
export const showUploadCounterSuccess = (counter) => showsSuccessMessage(i18n.tc('core.uploadSuccess', { counter }))
export const showsDeleteSuccess = () => showsSuccessMessage(i18n.tc('core.deletionSuccess'))
export const showsDeleteCancel = () => showsInfoMessage(i18n.tc('core.deletionCanceled'))
export const showSubmitCancel = () => showsInfoMessage('已取消提交')

// upload
export const MSG_UPLOAD_SUCCESS = () => showsSuccessMessage('上传成功')
export const MSG_UPLOAD_FAILED = () => showsErrorMessage('上传失败')
export const showUploadFailed = (ms) => showsErrorMessage('上传失败:' + ms)
//
