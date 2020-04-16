<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      插入图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        action="default"
        :disabled="disableSaveButton"
        :before-upload="beforeUpload"
        :http-request="uploadFile"
        :on-remove="handleUploadRemove"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :file-list="fileList"
        :multiple="true"
        :show-file-list="true"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          选择图片
        </el-button>
      </el-upload>
      <el-row type="flex" justify="end">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button :disabled="disableSaveButton" type="primary" @click="handleSubmit">
          插入
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile, beforeUploadImage, mapUploadedFilesToAttachments } from '@/api/crm/upload'
import {
  showSaveSuccess,
  MSG_UPLOAD_SUCCESS,
  showDeleteConfirm,
  showsDeleteSuccess,
  showsDeleteCancel
} from '@/utils/messageUtils'
import { guid } from '@/utils'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      disableSaveButton: false,
      files: [],
      fileList: [],
      uploadToken: ''
    }
  },
  created() {
    this.reset()
  },
  methods: {
    beforeUpload: beforeUploadImage,
    uploadFile(request) {
      this.disableSaveButton = true
      return uploadFile('article_content', request.file, this.uploadToken)
    },
    handleUploadSuccess(response, file, files) {
      this.files = mapUploadedFilesToAttachments(files)
      this.disableSaveButton = false
      MSG_UPLOAD_SUCCESS()
    },
    handleUploadError(error, file, files) {
      console.error(error)
      this.disableSaveButton = false
    },
    handleUploadRemove(file, files) {
      this.files = mapUploadedFilesToAttachments(files)
    },
    handleSubmit() {
      this.$emit('successCBK', this.files)
      this.dialogVisible = false
      this.reset()
    },
    reset() {
      this.disableSaveButton = false
      this.files = []
      this.fileList = []
      this.uploadToken = guid()
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
