<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col style="text-align: right;">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button
          type="infor"
          @click="handleCancel"
        >取消</el-button>
      </el-col>
    </el-row>

    <el-form ref="form" :show-message="false" :model="form" :rules="formRules" label-width="80px">
      <custFieldSet title="用户信息">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="100px" label="用户名" prop="userName">
              <el-input v-model="form.userName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="密码" prop="password">
              <el-input v-model="form.password" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="用户姓名" prop="fullName">
              <el-input v-model="form.fullName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="邮件" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="6">
            <el-form-item label-width="100px" label="电话号码" prop="phoneNum">
              <el-input v-model="form.phoneNum" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" label="布局大小" prop="layoutSize">
              <el-select
                v-model="form.layoutSize"
                placeholder="请选择"
              >
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
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label-width="100px" label="审批组" prop="groups">
              <el-select
                v-model="form.extFields.groups"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择文章标签"
              >
                <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>

          <el-col :span="6">
            <el-form-item label-width="100px" label="权限">
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                :disabled="!form.userId"
                icon="el-icon-edit"
                @click="handleAssign( )"
              >分配权限</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label-width="100px" label="部门">
              <el-button
                class="filter-item"
                :disabled="!form.userId"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-edit"
                @click="handleDepartmentAssign"
              >分配部门</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </custFieldSet>
    </el-form>
    <el-dialog title="分配权限" :close-on-click-modal="false" :visible.sync="dialogAssignVisible">
      <el-scrollbar class="user-detail-dialog-wrap" wrap-class="user-detail-dialog-wrap">
        <el-tree
          ref="userAssigntree"
          :data="treeData"
          node-key="id"
          :props="{
            children: 'children',
            label: 'title'
          }"
          show-checkbox
          :default-checked-keys="treeCheckedKeys"
        >
          <span slot-scope="{ node,data }" class="app-tree-icon">
            <svg-icon :icon-class="data.icon" :class="'resource_'+data.type" />
            <span>{{ node.label }}</span>
          </span>
        </el-tree>

      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignVisible = false">取消</el-button>
        <el-button type="primary" :disabled="disableSaveButton" @click="saveUserAssign()">确定</el-button>
      </div>
    </el-dialog>
    <!--
    <el-dialog title="选择部门" :close-on-click-modal="false" :visible.sync="dialogDepartmentVisible">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        clearable
      />
      <el-scrollbar class="user-detail-dialog-wrap" wrap-class="user-detail-dialog-wrap">
        <el-tree
          ref="userDeparTree"
          :data="departTreeData"
          node-key="id"
          :props="{
            children: 'children',
            label: 'name'
          }"

          show-checkbox
          :check-strictly="true"
          :default-checked-keys="dapartTreeCheckedKeys"
          :filter-node-method="filterNode"
          @node-contextmenu="rightClick"
          @check="treeCheck"
        >
          <span slot-scope="{ node,data }" class="app-tree-icon">
            <svg-icon :icon-class="data.icon" />
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
        <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li class="menu__item" @click="menuClick('addButton')">设置为主要</li>

          </ul>
        </div>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepartmentVisible = false">取消</el-button>
        <el-button type="primary" :disabled="disableSaveButton" @click="saveUserDeparment()">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import * as userApi from '@/api/user'
// import * as departmentApi from '@/api/core/security/department'

import * as messageUtils from '@/utils/messageUtils'

export default {
  name: 'UserDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuVisible: false,
      dataBelong: '',
      form: {
        extFields: {},
        // dataBelong: [],
        layoutSize: 'mini',
        primaryDepartmentId: null,
        primaryDepartmentName: null
      },
      jobTitleList: [],
      //  resources: [],
      // resourcesJ: [],
      roles: [],
      groups: [],
      treeData: [],

      lookups: {},
      treeCheckedKeys: [],
      resources: [],
      disableSaveButton: true,
      dialogAssignVisible: false,
      dialogDepartmentVisible: false,
      filterText: '',
      departTreeData: [],
      dapartTreeCheckedKeys: [],
      layouts: [{
        layoutId: 'medium',
        layoutName: '大'
      }, {
        layoutId: 'small',
        layoutName: '中'
      }, {
        layoutId: 'mini',
        layoutName: '小'
      }],
      currentTreeData: null,
      currentTreeNode: null,
      formRules: {
        userName: { required: true, message: '用户名不能为空', trigger: 'blur' },
        // password: { required: true, message: '密码不能为空', trigger: 'blur' },
        fullName: { required: true, message: '姓名不能为空', trigger: 'blur' },
        // email: { required: true, message: '姓名不能为空', trigger: 'blur' },
        //  layoutSize: { required: true, message: '姓名不能为空', trigger: 'blur' },
        // groups: { required: true, message: '姓名不能为空', trigger: 'blur' },
        dataBelong: { required: true, message: '管理类别不能为空', trigger: 'blur' }
      }
    }
  },

  watch: {
    filterText(val) {
      this.$refs.userDeparTree.filter(val)
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
      // this.getUserAssign(id);
    } else {
      this.getUserAssign(-1)
    }
    this.getUserTransfers()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      userApi.getUser(id).then(response => {
        // this.setTreeData(response.data.resources)
        this.treeData = response.data.resources

        // response.data.resources = []
        response.data.departmentIds = []
        this.setFormData(response.data)
        this.treeCheckedKeys = []
        this.resources = []
        this.getTreeCheckedKeys(this.treeData)
        this.treeCheckedKeys = this.treeCheckedKeys
        this.form.resources = this.resources
      })
    },
    getLooks() {

    },
    setTreeData() {
      // this.treeData = data

      this.treeCheckedKeys = []
      this.getTreeCheckedKeys(this.treeData)
    },
    // getUserDepartmentTree() {
    //   this.dialogDepartmentVisible = true
    //   if (this.departTreeData.length === 0) {
    //     departmentApi.findByUserId(this.form.userId).then(
    //       response => {
    //         this.disableSaveButton = false
    //         this.getDepartmentTreeCheckedKeys(response.data)
    //         response.data.forEach(dd => {
    //           dd.disabled = true
    //         })
    //         this.departTreeData = response.data
    //       }
    //     )
    //   }
    // },
    getUserTransfers() {
      userApi.getUserTransfers().then(response => {
        this.roles = response.data.roles
        this.groups = response.data.groups
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid, errorMsg) => {
        if (!valid) {
          messageUtils.showFormInvalidateMessage(errorMsg)
          return
        }
        delete this.form.authorities
        userApi.saveUser(this.form).then(response => {
          this.setFormData(response.data)
          messageUtils.showSaveSuccess()
        })
      })
    },
    setFormData(data) {
      this.form = data

      this.setTagsViewTitle()
      this.setPageTitle()
    },
    setTagsViewTitle() {
      const title = '修改用户'
      console.log(this.tempRoute)
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.form.userName}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改用户'
      document.title = `${title} - ${this.form.userName}`
    },
    getUserAssign(userId) {
      userApi.getUserAssign(userId).then(response => {
        // this.setTreeData(response.data)
      })
    },
    handleAssign() {
      this.disableSaveButton = false
      this.dialogAssignVisible = true

      // this.setTreeData()
      // this.dataBelong = dataBelong

      // this.treeData = this['treeData' + this.dataBelong]
      // this.treeCheckedKeys = this['treeCheckedKeys' + this.dataBelong]
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    getTreeCheckedKeys(data) {
      data.forEach(child => {
        if (child.checked && !child.disabled) {
          this.resources.push({
            type: child.type,
            menuId: child.menuId,
            menuButtonId: child.menuButtonId
          })
        }

        if (child.checked && child.type === 'menuButton') {
          this.treeCheckedKeys.push(child.id)
        }

        if (child.children && child.children.length > 0) {
          this.getTreeCheckedKeys(child.children)
        } else if (child.checked) {
          this.treeCheckedKeys.push(child.id)
        }
      })
    },
    saveUserAssign() {
      this.dialogAssignVisible = false

      this.form['resources' + this.dataBelong] = []
      this['treeCheckedKeys' + this.dataBelong] = []

      this.$refs.userAssigntree.getHalfCheckedNodes().forEach(node => {
        if (!node.disabled) {
          this.form['resources' + this.dataBelong].push({ type: node.type, menuId: node.menuId })
        //  this['treeCheckedKeys' + this.dataBelong].push(node.id)
        }
      })
      this.$refs.userAssigntree.getCheckedNodes().forEach(node => {
        if (!node.disabled) {
          this.form['resources' + this.dataBelong].push({
            type: node.type,
            menuId: node.menuId,
            menuButtonId: node.menuButtonId
          })
          this['treeCheckedKeys' + this.dataBelong].push(node.id)
        }
      })
    },
    getDepartmentTreeCheckedKeys(data) {
      data.forEach(child => {
        console.log(child.id + '-->' + this.form.primaryDepartmentId)
        child.icon = (child.id === this.form.primaryDepartmentId ? 'finish' : '')
        if (child.userId) {
          this.dapartTreeCheckedKeys.push(child.id)
        }

        if (child.children && child.children.length > 0) {
          this.getDepartmentTreeCheckedKeys(child.children)
        }
      })
    },
    saveUserDeparment() {
      this.form.departmentIds = []
      this.$refs.userDeparTree.getHalfCheckedNodes().forEach(node => {
        this.form.departmentIds.push(
          node.id
        )
      })
      this.$refs.userDeparTree.getCheckedNodes().forEach(node => {
        this.form.departmentIds.push(
          node.id
        )
      })

      this.dialogDepartmentVisible = false
    },
    handleDepartmentAssign() {
    //  if (this.form.departmentIds.length === 0) {
      this.getUserDepartmentTree()
      // }
    },
    rightClick(event, object, node, element) {
      if (node.checked) {
        this.menuVisible = node.checked
        this.currentNode = node
        this.currentTreeData = object

        var menu = document.querySelector('#menu')
        menu.style.left = event.clientX + 10 + 'px'
        document.addEventListener('click', this.foo)
        menu.style.top = event.clientY - 15 + 'px'
      }
    },
    foo() {
      this.menuVisible = false
      document.removeEventListener('click', this.foo)
    },
    menuClick() {
      this.currentTreeData.icon = 'finish'
      this.form.primaryDepartmentId = this.currentTreeData.id
      this.disablePrePrimaryDepartment(this.departTreeData, this.currentTreeData)
    },
    disablePrePrimaryDepartment(tree, currentNode) {
      if (tree && tree.length > 0) {
        tree.forEach(item => {
          if (item.id !== currentNode.id && item.icon === 'finish') {
            item.icon = ''
            return ''
          } else {
            this.disablePrePrimaryDepartment(item.children, currentNode)
          }
        })
      }
    },
    treeCheck(data, checkedNode, c) {
      const checked = checkedNode.checkedKeys.includes(data.id)
      if (checked) {
        if (!this.form.primaryDepartmentId) {
          data.icon = 'finish'
          this.form.primaryDepartmentId = data.id
        }
      } else {
        if (data.icon === 'finish') {
          data.icon = ''
          this.form.primaryDepartmentId = ''
          if (checkedNode.checkedNodes.length > 0) {
            checkedNode.checkedNodes[0].icon = 'finish'

            this.form.primaryDepartmentId = checkedNode.checkedNodes[0].id
          }
        }
      }
    },
    handleCancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
        this.$refs['form'].clearValidate()
        const visitedViews = this.$store.state.tagsView.visitedViews
        this.$router.push({ name: visitedViews[visitedViews.length - 1].name })
      })
    }
  }
}
</script>

<style   scoped>
.user-detail-dialog-wrap {
  height: 450px;

}
</style>
