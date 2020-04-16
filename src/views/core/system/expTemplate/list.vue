<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="keywords"
        placeholder="模板名称"
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
      <el-table-column prop="templateCode" label="模板编码" width="100" />
      <el-table-column prop="templateName" label="模板名称" width="240" />
      <el-table-column prop="templateTypeLabel" label="模板类型" width="80" />

      <el-table-column prop="template" label="模板路径/消息模板" show-overflow-tooltip />

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
      width="30%"
    >  <el-form
         ref="dataForm"

         label-position="left"
         label-width="70px"
       >
         <el-row>
           <el-col :span="24">
             <el-form-item label="模板编码">
               <el-input
                 v-model="currentRow.templateCode"
                 type="input"
                 :disabled="disabled"
               />
             </el-form-item>
             <el-form-item label="模板名称">
               <el-input
                 v-model="currentRow.templateName"
                 type="input"
               />
             </el-form-item>
             <el-form-item label="模板类型">
               <el-select
                 v-model="currentRow.templateType"
               >
                 <el-option
                   v-for="(item, index) in templateTypeLookup"
                   :key="index"
                   :label="item.label"
                   :value="item.value"
                 >
                   {{ item.label }}
                 </el-option>
               </el-select>

             </el-form-item>
             <el-form-item v-if="currentRow.templateType=='FILE'" label="模板路径">
               <el-input
                 v-model="currentRow.template"
                 type="input"
               />
             </el-form-item>
             <el-form-item v-else label="消息模板">
               <el-input
                 v-model="currentRow.template"
                 type="textarea"
                 :rows="9"
               />
             </el-form-item>
           </el-col>
         </el-row>

       </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogExpTemplateVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"

          @click="handleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as expTemplateApi from '@/api/core/system/expTemplate'
import * as messageUtils from '@/utils/messageUtils'
import checkButtonPermission from '@/utils/permission' // 权限判断函数
import * as lookup from '@/utils/lookup'

export default {
  name: 'UserList',
  data() {
    return {
      dialogExpTemplateVisible: false,
      list: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      totalCount: 0,
      currentRow: {},
      templateTypeLookup: [],
      keywords: ''

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
      lookup.queryLookup(['SYS_TEMPLATE_TYPE']).then(reponse => {
        this.templateTypeLookup = reponse.SYS_TEMPLATE_TYPE
      }).then(_ => {
        this.filter = ''
        if (this.keywords !== '') {
          this.filter =
          this.filter +
          ",t.templateName contain '" +
          this.keywords +
          "'"
        }
        expTemplateApi.list({
          filter: this.filter,
          limit: this.limit,
          currentPage: this.currentPage,
          sort: ''
        }).then(response => {
          response.data.items.forEach(item => {
            item.templateTypeLabel = lookup.queryLookupLabel(this.templateTypeLookup, item.templateType)
          })

          this.list = response.data.items

          this.listLoading = false
          this.totalCount = response.data.totalCount
        })
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
      this.currentRow = { type: 'MSG' }
      this.dialogExpTemplateVisible = true
    },
    handleSave() {
      expTemplateApi.save(this.currentRow).then(response => {
        this.fetchData()
        this.dialogExpTemplateVisible = false
        messageUtils.showSaveSuccess()
      })
    },
    handleEdit(row) {
      this.currentRow = Object.assign({}, row)
      this.dialogExpTemplateVisible = true
    }, handleFilter() {
      this.fetchData()
    }, handleDelete(row) {
      messageUtils.showDeleteConfirm()
        .then(() => {
          expTemplateApi
            .deleteExpTemplate(
              row.coreExpTemplateId
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
