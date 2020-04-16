<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :disabled="!role.roleId"
        icon="el-icon-edit"
        @click="handleEdit"
      >修改</el-button>

      <el-button
        class="filter-item"
        :disabled="!role.roleId"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAssign()"
      > 分配权限</el-button>
      <el-button
        class="filter-item"
        :disabled="!role.roleId ||role.isPredefined==='Y'"
        type="primary"
        icon="el-icon-download"
        @click="handleDelete"
      >删除</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      element-loading-text="加载中..."
      @current-change="handleTableRowChange"
    >
      <el-table-column
        prop="roleName"
        label="角色"
      />
    </el-table>
    <el-pagination
      :page-sizes="[10,20,50,100, 300, 400]"
      :page-size="limit"
      layout="total,sizes, prev, pager, next"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="formRules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="role.roleName"
            type="input"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="disableSaveButton"
          @click="saveRole()"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="'分配权限'"
      :visible.sync="dialogAssignVisible"
    >
      <el-scrollbar class="user-detail-dialog-wrap" wrap-class="user-detail-dialog-wrap">

        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :props="treeProps"

          show-checkbox
          :default-checked-keys="treeCheckedKeys"
        >
          <span
            slot-scope="{ node,data }"
            class="app-tree-icon"
          >
            <svg-icon
              :icon-class="data.icon"
              :class="'resource_'+data.type"
            />
            <span> {{ node.label }} </span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAssignVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="disableSaveButton"
          @click="saveRoleAssign()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as roleApi from '@/api/core/security/role'
import {
  showDeleteConfirm,
  showSaveSuccess,
  showsDeleteSuccess,
  showsDeleteCancel
} from '@/utils/messageUtils'
export default {
  name: 'Role',
  data() {
    return {
      list: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      totalCount: 0,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      role: {},

      dialogFormVisible: false,
      dialogStatus: '',
      disableSaveButton: false,
      dialogAssignVisible: false,
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'title'
      },
      treeCheckedKeys: [],
      formRules: {

      }
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.role = {}
      roleApi
        .listRole({
          limit: this.limit,
          currentPage: this.currentPage,
          sort: '',
          keyword: ''
        })
        .then(response => {
          this.list = response.data.items
          this.listLoading = false
          this.totalCount = response.data.totalCount
        })
    },
    handleFilter() {

    },
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    handleCreate() {
      this.handleEdit()
      this.dialogStatus = 'create'

      this.role = {}
    },
    handleTableRowChange(row) {
      this.role = row
    },
    handleEdit() {
      this.dialogFormVisible = true
      this.disableSaveButton = false
      this.dialogStatus = 'update'
    },
    handleDelete() {
      showDeleteConfirm()
        .then(() => {
          roleApi
            .deleteRole(
              this.role.roleId
            )
            .then(response => {
              this.fetchData()
              showsDeleteSuccess()
            })
        })
        .catch(() => {
          showsDeleteCancel()
        })
    },
    saveRole() {
      this.disableSaveButton = true
      console.log(this.role)
      roleApi.saveRole(this.role).then(response => {
        this.dialogFormVisible = false

        this.disableSaveButton = false
        showSaveSuccess()
        this.fetchData()
      })
    },
    handleAssign() {
      this.dialogAssignVisible = true
      roleApi.getRoleAssign(this.role.roleId).then(response => {
        this.treeData = response.data
        this.treeCheckedKeys = []
        this.getTreeCheckedKeys(response.data)
      })
    },
    getTreeCheckedKeys(data) {
      data.forEach(child => {
        if (child.checked && child.type === 'menuButton') { this.treeCheckedKeys.push(child.id) }

        if (child.children && child.children.length > 0) { this.getTreeCheckedKeys(child.children) } else if (child.checked) {
          this.treeCheckedKeys.push(child.id)
        }
      })
    },
    saveRoleAssign() {
      const nodes = []
      this.disableSaveButton = true
      this.$refs.tree.getHalfCheckedNodes().forEach(node => {
        nodes.push({ type: node.type, menuId: node.menuId })
      })
      this.$refs.tree.getCheckedNodes().forEach(node => {
        nodes.push({ type: node.type, menuId: node.menuId, menuButtonId: node.menuButtonId })
      })

      //  .filter((value, index, arr) => value < 10000000);

      roleApi.saveRoleAssign(this.role.roleId, nodes).then(response => {
        // if (response.data == nodes.length) {
        this.dialogAssignVisible = false
        this.disableSaveButton = false

        showSaveSuccess()
        // }
      })
    }
  }
}
</script>
<style   scoped>
.user-detail-dialog-wrap {
  height:450px;

}
</style>
