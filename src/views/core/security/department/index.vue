<template>
  <el-container>
    <el-aside style="width: 300px; margin-top: 30px; padding: 0 5px">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-scrollbar class="department-dialog-wrap" wrap-class="department-dialog-wrap">
        <el-tree
          v-if="data!=null && data.length!==0"
          ref="tree"
          :data="data"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          @node-contextmenu="rightClick"
        />
        <el-button
          v-else-if="data!=null && data.length===0"
          class="filter-item"
          type="primary"
          size="small"
          style="margin-top:10px;"
          @click="handleAdd(true)"
        >添加顶层部门</el-button>
      </el-scrollbar>
      <div v-show="handleMenuVisible">
        <ul id="menu" class="menu">
          <li class="menu__item" @click="handleAdd(true)">添加顶层部门</li>
          <li class="menu__item" @click="handleAdd()">添加部门</li>
          <li class="menu__item" @click="handleDelete()">删除部门</li>
        </ul>
      </div>
    </el-aside>

    <el-container>

      <el-main v-if="selected">
        <div style="text-align: right">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="small"
            @click="handleSave"
          >保存</el-button>
        </div>
        <custFieldSet title="部门信息">
          <el-form
            ref="dataForm"
            size="small"
            :model="selected"
            :show-message="false"
            :rules="rules"
            label-position="right"
            label-width="120px"
            class="demo-form-inline"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门名称" prop="name">
                  <el-input v-model="selected.name" type="input" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示名称" prop="fullName">
                  <el-input v-model="selected.fullName" disabled type="input" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门编号" prop="departmentId">
                  <el-input v-model="selected.departmentId" type="input" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门代码" prop="departmentCode">
                  <el-input v-model="selected.departmentCode" type="input" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级部门">
                  <el-select v-model="selected.parentDepartment" :disabled="!selected.parentDepartment" placeholder="顶层部门不可编辑">
                    <el-option
                      v-for="item in departmentLookup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类别">
                  <el-input v-model="selected.type" type="input" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="民品业务负责人">
                  <el-select v-model="selected.handlers" multiple filterable placeholder="请选择" clearable>
                    <el-option
                      v-for="item in userLookup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="军工业务负责人">
                  <el-select v-model="selected.owners" multiple filterable placeholder="请选择" clearable>
                    <el-option
                      v-for="item in userLookup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-col :span="12">
                <el-form-item label="管理类别">
                  <el-select v-model="selected.dataPartitions" multiple filterable placeholder="请选择">
                    <el-option
                      v-for="item in dataPartitionsLookup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col> -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话">
                  <el-input v-model="selected.phone" type="input" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <el-input v-model="selected.comment" :rows="3" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-row>
          </el-form>
        </custFieldSet>

        <custFieldSet title="部门人员">
          <el-row>
            <div>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                size="small"
                @click="handleCreateUser"
              >新增用户</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                size="small"
                @click="handleAddUser"
              >添加用户</el-button>
            </div>
          </el-row>
          <el-table
            :data="selected.users"
            border
            fit
            stripe
          >
            <!-- <el-table-column sortable label="部门负责人">
              <template slot-scope="scope">
                <i v-if="scope.row.userId == selected.owner" class="el-icon-success" />
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="fullName" sortable label="姓名" />
            <el-table-column prop="userName" sortable label="用户名" /> -->
            <el-table-column prop="userId" label="用户Id" />
            <el-table-column prop="userName" label="用户名" />
            <el-table-column prop="fullName" label="用户姓名" />
            <el-table-column prop="dataPartitions" label="管理类别" />
            <el-table-column prop="jobTitle" label="职位" />
            <el-table-column prop="phoneNum" label="联系电话" />
            <el-table-column prop="departmentNamePart1" label="部门" />
            <el-table-column prop="departmentNamePart2" label="科室" />
            <el-table-column prop="email" label="电子邮件" />
          </el-table>
        </custFieldSet>

        <el-dialog
          title="添加用户"
          :visible.sync="createDialogVisible"
          :close-on-click-modal="false"
        >
          <!--             filterable
            :filter-method="filterMethod"
                        filter-placeholder="请输入"-->
          <!-- <el-transfer
            v-model="chooseUsers"
            :data="candidates"
            :props="{
              key: 'id',
              label: 'fullName'
            }"
          /> -->
          <el-transfer
            ref="transfer"
            v-model="chooseUsers"
            :data="candidates"
            :props="{
              key: 'userId',
              label: 'fullName'
            }"
            :titles="['候选用户', '添加到部门']"
          />

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="disableConfirmButton" size="small" @click="saveAddUser">保存</el-button>
            <el-button size="small" @click="cancelAddUser">取消</el-button>
          </div>
        </el-dialog>

        <!-- <h4>系统信息</h4>
        <el-form
          :inline="true"
          size="small"
          label-position="right"
          label-width="100px"
          class="demo-form-inline"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="创建人">
                <el-input v-model="selected.creatorName" disabled type="input" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="selected.createdAt"
                  disabled
                  type="datetime"
                  style="width: 200px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新人">
                <el-input v-model="selected.updaterName" disabled type="input" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新时间">
                <el-date-picker
                  v-model="selected.updatedAt"
                  disabled
                  type="datetime"
                  style="width: 200px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import * as departmentApi from '@/api/core/security/department'
import * as messageUtils from '@/utils/messageUtils'
import * as lookup from '@/utils/lookup'

export default {
  name: 'Department',
  data() {
    const validateName = (rule, value, callback) => {
      if (value == null || value === '') {
        return
      }
      this.validateDepartmentName(this.selected.id, value).then(response => {
        // if (response.data) {
        //   callback(new Error('部门名称不能重复'))
        // }
        callback()
      })
    }
    return {
      selected: null,
      selectedDepartment: null,
      filterText: '',
      data: null,
      candidates: [],
      defaultExpandedKeys: [],
      chooseUsers: [],
      disableSaveButton: false,
      disableConfirmButton: false,
      departmentLookup: [],
      userLookup: [],
      dataPartitionsLookup: [],
      handleMenuVisible: false,
      createDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称' },
          { validator: validateName }
        ],
        departmentId: { required: true, message: '请输入部门编号' },
        departmentCode: { required: true, message: '请输入部门代码' }
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchData()
    this.fetchLookup()
  },
  methods: {
    findSelectedId() {
      let id
      if (this.selected != null) {
        id = this.selected.id
      }
      return id
    },
    cancelAddUser() {
      this.createDialogVisible = false
    },
    saveAddUser() {
      // 这里id必不可能为空，因为打开dialog前已经判定
      const id = this.findSelectedId()
      if (this.chooseUsers.length === 0) {
        messageUtils.showsInfoMessage('请选择添加的用户')
        return
      }
      departmentApi.assignUsersToDepartment(id, this.chooseUsers).then(response => {
        this.selected = this.formatDept(response.data)
        this.createDialogVisible = false
      })
    },
    handleCreateUser() {
      this.$router.push(`/security/userCreate`)
    },
    handleAddUser() {
      const id = this.findSelectedId()
      if (id == null) {
        messageUtils.showsErrorMessage('新建部门时，需要保存部门后才能添加用户')
        return
      }

      this.fetchCandidateUsers().then(() => {
        this.createDialogVisible = true
      })
    },
    validateDepartmentName(id, name) {
      return departmentApi.findByName(id, name)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.selected = this.formatDept(data)
    },
    handleAdd(isTop) {
      let created = null
      if (isTop) {
        created = { parentDepartment: 0 }
        this.data.push(created)
      } else {
        created = { parentDepartment: this.selectedDepartment.id }
        this.selectedDepartment.children.push(created)
      }
      this.selected = created
      this.handleMenuVisible = false
    },
    handleDelete() {
      if (this.selectedDepartment.children.length !== 0) {
        messageUtils.showsInfoMessage('该部门下有子部门，请先删除子部门')
      } else {
        const departmentId = this.selectedDepartment.id
        messageUtils
          .showDeleteConfirm()
          .then(() => {
            departmentApi
              .deleteById(departmentId)
              .then(response => {
                messageUtils.showsDeleteSuccess()
                this.fetchData()
              })
          })
          .catch(() => {
            messageUtils.showsDeleteCancel()
          })
      }
    },
    cancelHandle() {
      // 取消鼠标监听事件 菜单栏
      this.handleMenuVisible = false
      document.removeEventListener('click', this.foo)
    },
    rightClick(event, object, node, element) {
      this.selectedDepartment = object
      this.handleMenuVisible = true
      const menu = document.querySelector('#menu')
      menu.style.left = event.clientX + 10 + 'px'
      document.addEventListener('click', this.cancelHandle)
      menu.style.top = event.clientY - 15 + 'px'
    },
    handleSave() {
      this.disableSaveButton = true
      this.$refs['dataForm'].validate((valid, invalidateMsg) => {
        if (!valid) {
          messageUtils.showFormInvalidateMessage(invalidateMsg)
          return
        }
        departmentApi.save(this.selected).then(response => {
          this.selected = response.data
          this.fetchData()
          messageUtils.showSaveSuccess()
        })
      })
    },
    fetchLookup() {
      const lookupTypes = [lookup.LOOKUP_KEY.DataPartition]
      lookup.queryLookup(lookupTypes).then(value => {
        this.dataPartitionsLookup = value[lookup.LOOKUP_KEY.DataPartition]
      })
    },
    fetchDynamicLookup() {
      return lookup.queryDynamicLookup(['department', 'principal']).then(value => {
        this.departmentLookup = value.department
        this.userLookup = value.principal
      })
    },
    fetchCandidateUsers() {
      const id = this.findSelectedId()
      const params = { id: id }
      return departmentApi.findCandidateUsers(params).then(response => {
        this.candidates = response.data
      })
    },
    fetchData() {
      this.fetchDynamicLookup().then(() => {
        departmentApi.findAll().then(response => {
          this.data = response.data
          this.data.forEach(dept => {
            if (dept.parentDepartment === 0) {
              this.defaultExpandedKeys.push(dept.id)
            }
          })
        })
      })
    },
    formatDept(dept) {
      this.$set(dept, 'handlers', [])
      this.$set(dept, 'owners', [])
      if (dept.handler) {
        dept.handlers = dept.handler.split(',').map(item => parseInt(item))
      }
      if (dept.owner) {
        dept.owners = dept.owner.split(',').map(item => parseInt(item))
      }
      return dept
    }
  }
}
</script>
<style>
.department-dialog-wrap{
 height: 400px;
}

</style>
