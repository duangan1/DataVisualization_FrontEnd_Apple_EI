<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="4">
          <el-input
            v-model="searchConditions.vendorNo"
            class="filter-item"
            style="width: 99%;"
            placeholder="Vendor NO."
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchConditions.fullName"
            class="filter-item"
            style="width: 99%;"
            placeholder="Full Name"
          />
        </el-col>

        <el-col :span="16">
          <div style="text-align: right">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >{{ $t('core.search') }}</el-button>
            <el-button
              class="filter-item"
              icon="el-icon-refresh"
              @click="handleReset"
            >{{ $t('core.reset') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="action-container">
      <el-row type="flex">
        <el-col :span="18">

          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="handleUpload"
          >{{ $t('core.upload') }}</el-button>

          <el-button
            class="filter-item"
            type="primary"

            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >{{ $t('core.exportList') }}</el-button>
          <el-button
            class="filter-item"
            type="primary"

            icon="el-icon-plus"
            :loading="exportLoading"
            @click="handleAdd"
          >{{ $t('core.new') }}</el-button>
          <el-button
            class="filter-item"
            type="primary"
            :disabled="!currentRow"
            icon="el-icon-edit"
            :loading="exportLoading"
            @click="handleEdit"
          >{{ $t('core.edit') }}</el-button>
          <el-button
            class="filter-item"
            :disabled="!currentRow"
            type="primary"
            icon="el-icon-delete"
            :loading="exportLoading"
            @click="handleDelete"
          >{{ $t('core.delete') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table

      ref="vendorTable"
      v-loading="listLoading"
      :data="data"
      border
      stripe
      fit
      highlight-current-row
      element-loading-text="Loading..."
      @current-change="handleCurrentRowChange"
    >

      <el-table-column sortable prop="vendorNo" label="Vendor#" />
      <el-table-column sortable prop="fullName" label="Full Name" />
      <el-table-column sortable prop="description" label="Description" />

    </el-table>
    <el-pagination
      v-if="data"
      :page-sizes="[10,20,50,100,300,400]"
      :page-size="limit"
      background
      style="text-align: center; margin-top:10px"
      layout="total,sizes, prev, pager, next"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="Vendor" :visible.sync="editDialogVisible" width="70%" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :show-message="false"
        :model="editRow"
        :rules="formRules"
      >
        <el-row>

          <el-col :span="12">
            <el-col :span="24">
              <el-form-item label="Vendor#" prop="vendorNo">
                <el-input v-model="editRow.vendorNo" type="input" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Full Name" prop="fullName">
                <el-input v-model="editRow.fullName" type="input" />
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Description" prop="description">
              <el-input v-model="editRow.description" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEditRow()">{{ $t('core.confirm') }}</el-button>
        <el-button @click="editDialogVisible = false">{{ $t('core.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Upload" :visible.sync="uploadDialogVisible" width="70%" :close-on-click-modal="false">

      <el-input v-model="upload.data" type="textarea" :rows="10" :placeholder="$t('core.useExportAsTemplate')" />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadData()">{{ $t('core.confirm') }}</el-button>
        <el-button @click="uploadDialogVisible = false">{{ $t('core.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import checkButtonPermission from '@/utils/permission'
import { mapLookupLabel } from '@/utils/mapping'
// import * as lookup from '@/utils/lookup'
import * as vendorApi from '@/api/ei/vendor'
import * as formatUtils from '@/utils/formatUtils'
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import * as requestApi from '@/utils/request'
import * as messageUtils from '@/utils/messageUtils'

const initialSearchConditions = {
  vendorNo: '',
  fullName: ''
}

export default {
  name: 'EngDbPpList',
  components: {},
  data() {
    return {
      uploading: false,
      uploadURL: requestApi.baseURL + '/ei/engDbPp/upload',
      typeLookup: [],
      projectLookup: [],
      vendorLookup: [],
      exportLoading: false,
      searchConditions: { ...initialSearchConditions },
      currentRow: null,
      listLoading: false,
      data: null,
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      count: 1,
      editDialogVisible: false,
      editRow: {},
      uploadDialogVisible: false,
      upload: { data: '' },
      formRules: {
        vendorNo: { required: true, message: this.$t('ei.vendor.rule.vendorNo'), trigger: 'blur' },
        fullName: { required: true, message: this.$t('ei.vendor.rule.fullName'), trigger: 'blur' }
      }
    }
  },
  computed: { ...mapGetters(['userId']) },
  created() {
    eventBus.$on('engDbPp-list-update', () => {
      this.fetchData()
    })
    this.fetchData()
    // this.fetchLookup()
  },
  methods: {
    mapLookupLabel,
    dateTimeFormat: formatUtils.tableDateTimeFormat,
    dateFormat: formatUtils.dateFormat,
    tableDateFormat: formatUtils.tableDateFormat,
    checkButtonPermission,
    handleSearch() {
      this.handleFilter()
      this.fetchData()
    },
    handleBeforeUpload() {
      this.uploading = true
      return true
    },
    handleUpload() {
      this.uploadDialogVisible = true
    },
    handleFilter() {
      this.filter = ''

      if (this.searchConditions.vendorNo !== '') {
        this.filter =
          this.filter + ',t.vendorNo contain ' + this.searchConditions.vendorNo
      }

      if (this.searchConditions.fullName !== '') {
        this.filter =
          this.filter + ',t.fullName contain ' + this.searchConditions.fullName
      }
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions }
      this.filter = ''
      this.fetchData()
    },

    handleDelete(id) {
      messageUtils.showDeleteConfirm()
        .then(() => {
          debugger
          vendorApi.remove(this.currentRow.vendorId).then(response => {
            this.fetchData()
            messageUtils.showsDeleteSuccess()
          })
        })
    },
    handleCurrentRowChange(currentRow) {
      this.currentRow = currentRow
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    fetchLookup() {
      console.log('fetchLookup...')
      /* const lookupTypes = [
        'MAINTAIN_RECORD_STATUS']
      lookup.queryLookup(lookupTypes).then(value => {
        this.recordStatusList = value['MAINTAIN_RECORD_STATUS']
      }) */
    },
    fetchData() {
      this.listLoading = true
      vendorApi.select(
        {
          currentPage: this.currentPage,
          limit: this.limit,
          filter: this.filter
        }
      )
        .then((response) => {
          this.data = response.data.items
          this.totalCount = response.data.totalCount
          this.listLoading = false
        })
    },
    handleExport() {
      this.exportLoading = true
      vendorApi.select(
        {
          currentPage: 1,
          limit: this.totalCount,
          filter: this.filter
        }
      )
        .then(res => {
          var list = []
          res.data.items.forEach(v => {
            list.push({
              'vendor No': v.vendorNo,
              'Full Name': v.fullName,
              'Description': v.description
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
            FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              'Vendor.xlsx'
            )
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          this.exportLoading = false
          return wbout
        })
    },
    handleAdd() {
      this.editRow = { }
      this.editDialogVisible = true
    },
    handleEdit() {
      this.editRow = Object.assign({}, this.currentRow)
      this.editDialogVisible = true
    },
    saveEditRow() {
      this.$refs['dataForm'].validate((valid, invalidateMsg) => {
        if (!valid) {
          messageUtils.showFormInvalidateMessage(invalidateMsg)
          return
        } else {
          vendorApi.save(this.editRow).then(res => {
            messageUtils.showSaveSuccess()
            this.fetchData()
            this.editDialogVisible = false
          })
        }
      })
    },
    uploadData() {
      if (this.upload.data !== '') {
        vendorApi.upload(this.upload).then(res => {
          messageUtils.showUploadCounterSuccess(res.data)
          this.fetchData()
          this.uploadDialogVisible = false
        })
      } else {
        messageUtils.showsErrorMessage(this.$t('core.noDataFound'))
      }
    }
  }
}
</script>

