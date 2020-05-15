<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-select
          v-model="project"
          class="filter-item"
          style="width: 99%;"
          placeholder="Project"
          clearable
        >
          <el-option v-for="item in projectLookup" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="partNo"
          class="filter-item"
          style="width: 99%;"
          placeholder="Part NO."
          clearable
        >
          <el-option v-for="item in partNoLookup" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="vendor"
          class="filter-item"
          style="width: 99%;"
          placeholder="Vendor"
          clearable
        >
          <el-option v-for="item in vendorLookup" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select
          v-model="build"
          class="filter-item"
          style="width: 99%;"
          placeholder="Build"
          clearable
        >
          <el-option v-for="item in buildLookup" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select
          v-model="cncSatation"
          class="filter-item"
          style="width: 99%;"
          placeholder="CNC#"
          clearable
        >
          <el-option v-for="item in cncStationLookup" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>

      <el-col :span="2">
        <el-select
          v-model="dataround"
          class="filter-item"
          style="width: 99%;"
          placeholder="Data Round"
          clearable
        >
          <el-option v-for="item in dataRoundLookup" :key="item" :label="item" :value="item" />
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
    <!-- 条件选择区域 end -->
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
                <el-option v-for="item in dimNoLookup" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMoreSelectionForm()">Cancel</el-button>
        <!-- 修改多选响应逻辑 -->
        <el-button
          type="primary"
          v-loading.fullscreen.lock="processLoading"
          element-loading-text="Loading..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @click="changedDrawingData()"
        >Confirm</el-button>
      </div>
    </el-dialog>
    <!-- Select More Dialog end -->
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
  cutters: [],
  engDbHeaderId: ""
};

import * as lookup from "@/utils/lookup";
import * as messageUtils from "@/utils/messageUtils";
import { MessageBox, Message, Loading } from "element-ui";
import * as cellQualDataApi from "@/api/ei/cellQualData";
import * as dvApi from "@/api/ei/dv";
import i18n from "@/i18n";
import axios from "axios";

export default {
  name: "OptionBar",
  props: ["chartType"],
  data() {
    return {
      initMoreSelectionFilter: "",
      moreSelectionFilter: "",
      projectLookup: [],
      partNoLookup: [],
      vendorLookup: [],
      buildLookup: [],
      cncStationLookup: [],
      dataRoundLookup: [],
      // tableData: [],

      processLoading: false,
      currentRow: { status: "", uploadStatus: "" },
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      filter: "",
      uniqueHeader: false,
      disableCaclRulesArea: true,
      cellQualHeaderId: null,
      cellQualVendorName: "",
      cellQualProjName: "",
      cellQualDate: "",
      cellQualCNCStation: "",

      //%%%改变后增加%%%
      totalData: [],
      totalOption: [],
      selectingOption: [],
      showMoreSelectionPopup: false, //保留
      searchConditions: { ...initialSearchConditions }, //保留
      searchMoreConditions: { ...initSearchMoreConditions }, //保留
      //searchMore 的lookup保留
      cncMachineNoLookup: [],
      cncMachineNoList: [],
      faiNoLookup: [],
      dimNoLookup: [],
      cutterNoLookup: [],
      //把searchConditions对象拆开来以方便watch
      project: "",
      vendor: "",
      build: "",
      partNo: "",
      cncSatation: "",
      dataround: ""
    };
  }, //template data
  mounted() {
    this.fetchLookup2();
  }, //mounted actions
  watch: {
    // searchConditions: function(newval,oldval){
    //   console.log("condition changed");
    //   let nullCnt = 6;
    //   for(let key in this.searchConditions){
    //     if(this.searchConditions[key]){
    //       nullCnt -= 1;
    //       filtOptionLookup(key);
    //     }
    //   }
    //   if(nullCnt == 6){
    //     this.selectingOption = this.totalOption;
    //   }
    // },
    // selectingOption: function(newval,oldval){
    //   console.log('selecting option changed');
    //   this.fillOptionLookup();
    // },
    // searchConditions: function(newval,oldval){
    //   console.log('condition changedd');
    //   console.log('condition changedd');
    //   console.log('condition changedd');
    //   console.log('condition changedd');
    // },
    project: function(newval, oldval) {
      console.log("project changed:" + this.project);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    },
    vendor: function(newval, oldval) {
      console.log("vendor changed:" + this.vendor);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    },
    build: function(newval, oldval) {
      console.log("build changed:" + this.build);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    },
    partNo: function(newval, oldval) {
      console.log("partNo changed:" + this.partNo);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    },
    cncSatation: function(newval, oldval) {
      console.log("cncSatation changed:" + this.cncSatation);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    },
    dataround: function(newval, oldval) {
      console.log("dataround changed:" + this.dataround);
      this.doFiltOptionLookup();
      console.log(this.selectingOption);
    }
  },
  methods: {
    // emit a event to tell parent data changed
    popDataChangedEvent(param) {
      this.$emit("dataChanged", param);
      // 'S'是大条件， 'SM'是select more里的条件
    },
    //get input holdplace and options
    fetchLookup() {
      const lookupTypes = ["EI_BUILD", "EI_DATA_ROUND", "EI_DV_RULE"];
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
    //%%%改变后增加%%%
    fetchLookup2() {
      dvApi
        .getOptionLookup()
        .then(res => {
          this.totalOption = res;
          this.selectingOption = this.totalOption;
          this.fillOptionLookup();
          // console.log(this.totalOption);
          // this.fillOptionLookup();
          // console.log(this.projectLookup);
        })
        .catch(err => {
          //暂时用alert
          alert(err);
        });
    },
    fillOptionLookup() {
      this.clearOptionLookup();
      for (var item of this.selectingOption) {
        if (item.project && this.projectLookup.indexOf(item.project) == -1) {
          this.projectLookup.push(item.project);
        }
        if (item.vendor && this.vendorLookup.indexOf(item.vendor) == -1) {
          this.vendorLookup.push(item.vendor);
        }
        if (item.build && this.buildLookup.indexOf(item.build) == -1) {
          this.buildLookup.push(item.build);
        }
        if (
          item.cnc_satation &&
          this.cncStationLookup.indexOf(item.cnc_satation) == -1
        ) {
          this.cncStationLookup.push(item.cnc_satation);
        }
        if (
          item.data_round &&
          this.dataRoundLookup.indexOf(item.data_round) == -1
        ) {
          this.dataRoundLookup.push(item.data_round);
        }
        if (item.part_no && this.partNoLookup.indexOf(item.part_no) == -1) {
          this.partNoLookup.push(item.part_no);
        }
      }
      // console.log(this.partNoLookup);
    },
    clearOptionLookup() {
      this.projectLookup = [];
      this.vendorLookup = [];
      this.buildLookup = [];
      this.partNoLookup = [];
      this.cncStationLookup = [];
      this.dataRoundLookup = [];
    },
    doFiltOptionLookup() {
      this.selectingOption = this.totalOption;
      // this.clearOptionLookup();
      if (this.project != "") {
        this.filtOptionLookup("project");
      }
      if (this.vendor != "") {
        this.filtOptionLookup("vendor");
      }
      if (this.build != "") {
        this.filtOptionLookup("build");
      }
      if (this.partNo != "") {
        this.filtOptionLookup("partNo");
      }
      if (this.cncSatation != "") {
        this.filtOptionLookup("cncSatation");
      }
      if (this.dataround != "") {
        this.filtOptionLookup("dataround");
      }
      this.fillOptionLookup();
    },
    filtOptionLookup(param) {
      if (param == "project") {
        let temp = this.project;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.project == temp;
        });
      }
      if (param == "partNo") {
        let temp = this.partNo;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.part_no == temp;
        });
      }
      if (param == "vendor") {
        let temp = this.vendor;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.vendor == temp;
        });
      }
      if (param == "build") {
        let temp = this.build;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.build == temp;
        });
      }
      if (param == "cncStation") {
        let temp = this.cncSatation;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.cnc_satation == temp;
        });
      }
      if (param == "dataround") {
        let temp = this.dataround;
        this.selectingOption = this.selectingOption.filter(function(item) {
          return item.data_round == temp;
        });
      }
    },
    fetchTotalData(header_id) {
      //using test data
      //尚未考虑fetch到多张表的处理逻辑
      // console.log(this.chartType);
      let url_type = "";
      if (this.chartType == "boxplot") {
        url_type = "boxplot";
      } else if (this.chartType == "hotmap") {
        url_type = "heat_map";
      } else if (this.chartType == "histogram") {
        url_type = "bar_graph";
      } else {
        url_type = "line_chart";
      }
      // console.log("test");
      return new Promise((resolve, reject) => {
        dvApi
          .getPlotDataByHeaderIdAndType(header_id, url_type)
          .then(response => {
            this.totalData = response;
            resolve("ok");
            // console.log(this.totalData);
          })
          .catch(error => {
            reject(error);
          });
      });

      // if (this.chartType == "boxplot") {
      //   // this.totalData = dvApi.testData_json();
      // } else if (this.chartType == "hotmap") {
      //   //调用hotmap的api
      //   // var _this=this
      //   let mes = window.location;
      //   let _baseurl = `//${mes.hostname}:${mes.port}`;
      //   axios({
      //     baseURL: _baseurl, //重写baseURL
      //     url: "api_visual_heat_map/",
      //     method: "post",
      //     data: {
      //       header_id: "1"
      //     }
      //   })
      //     .then(response => {
      //       // this.data=response.data
      //       this.totalData = response.data;
      //       // post 成功，制response.data 为返回的数百据
      //       // console.log(response.data)
      //       // return response.data
      //     })
      //     .catch(error => {
      //       // 请求失度败
      //       console.log(error);
      //     });
      // } else if (this.chartType == "histogram") {
      //   //调用柱状图的api
      //   this.totalData = dvApi.testData_json();
      // } else {
      //   //折线图
      // }
      // this.drawingData = totalData;
    },
    //这里是在同一张表里筛选 多张表尚未考虑
    changedDrawingData() {
      //不再多拷贝一份数据，只在父组件中通过searchCondition去筛选画图的数据
      this.popDataChangedEvent("SM");
      this.showMoreSelectionPopup = false;
    },
    handleSearch() {
      //判断所选条件是否唯一确定一张表
      let header_id = "";
      if (this.selectingOption.length == 1) {
        //判断是取 cell qual data 表，还是dim summary 表
        if (this.chartType == "hotmap") {
          header_id = this.selectingOption[0].dim_header_id;
        } else {
          header_id = this.selectingOption[0].cell_header_id;
        }
      } else {
        //未能唯一确定header_id
        alert("please select the rest options");
      }
      //判断head_id是否为空
      if (header_id) {
        // console.log(this.searchConditions);
        this.processLoading = true;
        this.fetchTotalData(header_id)
          .then(res => {
            this.processLoading = false;
            // console.log(this.totalData);
            MessageBox.confirm(
              "Do you want to Show Charts or Open the more conditions select window?",
              i18n.t("core.tips"),
              {
                showClose: false,
                confirmButtonText: "Show",
                cancelButtonText: "Select More",
                type: "info",
                dangerouslyUseHTMLString: true
              }
            )
              .then(() => {
                this.popDataChangedEvent();
              })
              .catch(() => {
                this.popupMoreSearch();
              });
          })
          .catch(error => {
            //暂时用alert
            alert(error);
          });
      }
      else{
        alert("no data suitable for these option yet");
      }
    },
    handleReset() {
      this.project = "";
      this.vendor = "";
      this.build = "";
      this.partNo = "";
      this.cncStationLookup = "";
      this.dataround = "";
    },
    popupMoreSearch() {
      this.showMoreSelectionPopup = true;
      this.fillMoreSearchOptions();
    },
    closeMoreSelectionForm() {
      this.showMoreSelectionPopup = false;
    },
    fillMoreSearchOptions() {
      // test data, only fill up dimNoLookup
      let data = this.totalData;
      // console.log(data);
      for (var item of data) {
        if (this.chartType == "boxplot") {
          this.dimNoLookup.push(item["dim-point"]);
        } else if (this.chartType == "histogram") {
          this.dimNoLookup.push(item.dim_no);
        }
      }
      // this.dimNoLookup.push('BM_1');
    }

    //下面是师兄原来写的，暂时不用
    // //Search button handler
    // handleSearch() {
    //   this.handleFilter();
    //   this.loadData();
    // },
    // //format searchConditions
    // handleFilter() {
    //   this.filter = "";
    //   if (this.searchConditions.title !== "") {
    //     this.filter =
    //       this.filter + ",t.title CONTAIN " + this.searchConditions.title;
    //   }
    //   if (this.searchConditions.project !== "") {
    //     this.filter = this.filter + ",t.projectId EQ " + this.searchConditions;
    //   }

    //   if (this.searchConditions.vendor !== "") {
    //     this.filter =
    //       this.filter + ",t.vendorId EQ " + this.searchConditions.vendor;
    //   }

    //   if (this.searchConditions.build !== "") {
    //     this.filter =
    //       this.filter + ",t.build EQ " + this.searchConditions.build;
    //   }

    //   if (this.searchConditions.partNo !== "") {
    //     this.filter =
    //       this.filter + ",t.partNo CONTAIN " + this.searchConditions.partNo;
    //   }

    //   if (this.searchConditions.dataround !== "") {
    //     this.filter =
    //       this.filter + ",t.dataRound EQ " + this.searchConditions.dataround;
    //   }

    //   if (this.searchConditions.cncSatation !== "") {
    //     this.filter =
    //       this.filter +
    //       ",t.cncSatation EQ " +
    //       this.searchConditions.cncSatation;
    //   }
    // },
    // // request data
    // loadData() {
    //   // debugger
    //   this.processLoading = true;
    //   this.currentRow = { status: "" };
    //   cellQualDataApi
    //     .select({
    //       currentPage: this.currentPage,
    //       limit: this.limit,
    //       filter: this.filter
    //     })
    //     .then(response => {
    //       this.tableData = response.data.items;
    //       this.totalCount = response.data.totalCount;

    //       this.processLoading = false;

    //       if (this.totalCount == 1) {
    //         this.uniqueHeader = true;
    //         this.disableCaclRulesArea = false;
    //         this.cellQualHeaderId = response.data.items[0].headerId;
    //         this.cellQualCNCStation = response.data.items[0].cncSatation;
    //         this.cellQualVendorName = response.data.items[0].vendor;
    //         this.cellQualProjName = response.data.items[0].project;
    //         this.cellQualDate = response.data.items[0].updatedAt;

    //         MessageBox.confirm(
    //           "Do you want to Show Charts or Open the more conditions select window?",
    //           i18n.t("core.tips"),
    //           {
    //             showClose: false,
    //             confirmButtonText: "Show",
    //             cancelButtonText: "Select More",
    //             type: "info",
    //             dangerouslyUseHTMLString: true
    //           }
    //         )
    //           .then(() => {
    //             //重置查询条件
    //             this.searchMoreConditions = { ...initSearchMoreConditions };
    //             // this.handleMoreSelectionFilter();
    //             this.initMoreSelectionFilter =
    //               ",t.headerId EQ " + this.cellQualHeaderId;
    //             //获取machine
    //             this.fetchCellQualMetric("cnc_machine");
    //             this.moreSelectionFilter =
    //               ",dc.headerId EQ " + this.cellQualHeaderId;
    //             //draw line charts
    //             //**组件化后这里要改变
    //             setTimeout(() => {
    //               this.fetchChartData("S");
    //             }, 1000);
    //           })
    //           .catch(() => {
    //             this.popupMoreSearch();
    //           });
    //       } else {
    //         messageUtils.showsErrorMessage(
    //           i18n.tc("dv.line.mutlipleRecsFound")
    //         );
    //         this.uniqueHeader = false;
    //         //** project title 显示要改 */
    //         // this.showVendorProjectTitle = false;
    //         this.disableCaclRulesArea = false;
    //       }
    //     })
    //     .catch(() => {
    //       this.processLoading = false;
    //     });
    // },
    // //fetch chart data
    // //**要根据不同图修改
    // fetchChartData(operationType) {
    //   //**交给父组件去处理title显示
    //   // this.showVendorProjectTitle = true;
    //   this.processLoading = true;
    //   //operationType S - from Search Button  SM - from Search More button
    //   if ("SM" == operationType) {
    //     if (this.searchMoreConditions.cncMachineNo.length !== 0) {
    //       this.cncMachineNoList = this.searchMoreConditions.cncMachineNo;
    //     } else {
    //       this.setAllMachineNoList();
    //     }
    //   } else if ("S" == operationType) {
    //     this.setAllMachineNoList();
    //   }

    //   dvApi
    //     .initLineChartData(this.getQueryParameter({}))
    //     .then(response => {
    //       if (response.code == "20000") {
    //         const renderChartList = [];
    //         this.cncMachineNoList.forEach(machine => {
    //           // console.log("machine:" + machine);
    //           const machineChartData = response.data[`${machine}`];
    //           if (machineChartData) {
    //             renderChartList.push({
    //               key: machine,
    //               val: machine,
    //               class: "line-chart-container-default"
    //             });
    //             machineChartData.forEach(mcdi => {
    //               // console.log(mcdi.faiNo + " / " + mcdi.dev1);
    //             });
    //           }
    //         });
    //         // // render chart areas
    //         // this.dynamicChartList = renderChartList;
    //         // this.searchRulesCondition.cellQualCols = [];
    //         // // init chart
    //         // this.cncMachineNoList.forEach(machine => {
    //         //   this.processLoading = false;
    //         //   // console.log("machine:" + machine);
    //         //   const machineChartData = response.data[`${machine}`];
    //         //   if (machineChartData) {
    //         //     setTimeout(() => {
    //         //       this.initChart(machine, machineChartData, this);
    //         //     }, 1000);
    //         //   }
    //         // });
    //         this.showMoreSelectionPopup = false;
    //       } else {
    //         this.processLoading = false;
    //       }
    //     })
    //     .catch(() => {
    //       this.processLoading = false;
    //     });
    // },
    // fetchCellQualMetric(name) {
    //   dvApi
    //     .initLineChartMoreSelectOption(
    //       { currentPage: 1, limit: 1000, filter: this.initMoreSelectionFilter },
    //       name
    //     )
    //     .then(response => {
    //       if ("cnc_machine" == name) {
    //         this.cncMachineNoLookup = response.data.items;
    //       } else if ("fai_no" == name) {
    //         this.faiNoLookup = response.data.items;
    //       } else if ("dim_no" == name) {
    //         this.dimNoLookup = response.data.items;
    //       } else if ("cutter_no" == name) {
    //         this.cutterNoLookup = response.data.items;
    //         if (this.cutterNoLookup.length > 0) {
    //           this.searchMoreConditions.engDbHeaderId =
    //             response.data.items[0].value;
    //         }
    //       } else if ("risk_suggest_detail_dim_no" == name) {
    //         this.riskDetailDimNoLookup = response.data.items;
    //       }
    //     });
    // },
    // popupMoreSearch() {
    //   if (this.uniqueHeader) {
    //     this.showMoreSelectionPopup = true;
    //     //加载与上次不一样的cellqualdata headerid，重新加载
    //     // debugger
    //     if (this.cellQualHeaderId !== this.moreSelectionHeaderId) {
    //       this.moreSelectionHeaderId = this.cellQualHeaderId;
    //       //重置查询条件
    //       this.searchMoreConditions = { ...initSearchMoreConditions };
    //       // this.handleMoreSelectionFilter();
    //       this.initMoreSelectionFilter =  ",t.headerId EQ " + this.cellQualHeaderId;
    //       //加载弹出框参数
    //       this.fetchCellQualMetric("cnc_machine");
    //       this.fetchCellQualMetric("fai_no");
    //       this.fetchCellQualMetric("dim_no");
    //       this.fetchCellQualMetric("cutter_no");
    //       this.$refs.moreSelectionForm.resetFields();
    //     }
    //   } else {
    //     this.showMoreSelectionPopup = false;
    //     messageUtils.showsErrorMessage(i18n.tc('dv.line.mutlipleRecsFound'));
    //   }
    // },
    // //fet
    // setAllMachineNoList(){
    //     this.cncMachineNoList = [];
    //     this.cncMachineNoLookup.forEach(item =>{
    //       // console.log('item.value:'+item.value);
    //        this.cncMachineNoList.push(item.value);
    //     })
    // }
  } //methods
};
</script>

<style lang="scss" scoped>
</style>