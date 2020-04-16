<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="关键字"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button

        class="filter-item"
        type="primary"
        icon="buttonSearch"
        size="small"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="handleCreate"
      >新增</el-button>

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
      <el-table-column prop="taskName" label="任务名称" width="200" />
      <el-table-column prop="cron" label="Cron" width="100" />
      <el-table-column prop="className" label="类名" width="320" />
      <el-table-column prop="methodName" label="类方法" />
      <el-table-column prop="status" label="状态" width="80" />
      <el-table-column prop="message" label="消息" width="80" show-overflow-tooltip />

      <el-table-column
        label="操作"
        width="130px"
      >
        <template slot-scope="scope">
          <el-link

            class="filter-item"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-link>
          <el-link
            class="filter-item"
            type="primary"
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
    <el-dialog
      title="模板"
      :visible.sync="dialogExpTemplateVisible"
      :close-on-click-modal="false"
      width="300"
    >  <el-form
         ref="dataForm"

         label-position="left"
         label-width="70px"
       >
         <el-row>
           <el-col :span="24">
             <el-form-item label="任务名称">
               <el-input
                 v-model="currentRow.taskName"
                 type="input"
               />
             </el-form-item>
             <el-form-item label="Cron">
               <el-input
                 v-model="currentRow.cron"
                 type="input"
               />
             </el-form-item>
             <el-form-item label="类名">
               <el-input
                 v-model="currentRow.className"
                 type="input"
               />
             </el-form-item>
             <el-form-item label="类方法">
               <el-input
                 v-model="currentRow.methodName"
                 type="input"
               />
             </el-form-item>
           </el-col>
         </el-row>

       </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogExpTemplateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as scheduleApi from '@/api/core/system/schedule'
import * as messageUtils from '@/utils/messageUtils'
import checkButtonPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'UserList',
  data() {
    return {
      dialogExpTemplateVisible: false,
      list: [],
      listLoading: true,
      limit: 10,
      currentPage: 1,
      totalCount: 0,
      currentRow: {},
      templateTypeLookup: []

    }
  },
  computed: {
    disabled() {
      return !!this.currentRow.coreExpTemplateId
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

      scheduleApi.list({
        limit: this.limit,
        currentPage: this.currentPage,
        sort: ''
      }).then(response => {
        debugger
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
    // this.currentRow = currentRow
    },
    handleCreate() {
      this.currentRow = { }
      this.dialogExpTemplateVisible = true
    },
    handleSave() {
      scheduleApi.save(this.currentRow).then(response => {
        this.fetchData()
        this.dialogExpTemplateVisible = false
        messageUtils.showSaveSuccess()
      })
    },
    handleEdit(row) {
      this.currentRow = Object.assign({}, row)
      this.dialogExpTemplateVisible = true
    }, handleFilter() {

    }, handleDelete(row) {
      messageUtils.showDeleteConfirm()
        .then(() => {
          scheduleApi
            .deleteExpTemplate(
              row.scheduleTaskId
            )
            .then(response => {
              this.fetchData()
              messageUtils.showsDeleteSuccess()
            })
        })
        .catch(() => {
          messageUtils.showsDeleteCancel()
        })
    }
  }
}
</script>
