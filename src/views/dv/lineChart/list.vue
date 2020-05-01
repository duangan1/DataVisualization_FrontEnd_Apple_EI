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
            v-show="false"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.project"
            class="filter-item"
            style="width: 99%;"
            placeholder="Project"
            clearable
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
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.vendor"
            class="filter-item"
            style="width: 99%;"
            placeholder="Vendor"
            clearable
          >
            <el-option
              v-for="item in vendorLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select
            v-model="searchConditions.build"
            class="filter-item"
            style="width: 99%;"
            placeholder="Build"
            clearable
          >
            <el-option
              v-for="item in buildLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select
            v-model="searchConditions.cncSatation"
            class="filter-item"
            style="width: 99%;"
            placeholder="CNC#"
            clearable
          >
            <el-option
              v-for="item in cncStationLookup"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select
            v-model="searchConditions.dataround"
            class="filter-item"
            style="width: 99%;"
            placeholder="Data Round"
            clearable
          >
            <el-option
              v-for="item in dataRoundLookup"
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
              type="primary"
              icon="el-icon-view"
       
              @click="popupMoreSearch"
            >{{ $t('dv.line.selectMoreBtn') }}</el-button>
            <el-button
              class="filter-item"
              icon="el-icon-refresh"
              @click="handleReset"
            >{{ $t('core.reset') }}</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 条件选择输入区域 end -->
      <el-row>

      </el-row>
    </div>
    <div class="filter-container">
      <el-row >
        <el-col :span="7">
        <el-checkbox-group
            v-model="searchRulesCondition.caclRuleNames" :disabled="disableCaclRulesArea">
            <el-checkbox
              v-for="item in caclRuleNamesLookup"
              :label="item.value"
              :name="item.value"
              :key="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="2">
           <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"     
              size="mini"         
              :disabled="disableCaclRulesArea"
              @click="handleCaclRulesSearch"
            >Apply</el-button>
        </el-col>
      </el-row>
    </div>
        <!-- searchRulesCondition end -->
    <el-row v-show="showVendorProjectTitle">
      <div style="text-align:center;">
        <p style="font-size:22px;"><span style="font-weight:bold;">{{cellQualVendorName}}</span> - <span style="font-weight:bold;">{{cellQualProjName}}</span> Dim Deviation Detection<span style="float:right;font-size:14px;">Updated At: {{cellQualDate}}</span></p>
      </div>
    </el-row>
        <!-- projectTitle end -->
    <el-row>
      <el-col :span="6" v-for="(item,index) of dynamicChartList" :key="item.key">
        <el-card :body-style="{padding:'0px'}" :class="item.class" style="border:1px solid #dfe6ec;">
            <div slot="header" class="clearfix">
              <span>{{cellQualCNCStation}}-{{item.val}}</span>
              <el-button style="float: right; padding: 3px 0" icon="el-icon-document" type="text" @click="setShowChartDetailsFlag(item.val)" >More Details</el-button>
            </div>
        <div :id="item.val" :key="index" class="line-chart" :style="{height:height,width:width,left:left}"/>
        </el-card>
      </el-col>
    </el-row>
        <!-- dynamicChartList end -->
    <el-dialog
      title="Select More Option"
      :visible.sync="showMoreSelectionPopup"
      :close-on-click-modal="false"
    >
      <el-form
        ref="moreSelectionForm"
        class="form-container"
        :model="searchMoreConditions"
        :show-message="false"
        label-position="top"
        label-width="80px"
      >
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="SPC ?">
              <el-select
                v-model="searchMoreConditions.spcCheckList"
                class="filter-item"
                style="width: 99%;"
                placeholder="SPC ?"
                multiple
              >
                <el-option
                  v-for="item in spcCheckListLookup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Projected Yields">
              <div class="inline-input">
                <el-input
                  v-model.trim="searchMoreConditions.projectedYieldFrom"
                  placeholder="Projected Yields Start"
                  clearable
                />
                <span>-</span>
                <el-input
                  v-model.trim="searchMoreConditions.projectedYieldTo"
                  placeholder="Projected Yields End"
                  clearable
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="Machine #">
              <el-select
                v-model="searchMoreConditions.cncMachineNo"
                class="filter-item"
                style="width: 99%;"
                placeholder="Machine #"
                filterable
                multiple
                clearable
              >
                <el-option
                  v-for="item in cncMachineNoLookup"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Cutter No">
              <el-select
                v-model="searchMoreConditions.cutters"
                class="filter-item"
                style="width: 99%;"
                placeholder="Cutter No"
                filterable
                multiple
                clearable
              >
                <el-option
                  v-for="item in cutterNoLookup"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="FAI No">
              <el-select
                v-model="searchMoreConditions.faiNo"
                class="filter-item"
                style="width: 99%;"
                placeholder="FAI No"
                filterable
                multiple
                clearable
              >
                <el-option
                  v-for="item in faiNoLookup"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="DIM No">
              <el-select
                v-model="searchMoreConditions.dimNo"
                class="filter-item"
                style="width: 99%;"
                placeholder="DIM No"
                multiple
                filterable
                clearable
              >
                <el-option
                  v-for="item in dimNoLookup"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMoreSelectionForm()">Cancel</el-button>
        <el-button type="primary" v-loading.fullscreen.lock="processLoading" element-loading-text="Loading..."
          element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @click="drawLineCharts()">Confirm</el-button>
      </div>
    </el-dialog>
        <!-- selectMore Dialog end -->
    <el-dialog title="Chart Details" :fullscreen="true" :close-on-press-escape="false"
      :visible.sync="showChartDetails"
      :close-on-click-modal="false">
      <el-row>
        <el-col :span="14">
          <el-card :body-style="{padding:'0px'}">
           <div slot="header" class="clearfix">
            <span style="font-weight:bold;">{{cellQualCNCStation}}-{{currenSelectedChartMachine}} Detail</span>            
          </div>
          <div id="chartDetailArea" style="width:100%;height:800px"></div>
          </el-card>
        </el-col>
        <el-col :span="10" > 
          <el-card :body-style="{padding:'2px'}">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold;">Risk Suggest</span>            
          </div>
          <el-table
            :data="riskSuggestTableData"
            border
            highlight-current-row
            style="width: 100%"
            max-height="800px"
            @current-change="tableCurrentChange"
          >
            <el-table-column prop="ruleName" label="Rule Name" width="140"/>
            <el-table-column prop="caclResult" label="Level" width="150" />
            <el-table-column prop="dimNos" label="Suggest Dim No."/>  
            <el-table-column prop="chkDimNos" label="Check Dim No."/>    
            <el-table-column label="Action" width="80">
              <template slot-scope="scope">
                <el-link type="primary" icon="el-icon-edit" @click="showChartRiskDetailEditDialog(scope.row)">Edit</el-link>
              </template>   
            </el-table-column>
          </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
        <!-- LineChart Detail Dialog end -->
    <el-dialog :visible.sync="showChartRiskDetailEdit" title="Edit Risk Dim No" :close-on-press-escape="false" :close-on-click-modal="false">
         <el-form status-icon ref="showChartRiskDetailEditform" :model="showChartRiskDetailEditform" label-width="180px">
            <el-form-item label="Rule Name" >
              <el-input v-model="showChartRiskDetailEditform.ruleName" :disabled="true"/>
            </el-form-item>
            <el-form-item label="Level">
              <el-input v-model="showChartRiskDetailEditform.caclResult" :disabled="true"/>
            </el-form-item>
            <el-form-item label="Suggest Dim No.">
              <el-input type="textarea" autosize v-model="showChartRiskDetailEditform.dimNos" :disabled="true"/>
            </el-form-item>
            <el-form-item label="Check Dim No.">
                <el-select v-model="showChartRiskDetailEditform.chkDimNos" class="filter-item" style="width: 99%;" placeholder="Check Dim No." multiple filterable clearable>
                  <el-option
                    v-for="item in riskDetailDimNoLookup"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitChartRiskCheckResult()">Confirm</el-button>
              <el-button @click="closeChartRiskDetailEditDialog()">Cancel</el-button>
            </el-form-item>
         </el-form>
    </el-dialog>
        <!-- Edit Risk level dialog end -->
  </div>
</template>

<script>
const initialSearchConditions = {
  title: "",
  project: "",
  vendor: "",
  build: "",
  partNo: "",
  cncSatation: "",
  dataround: ""
};

const initSearchMoreConditions = {
  headerId: "",
  cncMachineNo: [],
  faiNo: [],
  dimNo: [],
  projectedYieldFrom: "",
  projectedYieldTo: "",
  spcCheckList: [],
  cutters:[],
  engDbHeaderId:""
};

const initsearchRulesConditions = {
  caclRuleNames:[],
  cncMachineNo:[],
  cellQualCols:[]
};

import * as lookup from "@/utils/lookup";
import * as messageUtils from "@/utils/messageUtils";
import * as cellQualDataApi from "@/api/ei/cellQualData";
import * as dvApi from "@/api/ei/dv";
import * as formatApi from "@/utils/formatUtils";
import * as requestApi from "@/utils/request";
import { MessageBox, Message,Loading } from 'element-ui'
import { mapGetters } from 'vuex'
import i18n from '@/i18n'
import echarts from "echarts";

export default {
  name:'lineChart',
  data() {    
    return {
      processLoading: false,
      fullScreenLoading:null,
      searchConditions: { ...initialSearchConditions },
      searchMoreConditions: { ...initSearchMoreConditions },
      searchRulesCondition:{...initsearchRulesConditions},
      uniqueHeader: false,
      showMoreSelectionPopup: false,
      tableData: [],
      currentRow: { status: "", uploadStatus: "" },
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      filter: "",
      moreSelectionFilter: "",
      initMoreSelectionFilter:"",
      partLookup: [],
      buildLookup: [],
      projectLookup: [],
      vendorLookup: [],
      cncStationLookup: [],
      dataRoundLookup: [],
      cncMachineNoLookup: [],
      cncMachineNoList:[],
      faiNoLookup: [],
      dimNoLookup: [],
      cutterNoLookup:[],
      caclRuleNamesLookup:[],
      caclRulesSelectionFilter:'',
      disableCaclRulesArea:true,
      uploadMessage: "",
      cellQualHeaderId: null,
      cellQualVendorName:"",
      cellQualProjName:"",
      cellQualDate:"",
      cellQualCNCStation:"",
      moreSelectionHeaderId: null,
      spcCheckListLookup: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 }
      ],
      showVendorProjectTitle:false,
      // caclRuleNames:[],
      //charts
      className: "chart",
      width: "100%",
      height: "370px",
      left:"0",
      dynamicChartList: [],
      tempChartData: [],
      showChartDetails:false,
      currenSelectedChartMachine:'',
      riskSuggestTableData:[],
      showChartRiskDetailEdit:false,
      riskDetailDimNoLookup:[],
      showChartRiskDetailEditform:{
        headerId:'',
        dataRound:'',
        machineNo:'',
        ruleName:'',
        caclResult:'',
        dimNos:'',
        chkDimNos:[],
        origChkDimNos:[]
      }
    };
  },
  computed: { ...mapGetters(["userId"]) },
  watch: {
    showChartDetails(val) {
      if(val){
        this.showChartDetailsDialog();
      }            
    }
  },
  mounted() {
    // this.handleFilter()
    // this.loadData()
    this.fetchLookup();
  },
  methods: {
    tableDateTimeFormat: formatApi.tableDateTimeFormat,
    handleSearch() {

      this.handleFilter();
      this.loadData();
    },
    loadData() {
      // debugger
      this.processLoading = true;
      this.currentRow = { status: "" };
      cellQualDataApi
        .select({
          currentPage: this.currentPage,
          limit: this.limit,
          filter: this.filter
        })
        .then(response => {
          this.tableData = response.data.items;
          this.totalCount = response.data.totalCount;

          this.processLoading = false;

          if(this.totalCount == 1) {
            this.uniqueHeader = true;
            this.disableCaclRulesArea = false;
            this.cellQualHeaderId = response.data.items[0].headerId;
            this.cellQualCNCStation = response.data.items[0].cncSatation;
            this.cellQualVendorName = response.data.items[0].vendor;
            this.cellQualProjName = response.data.items[0].project;
            this.cellQualDate = response.data.items[0].updatedAt;            

            MessageBox.confirm('Do you want to Show Charts or Open the more conditions select window?', i18n.t('core.tips'), {
              showClose:false,
              confirmButtonText: 'Show',
              cancelButtonText: 'Select More',
              type: 'info',
              dangerouslyUseHTMLString: true          
            }).then(() => {
              //重置查询条件
              this.searchMoreConditions = { ...initSearchMoreConditions };
              // this.handleMoreSelectionFilter();
              this.initMoreSelectionFilter =  ",t.headerId EQ " + this.cellQualHeaderId;
              //获取machine
              this.fetchCellQualMetric("cnc_machine");            
              this.moreSelectionFilter = ",dc.headerId EQ " + this.cellQualHeaderId;
              //draw line charts            
                setTimeout(() => {
                    this.fetchChartData("S");
                }, 1000)    
            })
            .catch(() => {
                this.popupMoreSearch();
            }) 
          }else{
            messageUtils.showsErrorMessage(i18n.tc('dv.line.mutlipleRecsFound'));
            this.uniqueHeader = false;
            this.showVendorProjectTitle = false;
            this.disableCaclRulesArea = false;
          }
      }).catch(()=>{
        this.processLoading = false;
      });
    },
    fetchLookup() {
      const lookupTypes = ["EI_BUILD", "EI_DATA_ROUND","EI_DV_RULE"];
      lookup.queryLookup(lookupTypes).then(value => {
        this.buildLookup = value["EI_BUILD"];
        this.dataRoundLookup = value["EI_DATA_ROUND"];
        this.caclRuleNamesLookup = value["EI_DV_RULE"];
      });
      lookup
        .queryDynamicLookup(["vendor", "project", "part", "cnc"])
        .then(value => {
          this.vendorLookup = value.vendor;
          this.projectLookup = value.project;
          this.partLookup = value.part;
          this.cncStationLookup = value.cnc;
        });
    },
    tableCurrentChange(row) {
      this.currentRow = Object.assign({ status: "" }, row);
    },

    handleValidate() {
      setTimeout(() => {
        this.loadData();
      }, 2000);
      cellQualDataApi.validate(this.currentRow).then(() => {
        this.loadData();
      });
    },
    handleApply() {
      setTimeout(() => {
        this.loadData();
      }, 2000);
      cellQualDataApi.apply(this.currentRow).then(() => {
        this.loadData();
      });
    },
    popupMoreSearch() {
      if (this.uniqueHeader) {
        this.showMoreSelectionPopup = true;
        //加载与上次不一样的cellqualdata headerid，重新加载
        // debugger
        if (this.cellQualHeaderId !== this.moreSelectionHeaderId) {
          this.moreSelectionHeaderId = this.cellQualHeaderId;
          //重置查询条件
          this.searchMoreConditions = { ...initSearchMoreConditions };
          // this.handleMoreSelectionFilter();
          this.initMoreSelectionFilter =  ",t.headerId EQ " + this.cellQualHeaderId;
          //加载弹出框参数
          this.fetchCellQualMetric("cnc_machine");
          this.fetchCellQualMetric("fai_no");
          this.fetchCellQualMetric("dim_no");
          this.fetchCellQualMetric("cutter_no");
          this.$refs.moreSelectionForm.resetFields();
        }
      } else {
        this.showMoreSelectionPopup = false;
        messageUtils.showsErrorMessage(i18n.tc('dv.line.mutlipleRecsFound'));
      }
    },
    fetchCellQualMetric(name) {
      dvApi.initLineChartMoreSelectOption({ currentPage: 1, limit: 1000, filter: this.initMoreSelectionFilter },name)
        .then(response => {
          if ("cnc_machine" == name) {
            this.cncMachineNoLookup = response.data.items;
          } else if ("fai_no" == name) {
            this.faiNoLookup = response.data.items;
          } else if ("dim_no" == name) {
            this.dimNoLookup = response.data.items;
          }else if ("cutter_no" == name) {
            this.cutterNoLookup = response.data.items;
            if(this.cutterNoLookup.length>0){
              this.searchMoreConditions.engDbHeaderId = response.data.items[0].value;
            }
          }else if ("risk_suggest_detail_dim_no" == name) {
            this.riskDetailDimNoLookup = response.data.items;
          }
        }); 
    },
    handleFilter() {
      this.filter = "";
      if (this.searchConditions.title !== "") {
        this.filter = this.filter + ",t.title CONTAIN " + this.searchConditions.title;
      }
      if (this.searchConditions.project !== "") {
        this.filter = this.filter + ",t.projectId EQ " + this.searchConditions;
      }

      if (this.searchConditions.vendor !== "") {
        this.filter = this.filter + ",t.vendorId EQ " + this.searchConditions.vendor;
      }

      if (this.searchConditions.build !== "") {
        this.filter = this.filter + ",t.build EQ " + this.searchConditions.build;
      }

      if (this.searchConditions.partNo !== "") {
        this.filter =  this.filter + ",t.partNo CONTAIN " + this.searchConditions.partNo;
      }

      if (this.searchConditions.dataround !== "") {
        this.filter =this.filter + ",t.dataRound EQ " + this.searchConditions.dataround;
      }

      if (this.searchConditions.cncSatation !== "") {
        this.filter = this.filter + ",t.cncSatation EQ " + this.searchConditions.cncSatation;
      }
    },
    handleMoreSelectionFilter() {
      this.moreSelectionFilter = "";
      if (this.uniqueHeader !== "") {
        this.moreSelectionFilter =
          this.moreSelectionFilter + ",dc.headerId EQ " + this.cellQualHeaderId;
      }

      if (this.searchMoreConditions.projectedYieldFrom !== "") {
        this.moreSelectionFilter =this.moreSelectionFilter + ",dcol.projectedYields GE " + this.searchMoreConditions.projectedYieldFrom;
      }

      if (this.searchMoreConditions.projectedYieldTo !== "") {
        this.moreSelectionFilter = this.moreSelectionFilter +  ",dcol.projectedYields LE " + this.searchMoreConditions.projectedYieldTo;
      }

      if (this.searchMoreConditions.faiNo.length>0) {
        this.moreSelectionFilter =  this.moreSelectionFilter + ",dcol.faiNo IN " +  this.searchMoreConditions.faiNo.join(" ");
      }
    },
    getQueryParameter(obj) {
      return Object.assign(
        {
          filter: this.moreSelectionFilter,
          cncMachineNo: this.searchMoreConditions.cncMachineNo.length!==0 ? this.searchMoreConditions.cncMachineNo : this.cncMachineNoList,
          dimNos: this.searchMoreConditions.dimNo,
          cutters: this.searchMoreConditions.cutters,
          spc: this.searchMoreConditions.spcCheckList,
          engDbHeaderId: this.searchMoreConditions.engDbHeaderId,
          limit:10000
        },
        obj
      );
    },
    setAllMachineNoList(){
        this.cncMachineNoList = [];
        this.cncMachineNoLookup.forEach(item =>{
          // console.log('item.value:'+item.value);
           this.cncMachineNoList.push(item.value);
        })    
    },
    fetchChartData(operationType) {
      this.showVendorProjectTitle = true;
      this.processLoading = true;
      //operationType S - from Search Button  SM - from Search More button
      if("SM"==operationType){
          if(this.searchMoreConditions.cncMachineNo.length!==0){
            this.cncMachineNoList = this.searchMoreConditions.cncMachineNo;
          }else{
            this.setAllMachineNoList();
          }          
      }else if("S"==operationType){
          this.setAllMachineNoList();
      }

      dvApi.initLineChartData(this.getQueryParameter({})).then(response => {
        if (response.code == "20000") {
          const renderChartList = [];
          this.cncMachineNoList.forEach(machine => {
            // console.log("machine:" + machine);
            const machineChartData = response.data[`${machine}`];
            if (machineChartData) {
              renderChartList.push({
                key: machine,
                val: machine,
                class: "line-chart-container-default"
              });
              machineChartData.forEach(mcdi => {
                // console.log(mcdi.faiNo + " / " + mcdi.dev1);
              });
            }
          });
          // render chart areas
          this.dynamicChartList = renderChartList;
          this.searchRulesCondition.cellQualCols = [];
          // init chart
          this.cncMachineNoList.forEach(machine => {
            this.processLoading = false;
            // console.log("machine:" + machine);
            const machineChartData = response.data[`${machine}`];
            if (machineChartData) {
                setTimeout(() => {
                 this.initChart(machine,machineChartData,this)
             }, 1000)               
            }
          });          
          this.showMoreSelectionPopup = false;
        }else{
          this.processLoading = false;
        }
      }).catch(()=>{
        this.processLoading = false;
      });
    },
    drawLineCharts() {
      this.handleMoreSelectionFilter();
      this.fetchChartData("SM");
    },
    initChart(chartAreaId, chartData,that) {
      this.chart = echarts.init(document.getElementById(chartAreaId));

      let titleMachine = chartAreaId;
      if(chartAreaId=='chartDetailArea'){
        titleMachine = this.currenSelectedChartMachine;
      }

      const xPointNumber = [];
      const dev1Val = [];
      const dev2Val = [];
      const dev3Val = [];
      const alertTolPlusVal = [];
      const alertTolMinusVal = [];
      const drawingTolPlusVal = [];
      const drawingTolMinusVal = [];
      const nomialVal = [];
      const sipTolPlusVal = [];
      const sipTolMinusVal = [];


      chartData.forEach(item => {
        xPointNumber.push(item.pointNumber);
        dev1Val.push(item.dev1);
        dev2Val.push(item.dev2);
        dev3Val.push(item.dev3);        
        alertTolPlusVal.push(item.alertTolPlus);
        alertTolMinusVal.push(item.alertTolMinus);
        drawingTolPlusVal.push(item.drawingTolPlus);
        drawingTolMinusVal.push(item.drawingTolMinus);
        nomialVal.push(item.nominalDim);
        sipTolPlusVal.push(item.sipTolPlus);
        sipTolMinusVal.push(item.sipTolMinus);
        this.searchRulesCondition.cellQualCols.push(item.colId);        
      });

      this.chart.setOption({
        backgroundColor: 'rgb(250,250,250)',//'#f3f3f3',
        title: {
          top: 15,
          text: `${this.cellQualCNCStation}-${titleMachine}`,
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#686b6f"
          },
          left: "1%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          },
                      axisLabel : {
                formatter: 'Point Number: {value}'
            }
        },
        legend: {
          top: '10',
          // orient: "vertical",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["Sample 1", "Sample 2","Sample 3","Alert - TOL","Alert + TOL","Drawing - TOL","Drawing + TOL","Nominal","SIP - TOL","SIP + TOL"],
          right: "0",
          show:false,
          textStyle: {
            fontSize: 12,
            color: "#686b6f"
          }
        },
        
        grid: {
          top: 100,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: [
          {
            // name:"Point Number",
            show: false,
            type: "category",
            boundaryGap: false,
            data: xPointNumber
          }
        ],
        toolbox: {  
          show: true,  
          feature: {   
                dataZoom: {  
                    show: true 
                },
                restore: {show: true},  
                saveAsImage: {show: true},
                myTool1: {
                  show: true,
                  title: 'More Details',                  
                  icon:"path://M512 128q69.675 0 135.51 21.163t115.498 54.997 93.483 74.837 73.685 82.006 51.67 74.837 32.17 54.827L1024 512q-2.347 4.992-6.315 13.483T998.87 560.17t-31.658 51.669-44.331 59.99-56.832 64.34-69.504 60.16-82.347 51.5-94.848 34.687T512 896q-69.675 0-135.51-21.163t-115.498-54.826-93.483-74.326-73.685-81.493-51.67-74.496-32.17-54.997L0 513.707q2.347-4.992 6.315-13.483t18.816-34.816 31.658-51.84 44.331-60.33 56.832-64.683 69.504-60.331 82.347-51.84 94.848-34.816T512 128.085zm0 85.333q-46.677 0-91.648 12.331t-81.152 31.83-70.656 47.146-59.648 54.485-48.853 57.686-37.675 52.821-26.325 43.99q12.33 21.674 26.325 43.52t37.675 52.351 48.853 57.003 59.648 53.845T339.2 767.02t81.152 31.488T512 810.667t91.648-12.331 81.152-31.659 70.656-46.848 59.648-54.186 48.853-57.344 37.675-52.651T927.957 512q-12.33-21.675-26.325-43.648t-37.675-52.65-48.853-57.345-59.648-54.186-70.656-46.848-81.152-31.659T512 213.334zm0 128q70.656 0 120.661 50.006T682.667 512 632.66 632.661 512 682.667 391.339 632.66 341.333 512t50.006-120.661T512 341.333zm0 85.334q-35.328 0-60.33 25.002T426.666 512t25.002 60.33T512 597.334t60.33-25.002T597.334 512t-25.002-60.33T512 426.666z",
                  onclick: function () {                      
                      that.showChartDetails = true;
                      that.currenSelectedChartMachine = chartAreaId
                  }
              }
            }  
        },
        yAxis: [
          {
            type: "value",
            name: "Deviation",
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              show:false,
              lineStyle: {
                color: '#57617B'
              }
            }
          }
        ],
        series: [
          {
            name: "Sample 1",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(193,44,133)",
                borderColor: "rgb(193,44,133)",
                borderWidth: 1
              }
            },
            data: dev1Val
          },
          {
            name: "Sample 2",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(151,187,78)",
                borderColor: "rgb(151,187,78)",
                borderWidth: 1
              }
            },
            data: dev2Val
          },
          {
            name: "Sample 3",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(38,136,188)",
                borderColor: "rgb(38,136,188)",
                borderWidth: 1
              }
            },
            data: dev3Val
          },
          {
            name: "Alert - TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(226,105,9)",
                borderColor: "rgb(226,105,9)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dotted'
                }
              }
            },
            data: alertTolMinusVal
          },
          {
            name: "Alert + TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(226,105,9)",
                borderColor: "rgb(226,105,9)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dotted'
                }
              }
            },
            data: alertTolPlusVal
          },
          {
            name: "Drawing - TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(36,36,36)",
                borderColor: "rgb(36,36,36)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dashed'
                }
              }
            },
            data: drawingTolMinusVal
          },
          {
            name: "Drawing + TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(36,36,36)",
                borderColor: "rgb(36,36,36)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dashed'
                }
              }
            },
            data: drawingTolPlusVal
          },
          {
            name: "Nominal",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(55,195,64)",
                borderColor: "rgb(55,195,64)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dotted'
                }
              }
            },
            data: nomialVal
          },
          {
            name: "SIP - TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(237,65,92)",
                borderColor: "rgb(237,65,92)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dotted'
                }
              }
            },
            data: sipTolMinusVal
          },
          {
            name: "SIP + TOL",
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(237,65,92)",
                borderColor: "rgb(237,65,92)",
                borderWidth: 1,
                lineStyle:{                   
                  type:'dotted'
                }
              }
            },
            data: sipTolPlusVal
          }
        ]
      });
    },
    handleRuelsSelectionFilter() {
      this.caclRulesSelectionFilter = "";
      if (this.uniqueHeader !== "") {
        this.caclRulesSelectionFilter =
        /* Temp mark for testing*/
          this.caclRulesSelectionFilter + ",ecsd.headerId EQ " + this.cellQualHeaderId; 
          // this.caclRulesSelectionFilter + ",ecsd.headerId EQ " + 1;
      }

      if (this.searchRulesCondition.caclRuleNames.length>0) {
        this.caclRulesSelectionFilter =
          this.caclRulesSelectionFilter + ",ecsd.ruleName IN " + this.searchRulesCondition.caclRuleNames.join(" ");
      }
      
      /* Temp mark for testing*/
      
      if (this.searchRulesCondition.cellQualCols.length>0) {
        this.caclRulesSelectionFilter =
          this.caclRulesSelectionFilter + ",ecsd.colId IN " + this.uniqueArray(this.searchRulesCondition.cellQualCols).join(" ");
      }

      if (this.searchRulesCondition.cncMachineNo.length>0) {
        this.caclRulesSelectionFilter =
          this.caclRulesSelectionFilter + ",ecsd.machineNo IN " + this.searchRulesCondition.cncMachineNo.join(" ");
      }   
    },
    handleCaclRulesSearch(){
      this.searchRulesCondition.cncMachineNo =  this.cncMachineNoList;
      this.handleRuelsSelectionFilter();
      this.processLoading = true;
      dvApi.initLineChartRiskMachine({limit:10000,filter: this.caclRulesSelectionFilter})
        .then(response => {
          if(response.code='20000'&&response.data.items.length>0){

            let respItems = response.data.items;
            let tempMachineNo = '';
            this.dynamicChartList.forEach(dcl =>{
              tempMachineNo = dcl.key              
              dcl.class = 'line-chart-container-default'
              respItems.forEach(ri=>{           
                if(ri.machineNo == tempMachineNo&&ri.count>0){
                  dcl.class = 'line-chart-container-alert';       
                }
              })
            });
          }else{
            this.dynamicChartList.forEach(dcl =>{         
              dcl.class = 'line-chart-container-default'
            });
          }
          this.processLoading = false;
        }).catch(()=>{
        this.processLoading = false;
      });
    },
    closeMoreSelectionForm() {
      this.showMoreSelectionPopup = false;
    },
    setShowChartDetailsFlag(val){
      this.currenSelectedChartMachine = val;
      this.showChartDetails = true;
    },
    showChartDetailsDialog(){
      this.processLoading = true;
      // this.showChartDetails = true;
      // console.log('chartAreaId:'+this.currenSelectedChartMachine);

      dvApi.initLineChartData( {
          filter: this.moreSelectionFilter,
          cncMachineNo: this.currenSelectedChartMachine,
          dimNos: this.searchMoreConditions.dimNo,
          cutters: this.searchMoreConditions.cutters,
          spc: this.searchMoreConditions.spcCheckList,
          engDbHeaderId: this.searchMoreConditions.engDbHeaderId,
          limit:10000
        }).then(response => {
        if (response.code == "20000") {
          const renderChartList = [];
          // init chart
          this.cncMachineNoList.forEach(machine => {
            // console.log("machine:" + machine);
            const machineChartData = response.data[`${machine}`];
            if (machineChartData) {
                setTimeout(() => {
                 this.initChart('chartDetailArea',machineChartData,this)
             }, 1000)               
            }
          });                    
        }else{
          // this.processLoading = false;
        }
      }).catch(()=>{
        this.processLoading = false;
      });

      let tempArr = [];
      tempArr.push(this.currenSelectedChartMachine);
      this.searchRulesCondition.cncMachineNo = tempArr;//this.currenSelectedChartMachine;  
      this.handleRuelsSelectionFilter();
      this.fetchRiskSuggesTableData();
      this.processLoading = false;
  
    },
    fetchRiskSuggesTableData(){
         dvApi.initLineChartRiskSuggest({limit:10000,filter: this.caclRulesSelectionFilter})
          .then(response => {
              this.riskSuggestTableData = response.data.items
              this.processLoading = false;
          }).catch(()=>{
              this.processLoading = false;
          });  
    },
    showChartRiskDetailEditDialog(riskRow){
      this.processLoading = true;
      this.showChartRiskDetailEdit = true;
      this.showChartRiskDetailEditform.headerId = riskRow.headerId;
      this.showChartRiskDetailEditform.machineNo = riskRow.machineNo;
      this.showChartRiskDetailEditform.ruleName = riskRow.ruleName;
      this.showChartRiskDetailEditform.caclResult = riskRow.caclResult;
      this.showChartRiskDetailEditform.dimNos = riskRow.dimNos;   
      this.showChartRiskDetailEditform.dataRound = riskRow.dataRound;
      this.fetchCellQualMetric('risk_suggest_detail_dim_no');

      let chkDimNumbers = riskRow.chkDimNos;
      // console.log('chkDimNumbers:'+chkDimNumbers);
      // chkDimNumbers = '334_,344_';
      let chkDimNumbersArr = [];

      setTimeout(() => {
        if(chkDimNumbers!=null && chkDimNumbers!=''){
          chkDimNumbers.split(',').forEach(chkDimNumber => {
            chkDimNumbersArr.push(lookup.queryLookupValue(this.riskDetailDimNoLookup, chkDimNumber));
          })    
        }   
        this.showChartRiskDetailEditform.chkDimNos = chkDimNumbersArr;//riskRow.dimNos;
        this.showChartRiskDetailEditform.origChkDimNos = chkDimNumbersArr;//riskRow.dimNos;
        this.processLoading = false;
      }, 1200)      
    },
    closeChartRiskDetailEditDialog(){
      this.showChartRiskDetailEdit = false;
      this.processLoading = false;
    },
    submitChartRiskCheckResult(){
      if(this.showChartRiskDetailEditform.chkDimNos.length>0){
        this.showChartRiskDetailEditform.chkDimNos.forEach(item =>{
          // console.log('chkDimNo item:'+item);
        })
      }
      let addedDimNoItems = [];
      let deletedDimNoItems = [];
      addedDimNoItems = this.compareArray(this.showChartRiskDetailEditform.chkDimNos,this.showChartRiskDetailEditform.origChkDimNos);
      deletedDimNoItems = this.compareArray(this.showChartRiskDetailEditform.origChkDimNos,this.showChartRiskDetailEditform.chkDimNos);
      // addedDimNoItems.forEach(item =>{
      //   console.log('add chkDimNo item:'+item);
      // })
      // deletedDimNoItems.forEach(item =>{
      //   console.log('delete chkDimNo item:'+item);
      // })

      dvApi.submitRiskChkResult( {
          headerId:  this.showChartRiskDetailEditform.headerId,
          machineNo: this.currenSelectedChartMachine,//this.showChartRiskDetailEditform.machineNo,
          dataRound: this.showChartRiskDetailEditform.dataRound,
          ruleName:  this.showChartRiskDetailEditform.ruleName,
          chkResult: this.showChartRiskDetailEditform.caclResult,
          chkBy: this.userId,
          addedItems: addedDimNoItems,
          deletedItems: deletedDimNoItems
        }).then(response => {
        if (response.code == "20000") {

          messageUtils.showSaveSuccess();
          this.showChartRiskDetailEdit=false;   
          this.fetchRiskSuggesTableData();           
        }else{
          // this.processLoading = false;
          messageUtils.showsErrorMessage('Unable to save, please contact system administrator.');
        }
      }).catch(()=>{
        this.processLoading = false;
      });
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions };
      this.filter = "";
      // this.loadData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.loadData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadData();
    },
    uniqueArray(array){
      var temp = [];
      var index = [];
      var l = array.length;
      for(var i = 0; i < l; i++) {
          for(var j = i + 1; j < l; j++){
              if (array[i] === array[j]){
                  i++;
                  j = i;
              }
          }
          temp.push(array[i]);
          index.push(i);
      }
      return temp;
    },
    compareArray(arrayA,arrayB){
      const resultArr = [];
      let existFlag = false;
      arrayA.forEach(a=> {
        existFlag = false;
        arrayB.forEach(b=>{
          if(a===b){
            existFlag = true;
          }
        })
        if(!existFlag){
          resultArr.push(a);
        }
      });
      return resultArr;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.inline-input {
  display: flex;
  > span {
    margin: 0 10px;
  }
}

.el-card {
  margin-right: 8px;
  margin-top:8px;
}

 .el-card /deep/ .el-card__header {
    padding: 18px 10px;
    font-weight: bold;
}

.el-dialog {
  > .el-form-item {
    text-align: center;
  }
}

.line-chart-container-default{
  border: none;
}

.line-chart-container-alert{
  border: 1px solid red !important;
}
</style>
