<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="3">
          <el-input
            v-model="searchConditions.title"
            class="filter-item"
            style="width: 99%;"
            clearable
            placeholder="Title"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.project"
            class="filter-item"
            style="width: 99%;"
            multiple
            placeholder="Project"
          >
            <el-option
              v-for="item in projectLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="searchConditions.partNo"
            class="filter-item"
            style="width: 99%;"
            placeholder="Part NO."
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.vendor"
            class="filter-item"
            style="width: 99%;"
            multiple
            placeholder="Vendor"
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
            placeholder="Build"
          >
            <el-option
              v-for="item in buildLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :span="6">
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
      <el-row>
        <el-col :span="18">
          <el-upload
            class="upload-button"
            :action="uploadURL"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProcess"
          >

            <el-button
              type="primary"
              icon="el-icon-upload"
              :loading="uploading"
            >{{ $t('core.upload') }}</el-button>
          </el-upload>
          <el-button
            type="primary"
            icon="el-icon-download"
            :disabled="currentRow.uploadStatus!='Success'"
            @click="handleDownload"
          >{{ $t('core.download') }}</el-button>
          <el-button
            type="primary"
            icon="app-icon-JMP"

            :disabled="currentRow.uploadStatus!='Success' || currentRow.jmpStatus=='Running'"
            @click="generateJMP"
          >{{ $t('ei.cellQual.generateJMP') }}</el-button>
          <el-button
            type="primary"
            icon="app-icon-JMP"

            :disabled="currentRow.jmpStatus!='Success'"
            @click="downloadJMP"
          >{{ $t('ei.cellQual.downloadJMP') }}</el-button>

          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            :disabled="currentRow.uploadStatus!='Success'"
            :loading="createLoading"
            @click="handleCreate"
          >Generate Summary</el-button>
        </el-col>

        <el-col :span="6">{{ uploadMessage }}</el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
      @current-change="tableCurrentChange"
    >
      <el-table-column sortable prop="headerId" width="50" label="ID" />
      <el-table-column :label="$t('ei.cellQual.title')" width="350">
        <template scope="scope">{{ scope.row.uploadFileName?scope.row.uploadFileName:scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="project" :label="$t('ei.cellQual.project')" />
      <el-table-column prop="build" :label="$t('ei.cellQual.build')" />
      <el-table-column prop="partNo" :label="$t('ei.cellQual.partNo')" width="90" />
      <el-table-column prop="partVersion" :label="$t('ei.cellQual.partVersion')" width="100" />
      <el-table-column prop="vendor" :label="$t('ei.cellQual.vendor')" />
      <el-table-column prop="cncSatation" :label="$t('ei.cellQual.cncSatation')" width="90" />
      <el-table-column prop="dataRound" :label="$t('ei.cellQual.dataRound')" />
      <el-table-column prop="updatedAt" :label="$t('ei.cellQual.updatedAt')" width="140" :formatter="tableDateTimeFormat" />
      <el-table-column prop="uploadStatus" :label="$t('ei.cellQual.uploadStatus')" width="100" />
      <el-table-column prop="jmpStatus" :label="$t('ei.cellQual.jmpStatus')" width="80" />
      <el-table-column
        prop="message"
        :label="$t('ei.cellQual.message')"
        width="100/>
    </el-table>
    <el-pagination
      v-if="
        table-data-
        :page-sizes="[10,20,50,100,300,400]"
        :page-size="limit"
        background
        style="text-align: center; margin-top:10px"
        layout="total,sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-table></div>
</template>

<script>
const initialSearchConditions = {
  title: '',
  project: '',
  vendor: '',
  build: '',
  partNo: ''
}
import * as lookup from '@/utils/lookup'
import * as messageUtils from '@/utils/messageUtils'
import * as cellQualDataApi from '@/api/ei/cellQualData'
import * as formatApi from '@/utils/formatUtils'
import * as requestApi from '@/utils/request'
import * as summaryApi from '@/api/ei/dimSummaryApi'
import { notify } from '@/utils/webSocketUtils'

import {
  showSaveSuccess
} from '@/utils/messageUtils'

export default {
  data() {
    return {
      createLoading: false,
      searchConditions: { ...initialSearchConditions },
      uploadURL: requestApi.baseURL + '/ei/cellQualData/upload',
      uploading: false,
      tableData: [],
      currentRow: { status: '', uploadStatus: '' },
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      filter: '',
      partLookup: [],
      buildLookup: [],
      projectLookup: [],
      vendorLookup: [],
      uploadMessage: ''
    }
  },
  mounted() {
    this.handleFilter()
    this.loadData()
    this.fetchLookup()
    notify('uploadCellQualProcess', this.notifyCallback)
  },
  methods: {
    tableDateTimeFormat: formatApi.tableDateTimeFormat,
    notifyCallback(msg) {
      this.uploadMessage = msg.message

      if (msg.message.startsWith('Success') || msg.message.startsWith('Error')) {
        this.loadData()
      }
      // this.uploadMessage =
    //  if (this.loading) { this.loading.setText(msg.message) }
      // console.log(msg.data)
    },
    handleCreate() {
      console.log('handleCreate...')
      this.createLoading = true
      summaryApi.createSummary(this.currentRow.headerId).then(response => {
        showSaveSuccess()
        this.createLoading = false
      }).catch(() => {
        this.createLoading = false
      })
    },
    handleSearch() {
      this.handleFilter()
      this.loadData()
    },
    loadData() {
      debugger
      this.currentRow = { status: '' }
      cellQualDataApi.select({ currentPage: this.currentPage,
        limit: this.limit,
        filter: this.filter }).then(response => {
        this.tableData = response.data.items
        this.totalCount = response.data.totalCount
      })
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
    tableCurrentChange(row) {
      this.currentRow = Object.assign({ status: '' }, row)
    },
    handleBeforeUpload() {
      messageUtils.showsSuccessMessage('Uploading is in background,Pelase wait.')
      setTimeout(() => {
        this.loadData()
      }, 2000)
      return true
    },
    handleUploadSuccess(response) {
      if (response.code !== 20000) {
        messageUtils.showsErrorMessage(response.message)
      } else {
        messageUtils.showUploadSuccess()
      }

      this.loadData()
    },
    handleUploadError() {
      this.uploading = false
    },
    handleProcess(a, b, c, d) {
      debugger
    },

    handleValidate() {
      setTimeout(() => {
        this.loadData()
      }, 2000)
      cellQualDataApi.validate(this.currentRow).then(() => {
        this.loadData()
      })
    },
    handleApply() {
      setTimeout(() => {
        this.loadData()
      }, 2000)
      cellQualDataApi.apply(this.currentRow).then(() => {
        this.loadData()
      })
    },
    handleDownload() {
      document.location.href =
        requestApi.baseURL +
        '/ei/cellQualData/download/' +
        this.currentRow.headerId
    },
    generateJMP() {
      messageUtils.showConfirm(this.$t('ei.cellQual.generateJMPConfirm')).then(
        () => {
          cellQualDataApi.generateJMP(this.currentRow.headerId).then(() => {
            setTimeout(() => {
              this.loadData()
            }, 2000)
          })
        }
      )
    },
    downloadJMP() {
      document.location.href =
        requestApi.baseURL +
        '/ei/cellQualData/downloadJMP/' +
        this.currentRow.headerId
    }, handleFilter() {
      this.filter = ''
      if (this.searchConditions.title !== '') {
        this.filter =
          this.filter + ',t.title CONTAIN ' + this.searchConditions.title
      }
      if (this.searchConditions.project !== '') {
        this.filter =
          this.filter + ',t.projectId in ' + this.searchConditions.project.join(' ')
      }

      if (this.searchConditions.vendor !== '') {
        this.filter =
          this.filter + ',t.vendorId in ' + this.searchConditions.vendor.join(' ')
      }

      if (this.searchConditions.build !== '') {
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
      this.loadData()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.loadData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.loadData()
    }
  }
}
</script>
