<template>
  <div class="app-container">
    <OptionBar ref="option" @dataChanged="updateData" chartType="line_chart" />
    <!-- rule box -->
    <div id="rule-box">
      <el-checkbox-group v-model="selectingRules">
        <el-checkbox label="point_risk_level" :disabled="!rulesBoxShow"></el-checkbox>
        <el-checkbox label="outlier_detection" :disabled="!rulesBoxShow"></el-checkbox>
        <el-checkbox label="dispersion_detection" :disabled="!rulesBoxShow"></el-checkbox>
        <el-checkbox label="deviation_detection" :disabled="!rulesBoxShow"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="origin-update-box" v-show="rulesBoxShow" style="margin-top:-1.5em;margin-left:46em;">
      <el-radio-group v-model="originUpdateToggle" size="small">
        <el-radio-button label="Origin"></el-radio-button>
        <el-radio-button label="Update"></el-radio-button>
      </el-radio-group>
    </div>
    <!-- chart title -->
    <title-of-project
      v-show="showVendorProjectTitle"
      :cellQualProjName="cellQual.projName"
      :cellQualVendorName="cellQual.vendorName"
      :cellQualDate="updateDate"
    >Deviation LineChart</title-of-project>
    <!-- main view part -->
    <!-- dim select part -->
    <div
      style="width:5em;position:fixed;overflow-x: hidden;overflow-y:hidden;"
      class="dim-filter"
      v-show="showVendorProjectTitle"
    >
      <h style="margin-bottom:8px">Dim No</h>
      <el-checkbox-group
        v-model="selectingDimNo"
        class="dimNoCheckBox"
        style="height:400px;overflow-x: hidden;"
      >
        <el-checkbox v-for="item in dimNoLookup" :key="item" :label="item" style="width:90%;"></el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" @click="clearSelectingDim()">clear</el-button>
    </div>
    <!-- cards part -->
    <div style="width:90%;margin-left:100px" class="card-box">
      <div ref="chartDv" style="width: 100%;" id="card-container">
        <el-row>
          <el-col :span="8" v-for="(item,key) of plotingData" :key="key">
            <chart-card
              :drawingData="item"
              :cncStation="key"
              :alertList="alertCncStation"
              :debugList="debugDataUsing"
              @showDetail="plotDetailView"
            />
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- more detail view -->
    <el-row>
      <detail-view
        :cncStation="detailCncStation"
        :drawingData="detailDrawingData"
        :showChartDetails="showDetailView"
        :rulesRiskData="rulesDataAll"
        :rulesRiskDataUpdated="rulesDataAllUpdated"
        :debugItem="detailViewDebugItem"
        :debugItemUpdated="detailViewDebugItemUpdated"
        :headerId="headerId"
        @closeDetail="closeDetailView"
        @rulesUpdated="ruleshouldUpdate"
        @debugUpdated="debugshouldUpdate"
      />
    </el-row>
  </div>
</template>

<script>
import OptionBar from "../components/OptionBar.vue";
import TitleOfProject from "../components/TItleOfProject.vue";
import ChartCard from "./ChartCard.vue";
import DetailView from "./DetailView.vue";
import * as dvApi from "@/api/ei/dv";
import echarts from "echarts";
import { Message } from "element-ui";

export default {
  name: "lineChart",
  components: {
    OptionBar,
    TitleOfProject,
    ChartCard,
    DetailView
  },
  data() {
    return {
      showVendorProjectTitle: false,
      cellQual: {
        projName: "",
        vendorName: ""
      },
      updateDate: "",
      plotingData: {},
      headerId: 0,
      dimNoLookup: [],
      selectingDimNo: [],
      showDetailView: false,
      detailCncStation: "",
      detailDrawingData: [],
      //filter rule risk
      rulesDataUsing: {},
      rulesDataAll: {},
      rulesDataAllUpdated: {},
      selectingRules: [],
      alertCncStation: [],
      riskDatashouldUpdate: false,
      rulesBoxShow: false,
      //debug result
      debugDataUsing: [],
      debugDataAll: [],
      debugDataAllUpdated: [],
      detailViewDebugItem: {},
      detailViewDebugItemUpdated: {},
      debugDataShouldUpdate: false,
      //rule source toggle
      originUpdateToggle: "Origin"
    };
  },
  methods: {
    updateData(param) {
      let option = this.$refs.option;
      this.plotingData = {};
      if (param == "SM") {
        //筛选良率,fai or nor,
        this.plotingData = {};
        Object.keys(option.totalData).forEach(key => {
          // do select more, then select dim
          let temp = option.totalData[key];
          temp = this.doSelectMore(temp);
          this.$set(this.plotingData, key, temp);
        });
        this.fillDimNoLookup();
      }

      if (param == "S") {
        this.plotingData = option.totalData;
        this.cellQual.projName = option.project;
        this.cellQual.vendorName = option.vendor;
        this.showVendorProjectTitle = true;
        this.headerId = option.selectingOption[0].cell_header_id;
        this.updateDate = option.selectingOption[0].cell_updated_at;
        this.fillDimNoLookup();
        //get rules
        dvApi
          .getLineChartRules(this.headerId)
          .then(data => {
            // console.log('got rules');
            this.rulesDataAll = data;
            this.rulesDataUsing = data;
            // console.log(this.rulesDataAll);
            this.rulesBoxShow = true;
            Message({
              showClose: true,
              message: "load rules judgement successfully",
              type: "success",
              duration: 3000
            });
          })
          .catch(error => {
            Message({
              showClose: true,
              message: "load rules judgement failed: " + error,
              type: "error",
              duration: 3000
            });
          });
        //get debug
        dvApi
          .getLineChartDebug(this.headerId)
          .then(data => {
            if (typeof data == "string") {
              Message({
                showClose: true,
                message: data,
                type: "warning",
                duration: 3000
              });
            } else {
              this.debugDataAll = data;
              this.debugDataUsing = data;
              Message({
                showClose: true,
                message: "Load machine fine tune info successfully",
                type: "success",
                duration: 3000
              });
            }
          })
          .catch(error => {
            Message({
              showClose: true,
              message: "Load debug judgement failed: " + error,
              type: "error",
              duration: 3000
            });
          });
        //get debug updated
        this.getDebugDataUpdated();
        //get rules updated
        this.getRulesDataUpdated();
      }
    },
    fillDimNoLookup() {
      this.dimNoLookup = [];
      let oneData = this.plotingData[Object.keys(this.plotingData)[0]];
      oneData.forEach(item => {
        if (this.dimNoLookup.indexOf(item.dim_no) == -1) {
          this.dimNoLookup.push(item.dim_no);
        }
      });
    },
    plotDetailView(data) {
      // console.log("got emit with:" + data);
      this.detailCncStation = data;
      this.detailDrawingData = this.plotingData[data];
      // console.log(this.debugDataAll);
      this.detailViewDebugItem = this.debugDataAll.filter(item => {
        return item.cnc_no == data;
      })[0];
      this.detailViewDebugItemUpdated = this.debugDataAllUpdated.filter(item => {
        return item.cnc_no == data;
      })[0];
      // console.log(this.detailViewDebugItemUpdated);
      // console.log(this.detailViewDebugItem);
      // console.log(this.detailDrawingData);
      this.showDetailView = true;
    },
    closeDetailView() {
      this.showDetailView = false;
    },
    clearSelectingDim() {
      this.selectingDimNo = [];
    },
    doSelectMore(oneItem) {
      let temp = oneItem;
      let option = this.$refs.option;
      let yieldFrom = option.searchMoreConditions.projectedYieldFrom / 100;
      let yieldTo = option.searchMoreConditions.projectedYieldTo / 100;
      let faiOrNot = option.searchMoreConditions.spcCheckList;
      let faiFilterList = option.searchMoreConditions.faiNo;
      //FAI No筛选
      if (faiFilterList.length != 0) {
        temp = temp.filter(function(item) {
          return faiFilterList.indexOf(item.faiNo) != -1;
        });
      }
      //良率范围筛选
      if (!(yieldFrom == 0 && yieldTo == 1)) {
        temp = temp.filter(dataItem => {
          return (
            dataItem.projected_yields >= yieldFrom &&
            dataItem.projected_yields <= yieldTo
          );
        });
      }
      //Fai or Not 筛选
      if (!(faiOrNot == "")) {
        if (faiOrNot == "yes") {
          temp = temp.filter(dataItem => {
            return !(dataItem.faiNo == "");
          });
        } else {
          temp = temp.filter(dataItem => {
            return dataItem.faiNo == "";
          });
        }
      }
      return temp;
    },
    getDebugDataUpdated() {
      dvApi
        .getLineChartDebugCheck(this.headerId)
        .then(data => {
          if (typeof data == "string") {
            Message({
              showClose: true,
              message: data,
              type: "warning",
              duration: 3000
            });
          } else {
            this.debugDataAllUpdated = data;
            // console.log("dabugDataAllUpdated");
            // console.log(this.debugDataAllUpdated);
            this.debugDataShouldUpdate = false;
            Message({
              showClose: true,
              message: "Load updated machine fine tune info successfully",
              type: "success",
              duration: 3000
            });
          }
        })
        .catch(error => {
          Message({
            showClose: true,
            message: "Load updated debug judgement failed: " + error,
            type: "error",
            duration: 3000
          });
        });
    },
    getRulesDataUpdated() {
      dvApi
        .getLineChartRulesCheck(this.headerId)
        .then(data => {
          if (typeof data == "string") {
            Message({
              showClose: true,
              message: data,
              type: "warning",
              duration: 3000
            });
          } else {
            this.rulesDataAllUpdated = data;
            this.riskDatashouldUpdate = false;
            Message({
              showClose: true,
              message: "Load updated rules info successfully",
              type: "success",
              duration: 3000
            });
          }
        })
        .catch(error => {
          Message({
            showClose: true,
            message: "Load updated rules info failed: " + error,
            type: "error",
            duration: 3000
          });
        });
    },
    ruleshouldUpdate(){
      this.riskDatashouldUpdate = true;
    },
    debugshouldUpdate(){
      this.debugDataShouldUpdate = true;
    }
  },
  watch: {
    selectingDimNo: function(newval, oldval) {
      // console.log(newval);
      let option = this.$refs.option;
      if (this.selectingDimNo.length != 0) {
        // console.log('不空');
        this.plotingData = {};
        Object.keys(option.totalData).forEach(key => {
          // do select more, then select dim
          let temp = option.totalData[key];
          temp = this.doSelectMore(temp);
          this.$set(
            this.plotingData,
            key,
            temp.filter(function(item) {
              return !(newval.indexOf(item.dim_no) == -1);
            })
          );
        });
      } else {
        //only do select more
        this.plotingData = {};
        Object.keys(option.totalData).forEach(key => {
          // console.log(key);
          let temp = option.totalData[key];
          temp = this.doSelectMore(temp);
          this.$set(this.plotingData, key, temp);
        });
      }
      // console.log(this.plotingData);
    },
    selectingRules: function(newval, oldval) {
      //新增选择
      // console.log('selectingRules changing');
      // console.log(this.selectingRules);
      let rules = this.selectingRules;
      let rulesDataUsing = this.rulesDataUsing;
      this.alertCncStation = [];
      rules.forEach(ruleItem => {
        for (let riskLevelItemKey in rulesDataUsing[ruleItem]) {
          if (
            riskLevelItemKey == "NaN" ||
            riskLevelItemKey == "ok" ||
            riskLevelItemKey == "dispersion_ok" ||
            riskLevelItemKey == "outlier_ok" ||
            riskLevelItemKey == "samples_deviation_ok"
          ) {
            continue;
          } else {
            for (let key in rulesDataUsing[ruleItem][riskLevelItemKey]) {
              if (this.alertCncStation.indexOf(key) == -1) {
                this.alertCncStation.push(key);
              }
            }
          }
        }
      });
      //取消选择, 采用每次清空重新遍历的方式
    },
    originUpdateToggle: function(newval, oldval) {
      console.log(newval);
      if (newval == "Origin") {
        this.rulesDataUsing = this.rulesDataAll;
        this.debugDataUsing = this.debugDataAll;
      } else if (newval == "Update") {
        this.rulesDataUsing = this.rulesDataAllUpdated;
        this.debugDataUsing = this.debugDataAllUpdated;
        // if(this.riskDatashouldUpdate){
        //   this.getRulesDataUpdated();
        //   this.rulesDataUsing = this.rulesDataAllUpdated;
        // }
        // if(this.debugDataShouldUpdate){
        //   this.getDebugDataUpdated();
        //   this.debugDataUsing = this.debugDataAllUpdated;
        // }
      }
    },
    riskDatashouldUpdate: function(newval, oldval){
      if(newval){
        this.getRulesDataUpdated();
      }
    },
    debugDataShouldUpdate: function(newval, oldval){
      if(newval){
        this.getDebugDataUpdated();
      }
    },
    debugDataAllUpdated: function(newval, oldval){

    }
  }
};
</script>

<style scoped>
.dimNoCheckBox {
  display: fixed;
  height: 200px;
  overflow: scroll;
}

#rule-box {
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  border-color: rgba(128, 128, 128, 0.185);
  padding: 2px;
  width: 45em;
  margin-top: 8px;
}
</style>