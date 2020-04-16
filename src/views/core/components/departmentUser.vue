<template>
  <div>
    <el-input
      v-model="innerUserName"
      :disabled="addedDisabled"
      clearable
      :placeholder="placeholder"
      class="input-with-select"
      @clear="clearInput"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        :disabled="addedDisabled"
        @click="showUserDialog"
      />
    </el-input>
    <el-dialog
      title="选择用户"
      :visible.sync="selectUserDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      append-to-body
      width="70%"
    >
      <el-container>
        <el-header>
          <el-form ref="filterRef" label-width="100px">
            <el-row>
              <el-col :span="7">
                <el-form-item label="部门名称">
                  <el-input v-model="deptName" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="用户姓名">
                  <el-input v-model="searchConditions.userName" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <!-- <el-form-item> -->
                <div :style="{float:'right'}">
                  <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                  <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
                  <el-button type="primary" icon="el-icon-check" @click="saveSelected()">确定</el-button>
                  <el-button icon="el-icon-close" @click="beforeDialogClose()">取消</el-button>
                </div>
                <!-- </el-form-item> -->
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-container>
          <el-aside width="240px">
            <el-scrollbar class="department-dialog-wrap" wrap-class="department-dialog-wrap">
              <el-tree
                v-if="deptData!=null && deptData.length!==0"
                ref="tree"
                :data="deptData"
                :props="defaultProps"
                node-key="id"
                :default-expanded-keys="defaultExpandedKeys"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                highlight-current
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </el-aside>
          <el-main>
            <div class="filter-container">
              选中用户：
              <el-tag
                v-for="tag in addedUsers"
                :key="tag.userId"
                :disable-transitions="false"
                effect="dark"
                :closable="true"
                :style="{margin:'0 3px'}"
                @close="deleteSelected(tag)"
              >{{ tag.fullName }}</el-tag>
            </div>
            <el-table v-loading="listLoading" :data="userData" border fit stripe>
              <el-table-column prop="userId" label="用户ID" width="60" />
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="fullName" label="用户姓名" width="100" />
              <el-table-column prop="dataPartitions" label="管理类别" width="80" />
              <el-table-column prop="jobTitle" label="职位" width="100" />
              <el-table-column prop="phoneNum" label="联系电话" width="100" />
              <el-table-column prop="departmentNamePart1" label="部门" width="170" />
              <el-table-column prop="departmentNamePart2" label="科室" width="200" />
              <el-table-column prop="email" label="电子邮件" width="150" />
              <el-table-column label="操作" fixed="right" align="center" width="70">
                <template slot-scope="scope">
                  <el-link
                    class="filter-item"
                    type="primary"
                    size="small"
                    icon="el-icon-plus"
                    @click="handleAdd(scope.row)"
                  >添加</el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :page-sizes="[10,15,20,30,50,100]"
              :page-size="limit"
              layout="sizes, prev, pager, next"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentPageChange"
            />
          </el-main>
        </el-container>
      </el-container>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelected()">确定</el-button>
        <el-button @click="beforeDialogClose()">取消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
import * as departmentApi from '@/api/core/security/department'
import * as userApi from '@/api/user'
import * as lookup from '@/utils/lookup'
const initialSearchConditions = {
  deptId: null,
  userName: null
}
export default {
  name: 'DepartmentUser',
  props: {
    addedDisabled: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false, default: '请选择' },
    multiple: { type: Boolean, required: true },
  },
  data() {
    return {
      deptData: null,
      userData: null,
      deptName: '',
      addedUsers: [],
      dataBelongList: [],
      defaultExpandedKeys: [],
      limit: 10,
      currentPage: 1,
      listLoading: false,
      totalCount: 0,
      innerUserName: '',
      selectUserDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchConditions: { ...initialSearchConditions }
    }
  },
  watch: {
    deptName() {
      this.$refs['tree'].filter(this.deptName)
    }
  },
  mounted() {
    this.fetchDeptData()
    this.fetchUserByName()
  },
  methods: {
    handleFilter() {
      // this.$refs['tree'].filter(this.searchConditions)
      this.fetchUserByName()
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions }
      this.deptName = ''
      this.fetchUserByName()
    },
    handleAdd(row) {
      const temp = this.addedUsers.find(item => item.userId === row.userId)
      if (!temp) {
        this.addedUsers.push({ ...row })
      }
      if(!this.multiple) {
        this.saveSelected()
      }
    },
    handleNodeClick(dept) {
      this.searchConditions.deptId = dept.id
      this.fetchUserByDept()
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    deleteSelected(val) {
      this.addedUsers.splice(this.addedUsers.indexOf(val), 1)
    },
    saveSelected() {
      this.innerUserName = this.addedUsers.map(item => item.fullName).join(',')
      this.selectUserDialogVisible = false
      this.$emit(
        'change',
        this.addedUsers.map(item => item.userId)
      )
    },
    clearInput() {
      this.innerUserName = ''
      this.addedUsers = []
      this.$emit('change', [])
    },
    showUserDialog() {
      this.selectUserDialogVisible = true
    },
    beforeDialogClose() {
      this.selectUserDialogVisible = false
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchUserByName()
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage
      this.fetchUserByName()
    },
    fetchDeptData() {
      departmentApi.findAllDataOnly().then(response => {
        this.deptData = response.data
        this.deptData.forEach(dept => {
          if (dept.parentDepartment === 0) {
            this.defaultExpandedKeys.push(dept.id)
          }
        })
      })
    },
    fetchUserByDept() {
      const filter = []
      for (const key in this.searchConditions) {
        const value = this.searchConditions[key]
        if (value && value !== '') {
          if (key === 'deptId') {
            filter.push('t.primaryDepartmentId eq ' + value)
          }
        }
      }
      this.fetchUserData(filter)
    },
    fetchUserByName() {
      const filter = []
      for (const key in this.searchConditions) {
        const value = this.searchConditions[key]
        if (value && value !== '') {
          if (key === 'userName') {
            filter.push('t.fullName contain ' + value)
          }
        }
      }
      this.fetchUserData(filter)
    },
    fetchUserData(filter) {
      this.listLoading = true
      lookup.queryLookup(['DATA_BELONG']).then(value => {
        this.dataBelongList = value['DATA_BELONG']
      })

      // const filter = []
      // for (const key in this.searchConditions) {
      //   const value = this.searchConditions[key]
      //   if (value && value !== '') {
      //     if (key === 'userName') {
      //       filter.push('t.fullName contain ' + value)
      //     }
      //     if (key === 'deptId') {
      //       filter.push('t.primaryDepartmentId eq ' + value)
      //     }
      //   }
      // }
      userApi
        .userList({
          limit: this.limit,
          currentPage: this.currentPage,
          filter: filter.join(',')
        })
        .then(response => {
          response.data.items.forEach(v => {
            if (v.primaryDepartmentFullName) {
              v.primaryDepartmentFullName.split
              const arr = v.primaryDepartmentFullName.split('/')
              v['departmentNamePart1'] = arr[0]
              if (arr.length > 1) {
                v['departmentNamePart2'] = arr[1]
              }
            }
            const arr = []
            if (v.dataBelong) {
              v.dataBelong.forEach(lb => {
                arr.push(lookup.queryLookupLabel(this.dataBelongList, lb))
              })
              v['dataPartitions'] = arr.join(',')
            }
          })
          this.userData = response.data.items
          this.listLoading = false
          this.totalCount = response.data.totalCount
        })
    }
  }
}
</script>
<style>
.department-dialog-wrap {
  height: 600px;
}
</style>
