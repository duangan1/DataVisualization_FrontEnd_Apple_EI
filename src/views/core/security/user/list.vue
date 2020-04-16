<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="5">
          <el-input
            v-model="searchConditions.userId"
            placeholder="用户Id"
            style="width: 99%;"
            type="number"
            clearable
            class="filter-item"
            @clear="handleFilter"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="searchConditions.userName"
            placeholder="用户名"
            style="width: 99%;"
            clearable
            class="filter-item"
            @clear="handleFilter"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="searchConditions.fullName"
            placeholder="用户姓名"
            style="width: 99%;"
            clearable
            class="filter-item"
            @clear="handleFilter"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :span="4">
          <div style="pdding-left: 10px;">
            <el-button
              class="filter-item"
              type="primary"
              icon="buttonSearch"
              @click="handleFilter"
            >查询</el-button>
            <!--  <el-button
              class="filter-item"
              icon="el-icon-refresh"
              @click="handleReset"
            >重置</el-button> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="action-container">
      <el-row type="flex">
        <el-col :span="18">
          <el-button
            v-if="checkButtonPermission(['userCreate'])"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >{{ $t('core.new') }}</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      element-loading-text="加载中..."

      @current-change="handleCurrentRowChange"
    >
      <el-table-column prop="userId" label="用户Id" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="fullName" label="用户姓名" />
      <el-table-column prop="dataPartitions" label="管理类别" />
      <el-table-column prop="jobTitle" label="职位" />
      <el-table-column prop="phoneNum" label="联系电话" />
      <el-table-column prop="departmentNamePart1" label="部门" />
      <el-table-column prop="departmentNamePart2" label="科室" />
      <!-- <el-table-column prop="primaryDepartmentFullName" label="主要部门" /> -->
      <el-table-column prop="email" label="电子邮件" />

      <el-table-column
        label="操作"
        width="130px"
      >
        <template slot-scope="scope">
          <el-link
            v-if="checkButtonPermission(['userUpdate'])"

            class="filter-item"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-link>
          <el-link
            v-if="checkButtonPermission(['userDelete'])"
            class="filter-item"
            type="primary"
            :disabled="scope.row.isPredefined==='Y'"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10,20,50,100, 300, 400]"
      :page-size="limit"
      layout="sizes, prev, pager, next"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
    />

  </div>
</template>

<script>
import * as userApi from '@/api/user'
import * as messageUtils from '@/utils/messageUtils'
import checkButtonPermission from '@/utils/permission' // 权限判断函数
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import * as lookup from '@/utils/lookup'

export default {
  name: 'UserList',
  data() {
    return {
      searchConditions: {
        userName: null,
        fullName: null
      },
      exportLoading: false,
      list: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      totalCount: 0,
      currentRow: null,
      filter: '',
      dataBelongList: []
    }
  },
  activated() {
    if (!this.listLoading) {
      this.fetchData()
    }
  },
  created() {
    this.handleCurrentPageChange(1)
  },
  methods: {
    checkButtonPermission,
    fetchData() {
      this.listLoading = true

      userApi.userList({
        limit: this.limit,
        currentPage: this.currentPage,
        filter: this.filter
      }).then(response => {
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
        this.list = response.data.items
        this.listLoading = false
        this.totalCount = response.data.totalCount
      })
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    handleCurrentRowChange(currentRow) {
      this.currentRow = currentRow
    },
    handleCreate() {
      this.$router.push(`/security/userCreate`)
    },
    handleEdit(row) {
      this.$router.push(`/security/userEdit/${row.userId}`)
    },
    handleFilter() {
      this.filter = ''
      if (this.searchConditions.userName != null) {
        this.filter =
          this.filter +
          ',t.userName CONTAIN ' +
          this.searchConditions.userName
      }
      if (this.searchConditions.userId != null) {
        this.filter =
          this.filter +
          ',t.userId eq ' +
          this.searchConditions.userId
      }

      if (this.searchConditions.fullName != null) {
        this.filter =
          this.filter +
          ',t.fullName CONTAIN ' +
          this.searchConditions.fullName
      }
      this.fetchData()
    },
    handleDelete(row) {
      messageUtils.showDeleteConfirm()
        .then(() => {
          userApi
            .deleteUser(
              row.userId
            )
            .then(response => {
              this.fetchData()
              messageUtils.showsDeleteSuccess()
            })
        })
        .catch(() => {
          messageUtils.showsDeleteCancel()
        })
    },
    handleExport() {
      this.exportLoading = true
      userApi.userList({
        limit: this.totalCount,
        currentPage: 1,
        filter: ''
      })
        .then(res => {
          var list = []
          res.data.items.forEach(v => {
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

            list.push({
              用户Id: v.userId,
              用户名: v.userName,
              用户姓名: v.fullName,
              管理类别: v.dataPartitions,
              职位: v.jobTitle,
              联系电话: v.phoneNum,
              部门: v.departmentNamePart1,
              科室: v.departmentNamePart2,
              电子邮件: v.email
            })
          })

          var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {}}
          var data = XLSX.utils.json_to_sheet(list)
          wb.Sheets['Sheet1'] = data
          var wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array'
          })
          try {
            // '用户_' + formatUtils.dateTimeFormat(new Date(), 'YYYYMMDDHHmmss') + '.xlsx'
            FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              '用户.xlsx'
            )
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          this.exportLoading = false
          return wbout
        })
    }
  }
}
</script>
