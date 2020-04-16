<template>
  <div class="app-container">
    <el-tabs v-model="tabName" tab-position="left" style="height: 150px;">
      <el-tab-pane label="我的信息" name="userInfo">
        <el-form ref="userInfo" :rules="userInfoRules" :show-message="false" :model="form" label-width="100px">

          <el-row>
            <el-col :span="6">
              <el-form-item label="用户姓名" prop="fullName">
                <el-input v-model="form.fullName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="布局大小" prop="layoutSize">
                <el-select v-model="form.layoutSize" placeholder="请选择布局大小">
                  <el-option
                    v-for="item in layouts"
                    :key="item.layoutId"
                    :label="item.layoutName"
                    :value="item.layoutId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="userPassword">
        <el-form ref="userPassword" :show-message="false" :rules="userPasswordRules" :model="pwdForm" label-width="100px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="原始密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmNewPassword">
                <el-input v-model="pwdForm.confirmNewPassword" type="password" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

    </el-tabs>
    <el-row>

      <el-col :offset="4" :span="4">
        <div style="text-align: right">
          <el-button
            class="filter-item"
            type="primary"
            @click="onSubmit"
          >修改</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row>
        <el-col :span="6">
          <el-form-item label="邮件">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
      </el-row> -->

  </div>
</template>

<script>
import * as userApi from '@/api/user'
import { mapGetters } from 'vuex'
import Vue from 'vue'

import * as messageUtils from '@/utils/messageUtils'
// import * as lookup from '@/utils/lookup'

export default {
  name: 'UserProfile',
  data() {
    return {
      tabName: 'userInfo',
      form: {},
      pwdForm: {},
      layouts: [
        {
          layoutId: 'medium',
          layoutName: '大'
        },
        {
          layoutId: 'small',
          layoutName: '中'
        },
        {
          layoutId: 'mini',
          layoutName: '小'
        }
      ],
      userInfoRules: {
        fullName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        layoutSize: [
          { required: true, message: '布局大小不能为空', trigger: 'blur' }
        ]
      },
      userPasswordRules: {
        oldPassword: [
          { required: true, message: '原始密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        confirmNewPassword: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('确认新密码不能为空'))
            } else if (value !== this.pwdForm.newPassword) {
              callback(new Error('新密码不一致!'))
            } else {
              callback()
            }
          } }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    this.fetchData(this.userId)
    // this.getUserAssign(id);
  },
  methods: {

    setFormData(data) {
      this.form = data
      localStorage.setItem('vue-size', data.layoutSize)
      Vue.prototype.$ELEMENT = { size: data.layoutSize }
    },
    fetchData(id) {
      userApi.getUserProfile(id).then(response => {
        this.setFormData(response.data)
      })
    },

    onSubmit() {
      if (this.tabName === 'userInfo') {
        this.$refs['userInfo'].validate((valid, errorMsg) => {
          if (!valid) {
            messageUtils.showFormInvalidateMessage(errorMsg)
            return
          }
          userApi.updateUserProfile(this.form).then(response => {
            this.setFormData(response.data)

            messageUtils.showSaveSuccess()
          })
        })
      } else {
        this.pwdForm.userId = this.userId
        this.$refs['userPassword'].validate((valid, errorMsg) => {
          if (!valid) {
            messageUtils.showFormInvalidateMessage(errorMsg)
            return
          }
          userApi.updateUserPassword(
            this.pwdForm
          ).then(response => {
            this.setFormData(response.data)

            messageUtils.showsSuccessMessage('密码修改成功')
          })
        })
      }
    }

  }
}
</script>

<style   scoped>
.user-detail-dialog-wrap {
  height: 300px;
  overflow-y: scroll;
}
</style>
