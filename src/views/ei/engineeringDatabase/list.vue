<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.projectId"
            class="filter-item"
            style="width: 99%;"
            multiple
            :placeholder="$t('route.project')"
          >
            <el-option
              v-for="item in projectLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchConditions.partNo"
            class="filter-item"
            style="width: 99%;"
            :placeholder="$t('route.part')"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.vendorId"
            class="filter-item"
            style="width: 99%;"
            multiple
            :placeholder="$t('route.vendor')"
          >
            <el-option
              v-for="item in vendorLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.build"
            class="filter-item"
            style="width: 99%;"
            multiple
            :placeholder="$t('route.build')"
          >
            <el-option
              v-for="item in buildLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :span="8">
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
          <el-upload
            class="upload-button"
            :action="uploadURL"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
          >

            <el-button
              type="primary"
              icon="el-icon-upload"
              :loading="uploading"
            >{{ $t('core.upload') }}</el-button>
          </el-upload>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            :loading="exportLoading"
            :disabled="!currentRow"
            @click="handleDownload"
          >{{ $t('core.download') }}</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >{{ $t('core.exportList') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      id="out-table"
      ref="recordTableRef"
      v-loading="listLoading"
      :data="data"
      border
      stripe
      fit
      highlight-current-row
      element-loading-text="Loading..."
      @current-change="handleCurrentRowChange"
    >
      <el-table-column sortable prop="headerId" width="50" label="ID" />
      <el-table-column prop="title" :label="$t('core.title')" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="project" :label="$t('route.project')" />
      <el-table-column sortable prop="partNo" :label="$t('ei.part.partNo')" />
      <el-table-column sortable prop="vendor" :label="$t('route.vendor')" />
      <el-table-column sortable prop="build" :label="$t('route.build')" />
      <el-table-column sortable prop="versionNo" :label="$t('ei.summary.versionNo')" />
      <el-table-column sortable prop="createdAt" :label="$t('core.createdAt')" :formatter="dateTimeFormat" />
      <el-table-column sortable prop="creatorName" :label="$t('core.creatorName')" />
      <el-table-column
        width="100"
        class-name="small-padding fixed-width"
        align="center"
        label="Operations"
      >
        <template slot-scope="scope">
          <!-- <el-link
            type="primary"
            icon="el-icon-edit"
            style="margin-right: 5px"
            @click="handleEdit(scope.row.id)"
          >Go To Detail</el-link> -->
          <el-link
            type="primary"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.headerId)"
          >{{ $t('core.delete') }}</el-link>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import checkButtonPermission from '@/utils/permission'
import { mapLookupLabel } from '@/utils/mapping'
import * as lookup from '@/utils/lookup'
import * as engDbApi from '@/api/ei/engDbApi'
import * as formatUtils from '@/utils/formatUtils'
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import * as requestApi from '@/utils/request'
import {
  showDeleteConfirm,
  showsDeleteSuccess,
  showsDeleteCancel
} from '@/utils/messageUtils'
import { Message } from 'element-ui'

const initialSearchConditions = {
  projectId: [],
  vendorId: [],
  build: [],
  partNo: ''
}

export default {
  name: 'EngDbPpList',
  components: {},
  data() {
    return {
      uploading: false,
      uploadURL: requestApi.baseURL + '/ei/engDbPp/upload',
      partLookup: [],
      buildLookup: [],
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
      count: 1
    }
  },
  computed: { ...mapGetters(['userId']) },
  created() {
    eventBus.$on('engDbPp-list-update', () => {
      this.fetchData()
    })
    this.fetchData()
    this.fetchLookup()
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
    handleUploadSuccess(response) {
      if (response.code !== 20000) {
        Message({
          message: response.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.uploading = false
      this.fetchData()
    },
    handleUploadError(res) {
    },
    handleFilter() {
      this.filter = ''

      if (this.searchConditions.projectId.length > 0) {
        this.filter =
          this.filter + ',t.projectId in ' + this.searchConditions.projectId.join(' ')
      }

      if (this.searchConditions.vendorId.length > 0) {
        this.filter =
          this.filter + ',t.vendorId in ' + this.searchConditions.vendorId.join(' ')
      }

      if (this.searchConditions.build.length > 0) {
        this.filter =
          this.filter + ',t.build in ' + this.searchConditions.build.join(' ')
      }

      if (this.searchConditions.partNo !== '') {
        this.filter =
          this.filter + ',t.partNo CONTAIN ' + this.searchConditions.partNo
      }
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions }
      this.filter = ''
      this.fetchData()
    },
    handleUpload() {
      console.log('handleUpload...')
    },
    handleEdit(id) {
      console.log('handleEdit...')
    },
    handleDelete(id) {
      console.log('handleDelete...')
      showDeleteConfirm()
        .then(() => {
          engDbApi.deleteById(id).then(response => {
            this.fetchData()
            showsDeleteSuccess()
          })
        })
        .catch(() => {
          showsDeleteCancel()
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
      const lookupTypes = [
        'EI_BUILD']
      lookup.queryLookup(lookupTypes).then(value => {
        this.buildLookup = value['EI_BUILD']
      })
      lookup
        .queryDynamicLookup(['vendor', 'project', 'part'])
        .then(value => {
          this.vendorLookup = value.vendor
          this.projectLookup = value.project
          this.partLookup = value.part
        })
    },
    fetchData() {
      this.listLoading = true
      engDbApi.searchPpHeader(
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
    handleDownload() {
      window.location.href = requestApi.baseURL +
        '/ei/engDbPp/download/' +
        this.currentRow.headerId
    },
    handleExport() {
      this.exportLoading = true
      engDbApi.searchPpHeader(
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
              'Header Id': v.headerId,
              Title: v.title
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
            // 'Engineering Data Base List_' + formatUtils.dateTimeFormat(new Date(), 'YYYYMMDDHHmmss') + '.xlsx'
            FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              'Engineering Data Base List.xlsx'
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

<style lang="scss" scoped>
.el-icon-arrow-down {
    font-size: 12px;
}

.fw-80p {
  width: 80%;
}

.link-text {
  color: #409eff;
}
</style>
