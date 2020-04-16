<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterRef" :model="searchConditions" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="值列表编码">
              <el-input
                v-model="searchConditions.lookupTypeCode"
                placeholder="值列表编码"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="值列表描述">
              <el-input
                v-model="searchConditions.lookupType"
                placeholder="值列表描述"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right">
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleFilter"
              >查询</el-button>
              <el-button
                class="filter-item"
                icon="el-icon-refresh"
                size="small"
                @click="handleReset"
              >重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="filter-container">
      <el-button
        v-if="checkButtonPermission(['loopkupTypeCreate'])"
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="data"
      stripe
      fit
      highlight-current-row
      element-loading-text="加载中..."
      @current-change="handleCurrentRowChange"
    >
      <el-table-column sortable prop="lookupTypeCode" label="值列表编码">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.lookupTypeId)">{{ scope.row.lookupTypeCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="lookupType" label="值列表描述" />
      <el-table-column sortable prop="description" label="备注" />
      <el-table-column width="200px" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-row :gutter="4">
            <el-col :span="10">
              <el-button
                size="small"
                type="info"
                icon="el-icon-edit"
                @click="handleEdit(scope.row.lookupTypeId)"
              >编辑</el-button></el-col>
            <el-col :span="10">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.lookupTypeId)"
              >删除</el-button></el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10,20,50,100,300,400]"
      background
      style="text-align: center; margin-top:10px"
      :page-size="limit"
      layout="total,sizes, prev, pager, next"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="新增值列表" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <div>
          <el-form-item label="值列表编码">
            <el-input v-model="createdRow.lookupTypeCode" type="input" placeholder="请输入内容" />
          </el-form-item>
        </div>

        <el-form-item label="备注">
          <el-input v-model="createdRow.description" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disableConfirmButton" @click="saveCreatedRow()">确认</el-button>
        <el-button @click="createDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as lookupApi from '@/api/core/system/lookup'
import checkButtonPermission from '@/utils/permission'
import * as messageUtils from '@/utils/messageUtils'

const initialSearchConditions = {
  lookupTypeCode: null,
  lookupType: null
}
export default {
  name: 'LookupType',
  data() {
    return {
      limit: 10,
      listLoading: true,
      totalCount: 0,
      currentPage: 1,
      disableConfirmButton: false,
      createDialogVisible: false,
      currentRow: null,
      data: null,
      createdRow: {},
      searchConditions: { ...initialSearchConditions }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    checkButtonPermission,
    saveCreatedRow() {
      this.disableConfirmButton = true
      lookupApi.updateLookupType(this.createdRow).then(response => {
        this.disableConfirmButton = false
        this.createDialogVisible = false
        setTimeout(() => { this.$router.push(`/security/lookupCode/${response.data}`) }, 100)
      })
    },
    fetchData() {
      this.listLoading = true
      const filter = []
      for (const key in this.searchConditions) {
        const value = this.searchConditions[key]
        if (value && value !== '') {
          filter.push(key + ' contain ' + value)
        }
      }
      lookupApi
        .queryLookupTypeByCriteria({ currentPage: this.currentPage, limit: this.limit, filter: filter.join(',') })
        .then(response => {
          this.data = response.data.items
          this.totalCount = response.data.totalCount
          this.listLoading = false
        })
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    handleFilter() {
      this.fetchData()
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions }
      this.fetchData()
    },
    handleCreate() {
      this.createDialogVisible = true
      this.disableConfirmButton = false
    },
    handleEdit(lookupTypeId) {
      this.$router.push(`lookupCode/${lookupTypeId}`)
    },
    handleDelete(lookupTypeId) {
      messageUtils
        .showDeleteConfirm()
        .then(() => {
          lookupApi
            .deleteLookupType(lookupTypeId)
            .then(response => {
              messageUtils.showsDeleteSuccess()
              this.fetchData()
            })
        })
        .catch(() => {
          messageUtils.showsDeleteCancel()
        })
    },
    handleCurrentRowChange(currentRow) {
      this.currentRow = currentRow
    }
  }
}
</script>
