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
            @change="changeCreateBtnDisableStatus"
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
          <el-select
            v-model="searchConditions.partId"
            class="filter-item"
            style="width: 99%;"
            multiple
            filterable
            :placeholder="$t('route.part')"
            @change="changeCreateBtnDisableStatus"
          >
            <el-option
              v-for="item in partLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.vendorId"
            class="filter-item"
            style="width: 99%;"
            multiple
            :placeholder="$t('route.vendor')"
            @change="changeCreateBtnDisableStatus"
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
            @change="changeCreateBtnDisableStatus"
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
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            :loading="downloadLoading"
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
      <el-table-column min-width="150" sortable prop="title" :label="$t('core.title')" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.headerId)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="project" :label="$t('route.project')" />
      <el-table-column sortable prop="partNo" :label="$t('ei.part.partNo')" />
      <el-table-column sortable prop="vendor" :label="$t('route.vendor')" />
      <el-table-column sortable prop="build" :label="$t('route.build')" />
      <el-table-column sortable prop="cncSatation" :label="$t('ei.summary.cncStation')" />
      <el-table-column sortable prop="createdAt" :label="$t('core.createdAt')" :formatter="dateTimeFormat" />
      <el-table-column sortable prop="creatorName" :label="$t('core.creatorName')" />
      <!-- <el-table-column
        width="180"
        class-name="small-padding fixed-width"
        align="center"
        label="Operations"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            icon="el-icon-edit"
            style="margin-right: 5px"
            @click="handleEdit(scope.row.id)"
          >Go To Detail</el-link>
          <el-link
            type="primary"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          >Delete</el-link>
        </template>
      </el-table-column> -->
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
import * as summaryApi from '@/api/ei/dimSummaryApi'
import * as formatUtils from '@/utils/formatUtils'
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
import {
  showDeleteConfirm,
  showsDeleteSuccess,
  showsDeleteCancel,
  showSaveSuccess
} from '@/utils/messageUtils'
import * as requestApi from '@/utils/request'

const initialSearchConditions = {
  projectId: [],
  vendorId: [],
  build: [],
  partId: []
}

export default {
  name: 'EngDbPpList',
  components: {},
  data() {
    return {
      downloadLoading: false,
      createLoading: false,
      disableCreateBtn: true,
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
    eventBus.$on('summary-list-update', () => {
      this.fetchData()
    })
    this.fetchLookup()
    this.fetchData()
    // this.fetchLookup()
    console.log(this.$router)
  },
  methods: {
    mapLookupLabel,
    dateTimeFormat: formatUtils.tableDateTimeFormat,
    dateFormat: formatUtils.dateFormat,
    tableDateFormat: formatUtils.tableDateFormat,
    checkButtonPermission,
    changeCreateBtnDisableStatus() {
      console.log(this.searchConditions)
      if (this.searchConditions.projectId.length !== 1 || this.searchConditions.partId.length !== 1 ||
      this.searchConditions.vendorId.length !== 1 || this.searchConditions.build.length !== 1) {
        this.disableCreateBtn = true
      } else {
        this.disableCreateBtn = false
      }
    },
    handleSearch() {
      this.handleFilter()
      this.fetchData()
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

      if (this.searchConditions.partId.length > 0) {
        this.filter =
          this.filter + ',t.partId in ' + this.searchConditions.partId.join(' ')
      }
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions }
      this.filter = ''
      this.fetchData()
    },
    handleEdit(id) {
      this.$router.push(`detail/${id}`)
    },
    handleDelete(id) {
      console.log('handleDelete...')
      /* showDeleteConfirm()
        .then(() => {
          backMaintainApi.deleteById(id).then(response => {
            this.fetchData()
            showsDeleteSuccess()
          })
        })
        .catch(() => {
          showsDeleteCancel()
        }) */
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
      summaryApi.searchHeader(
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
      // this.downloadLoading = true
      window.location.href = requestApi.baseURL +
        '/ei/summary/download/' +
        this.currentRow.headerId + '?ruleName=' + 'ruleName1'
    },
    handleExport() {
      this.exportLoading = true
      summaryApi.searchHeader(
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
            // 'Dim Summary List_' + formatUtils.dateTimeFormat(new Date(), 'YYYYMMDDHHmmss') + '.xlsx'
            FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              'Dim Summary List.xlsx'
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
