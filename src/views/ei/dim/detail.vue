<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col style="text-align: right;">
        <el-button
          type="primary"
          :loading="refreshDataLoading"
          @click="refreshData"
        >{{ $t('core.refreshData') }}</el-button>
        <el-button
          type="infor"
          @click="handleCancel"
        >{{ $t('core.return') }}</el-button>
      </el-col>
    </el-row>
    <el-form
      ref="dataForm"
      label-position="right"
      class="demo-form-inline"
      :show-message="true"
      :model="summary"
    >
      <custFieldSet :title="$t('core.headerInfo')">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('route.project')" prop="project">
              <el-input v-model="summary.project" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('route.part')" prop="partDescription">
              <el-input v-model="summary.partDescription" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('ei.part.partVersion')" prop="partVersion">
              <el-input v-model="summary.partVersion" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('ei.part.partNo')" prop="partNo">
              <el-input v-model="summary.partNo" disabled />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('route.vendor')" prop="vendor">
              <el-input v-model="summary.vendor" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('route.build')" prop="build">
              <el-input v-model="summary.build" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('ei.summary.cncStation')" prop="partVersion">
              <el-input v-model="summary.cncSatation" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('ei.summary.technician')" prop="technicianName">
              <el-input v-model="summary.technicianName" disabled />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="100px" :label="$t('ei.summary.headerDate')" prop="headerDate">
              <el-input v-model="summary.headerDate" disabled />
            </el-form-item>
          </el-col>
        </el-row></custFieldSet>

      <el-dialog
        :title="$t('core.download')"
        :visible.sync="dialogDownloadVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="100px" label="Rule Name" prop="ruleName">
              <el-select
                v-model="ruleName"
                class="filter-item"
                style="width: 99%;"
                multiple
                :placeholder="$t('ei.summary.ruleName')"
              >
                <el-option
                  v-for="item in ruleLookup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDownloadVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="dialogDownloadVisible"
            @click="download"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="$t('ei.summary.updateChkResult')"
        :visible.sync="dialogUpdVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-row>
          <el-col>
            <el-form-item label-width="130px" :label="$t('ei.summary.faiNo')">
              <el-input
                v-model="updateChkRsltDto.faiNo"
                class="filter-item"
                style="width: 99%;"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label-width="130px" :label="$t('ei.summary.machineNo')">
              <el-input
                v-model="updateChkRsltDto.machineNoLabel"
                class="filter-item"
                style="width: 99%;"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label-width="130px" :label="$t('ei.summary.ruleName')">
              <el-input
                v-model="updateChkRsltDto.ruleName"
                class="filter-item"
                style="width: 99%;"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label-width="130px" :label="$t('ei.summary.chkResult')">
              <el-input
                v-model="updateChkRsltDto.chkResult"
                class="filter-item"
                style="width: 99%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdVisible = false">{{ $t('core.cancel') }}</el-button>
          <el-button
            type="primary"
            :loading="dlgUpdChkRsltLoading"
            @click="updateChkResult"
          >{{ $t('core.confirm') }}</el-button>
        </span>
      </el-dialog>
    </el-form>

    <custFieldSet :title="$t('core.detailInfo')">
      <div class="filter-container">
        <el-row>
          <el-col :span="4">
            <el-input
              v-model="searchConditions.faiNo"
              class="filter-item"
              style="width: 99%;"
              clearable
              :placeholder="$t('ei.summary.faiNo')"
            />
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchConditions.faiSpcAlignmentCheck"
              class="filter-item"
              style="width: 99%;"
              filterable
              clearable
              :placeholder="$t('ei.summary.faiSpcAlignmentCheck')"
            >
              <el-option
                v-for="item in faiSpcAlignmentCheckLookup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <!-- <el-col :span="4">
            <el-select
              v-model="searchConditions.ruleName"
              class="filter-item"
              style="width: 99%;"
              filterable
              :placeholder="$t('ei.summary.ruleName')"
            >
              <el-option
                v-for="item in ruleLookup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col> -->

          <el-col :span="8">
            <div style="text-align: left">
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="fetchDetails"
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

      <el-table
        v-loading="listLoading"
        :data="detailList"
        highlight-current-row
        element-loading-text="Loading..."
        stripe
        border
        fit
        @cell-dblclick="handleDetailCellDbClick"
      >
        <el-table-column
          prop="faiNo"
          label="Fai#"
          sortable
        />
        <el-table-column
          prop="eiJudegeRiskLevel"
          label="EI Judege Risk Level"
          sortable
        />
        <el-table-column
          prop="drawingNominalCheck"
          label="Drawing Nominal Check"
          sortable
        />
        <el-table-column
          prop="sipNominalCheck"
          label="SIP Nominal Check"
          sortable
        />
        <el-table-column
          prop="faiSpcAlignmentCheck"
          label="FAI/SPC Alignment check"
          sortable
        />
        <el-table-column
          prop="cellFaiNo"
          label="Fai#"
          sortable
        />
        <el-table-column
          prop="cpMin"
          label="All Parts CP"
          sortable
        />
        <el-table-column
          prop="cpkMin"
          label="All Parts CPK"
          sortable
        />
        <el-table-column
          prop="meanDriftMin"
          label="All parts mean drift"
          sortable
        />
        <el-table-column
          prop="projectedYieldsAvg"
          label="All Parts Project Yield"
          sortable
        />
        <template v-for="(col ,index) in cols">
          <el-table-column :key="index" :label="col.label" align="center" sortable>
            <template v-for="(p ,index2) in col.prop">
              <el-table-column
                :key="index2"
                :label="p.ruleName"
                :prop="col.label"
                width="120"
              >
                <template slot-scope="scope">
                  <div :class="rtnCellClass(scope.row[p.chkResult])">
                    {{ scope.row[p.chkResult] }}
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        v-if="detailList"
        :page-sizes="[10,20,50,100,300,400]"
        :page-size="searchConditions.limit"
        background
        style="text-align: center; margin-top:10px"
        layout="total,sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </custFieldSet>

    <custFieldSet :title="$t('ei.summary.checkResultInfo')">
      <div class="filter-container">
        <el-row>
          <el-col :span="4">
            <el-select
              v-model="checkResultConditions.machineNo"
              class="filter-item"
              style="width: 99%;"
              multiple
              clearable
              placeholder="Machine#"
            >
              <el-option
                v-for="item in machineNoLookup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="8">
            <div style="text-align: left">
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="fetchChkDetails"
              >{{ $t('core.search') }}</el-button>
              <el-button
                class="filter-item"
                icon="el-icon-refresh"
                @click="handleResetChk"
              >{{ $t('core.reset') }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table
        v-loading="listLoading"
        :data="checkResultList"
        highlight-current-row
        element-loading-text="Loading..."
        stripe
        border
        fit
      >
        <el-table-column
          prop="machineNo"
          label="Machine#"
        />
        <el-table-column
          label="Data ETA Date"
          prop="dataEtaStatusDateStr"
        />
        <el-table-column
          label="FAI 1st Round Result"
          prop="checkResult1st"
        />
        <el-table-column
          label="FAI 1st Round Date"
          prop="checkDate1st"
        />
        <el-table-column
          label="FAI 2nd Round Result"
          prop="checkResult2nd"
        />
        <el-table-column
          label="FAI 2nd Round Date"
          prop="checkDate2nd"
        />
      </el-table>
      <el-pagination
        v-if="checkResultList"
        :page-sizes="[10,20,50,100,300,400]"
        :page-size="searchConditions.limit"
        background
        style="text-align: center; margin-top:10px"
        layout="total,sizes, prev, pager, next"
        :total="checkResultConditions.totalCount"
        @size-change="handleSizeChangeChk"
        @current-change="handleCurrentChangeChk"
      />
    </custFieldSet>
  </div>
</template>

<script>
import * as summaryApi from '@/api/ei/dimSummaryApi'
import * as lookup from '@/utils/lookup'
import { mapGetters } from 'vuex'
import { MessageBox, Message } from 'element-ui'
import i18n from '@/i18n'

export default {
  name: 'SummaryDetail',
  components: { },
  props: {
    referenceId: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data() {
    return {
      dlgUpdChkRsltLoading: false,
      updateChkRsltDto: {
        faiNo: null,
        detailId: null,
        machineNo: null,
        machineNoLabel: null,
        dataRound: null,
        chkResult: null,
        ruleName: null
      },
      dialogUpdVisible: false,
      refreshDataLoading: false,
      cols: [],
      summaryHeaderId: null,
      detailList: [],
      totalCount: 0,
      ruleName: '',
      listLoading: false,
      ruleLookup: [],
      faiSpcAlignmentCheckLookup: [],
      dialogDownloadVisible: false,
      summary: {},
      checkResultList: [],
      checkResultDtoListTmp: [],
      checkResultConditions: {
        limit: 10,
        currentPage: 1,
        totalCount: null,
        machineNo: []
      },
      machineNoLookup: [],
      searchConditions: {
        limit: 10,
        currentPage: 1,
        ruleName: null,
        summaryHeaderId: null,
        faiNo: null,
        faiSpcAlignmentCheck: null
      }
    }
  },
  computed: { ...mapGetters(['fullName', 'userId']) },
  created() {
    let id = this.$route.params && this.$route.params.id
    if (this.referenceId !== 0) {
      id = this.referenceId
    }
    this.summaryHeaderId = id
    this.searchConditions.summaryHeaderId = id
    this.fetchLookup()
    this.fetchData(id)
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    setTagsViewTitle() {
      const title = 'Dim Summary'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.summary.headerId}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    handleCancel() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    fetchLookup() {
      const lookupTypes = [
        'EI_RULE', 'EI_FAI_SPC_ALIGMENT_CHECK']
      lookup.queryLookup(lookupTypes).then(value => {
        this.ruleLookup = value['EI_RULE']
        this.faiSpcAlignmentCheckLookup = value['EI_FAI_SPC_ALIGMENT_CHECK']
      })
    },
    fetchData(id) {
      summaryApi.findHeaderById(id).then(response => {
        this.cols = []
        this.summary = response.data
        this.checkResultDtoListTmp = JSON.parse(JSON.stringify(this.summary.checkResultDtoList))
        this.machineNoLookup = []
        this.checkResultDtoListTmp.forEach(s => {
          /**
           * 动态列: final check
           */
          this.machineNoLookup.push({ value: s.machineNo, label: s.machineNo })
          /**
           * 动态列: detail list
           */
          const prop = []
          this.ruleLookup.forEach(lookup => {
            prop.push({
              ruleName: lookup.value,
              chkResult: 'M' + s.machineNo + lookup.value
            })
          })
          this.cols.push({
            label: this.summary.cncSatation + '-' + s.machineNo + '#',
            prop: prop
          })
        })
        this.calcChkDetailList(this.checkResultConditions.currentPage)
        this.checkResultConditions.totalCount = this.checkResultDtoListTmp.length
        this.setTagsViewTitle()
        this.fetchDetails()
      })
    },
    fetchDetails() {
      this.listLoading = true
      summaryApi.searchDetails(this.searchConditions).then(response => {
        this.detailList = response.data.items
        this.detailList.forEach(detail => {
          detail.faiList.forEach(fai => {
            detail['M' + fai.machineNo + fai.ruleName] = fai.chkResult
          })
        })
        // console.log(this.detailList[0])
        this.totalCount = response.data.totalCount
        this.listLoading = false
      })
    },
    download() {

    },
    handleSizeChange(limit) {
      this.searchConditions.limit = limit
      this.fetchDetails()
    },
    handleCurrentChange(currentPage) {
      this.searchConditions.currentPage = currentPage
      this.fetchDetails()
    },
    handleReset() {
      this.searchConditions = {
        limit: 10,
        currentPage: 1,
        summaryHeaderId: this.summaryHeaderId,
        faiNo: null,
        faiSpcAlignmentCheck: null
      }
      this.fetchDetails()
    },
    refreshData() {
      MessageBox.confirm(i18n.tc('ei.summary.refreshMsg'), i18n.tc('core.tips'), {
        confirmButtonText: i18n.tc('core.confirm'),
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.refreshDataLoading = true
        summaryApi.refreshData(this.summaryHeaderId).then(response => {
          this.refreshDataLoading = false
          Message({
            message: i18n.tc('ei.summary.refreshSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.fetchData(this.summaryHeaderId)
        }).catch(() => {
          this.refreshDataLoading = false
        })
      })
        .catch(() => {
          Message({
            message: i18n.tc('ei.summary.refreshCanceled'),
            type: 'info',
            duration: 3 * 1000
          })
        })
    },
    handleSizeChangeChk(limit) {
      this.checkResultConditions.limit = limit
      this.calcChkDetailList(1)
    },
    handleCurrentChangeChk(currentPage) {
      this.checkResultConditions.currentPage = currentPage
      this.calcChkDetailList(this.checkResultConditions.currentPage)
    },
    calcChkDetailList(page) {
      this.checkResultList = this.checkResultDtoListTmp.slice(this.checkResultConditions.limit * (page - 1),
        this.checkResultConditions.limit * page - 1)
    },
    fetchChkDetails() {
      if (this.checkResultConditions.machineNo.length > 0) {
        this.checkResultConditions.currentPage = 1
        this.checkResultDtoListTmp = this.summary.checkResultDtoList.filter(s => {
          return this.checkResultConditions.machineNo.indexOf(s.machineNo) >= 0
        })
        this.checkResultConditions.totalCount = this.checkResultDtoListTmp.length
        this.calcChkDetailList(this.checkResultConditions.currentPage)
      } else {
        this.handleResetChk()
      }
    },
    handleResetChk() {
      this.checkResultConditions.machineNo = []
      this.checkResultConditions.currentPage = 1
      this.checkResultDtoListTmp = JSON.parse(JSON.stringify(this.summary.checkResultDtoList))
      this.calcChkDetailList(this.checkResultConditions.currentPage)
      this.checkResultConditions.totalCount = this.checkResultDtoListTmp.length
    },
    handleDetailCellDbClick(row, column, cell, event) {
      const machineNoLabel = column.property
      const machineNo = machineNoLabel.substring(machineNoLabel.indexOf('-') + 1, machineNoLabel.indexOf('#'))
      this.updateChkRsltDto = {
        faiNo: row.cellFaiNo,
        detailId: row.summaryDetailId,
        machineNo: machineNo,
        machineNoLabel: machineNoLabel,
        dataRound: row.dataRound,
        chkResult: cell.innerText.trim(),
        ruleName: column.label
      }
      this.dialogUpdVisible = true
    },
    updateChkResult() {
      this.dlgUpdChkRsltLoading = true
      summaryApi.updateChkResult(this.updateChkRsltDto).then(response => {
        this.dlgUpdChkRsltLoading = false
        this.dialogUpdVisible = false
        Message({
          message: i18n.tc('core.updateSuccess'),
          type: 'success',
          duration: 3 * 1000
        })
        this.fetchDetails()
      }).catch(() => {
        this.dlgUpdChkRsltLoading = false
      })
    },
    rtnCellClass(chkResult) {
      // return 'ok'
      if (chkResult) {
        if (chkResult.toLowerCase().indexOf('ok') >= 0) {
          return 'ok'
        } else if (chkResult.toLowerCase().indexOf('alert') >= 0) {
          return 'alert'
        } else if (chkResult.toLowerCase().indexOf('risk') >= 0) {
          return 'risk'
        } else if (chkResult.toLowerCase().indexOf('reject') >= 0) {
          return 'reject'
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
  .el-table--scrollable-x .el-table__body-wrapper {
      overflow: scroll !important;
      height: 29rem !important;
  }

  .ok {
    background-color: #19be6b;
    color: white;
  }
  .reject {
    background-color: #ed4014;
    color: white;
  }
  .alert {
    background-color: #ffc107;
    color: red;
  }
  .risk {
    background-color: yellow;
    color: black;
  }
</style>
