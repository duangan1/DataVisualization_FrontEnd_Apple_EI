<template>
  <div class="app-container">
    <OptionBar ref="option" @dataChanged="updateData" chartType="line_chart" />
    <title-of-project
      v-show="showVendorProjectTitle"
      :cellQualProjName="cellQual.projName"
      :cellQualVendorName="cellQual.vendorName"
    >Deviation LineChart</title-of-project>
    <!-- main view part -->
    <!-- dim select part -->
    <div
      style="width:20%;position:fixed;overflow-x: hidden;overflow-y:scroll;"
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
              :alertStyle="alertList"
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
        @closeDetail="closeDetailView"
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
      plotingData: {},
      alertList: [],
      dimNoLookup: [],
      selectingDimNo: [],
      showDetailView: false,
      detailCncStation: "",
      detailDrawingData: []
    };
  },
  methods: {
    updateData(param) {
      let option = this.$refs.option;
      this.cellQual.projName = option.project;
      this.cellQual.vendorName = option.vendor;
      this.showVendorProjectTitle = true;
      //目前只筛选dimNo
      // let dimNo = option.searchMoreConditions.dimNo;
      // if (dimNo != 0) {
      //   this.plotDataAll = option.totalData.filter(function(item) {
      //     return !(dimNo.indexOf(item['dim-point']) == -1);
      //   });
      // } else {
      //   this.plotDataAll = option.totalData;
      // }
      this.plotingData = option.totalData;
      this.fillDimNoLookup();
    },
    fillDimNoLookup() {
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
      // console.log(this.detailDrawingData);
      this.showDetailView = true;
    },
    closeDetailView() {
      this.showDetailView = false;
    },
    clearSelectingDim() {
      this.selectingDimNo = [];
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
          // console.log(key);
          this.$set(
            this.plotingData,
            key,
            option.totalData[key].filter(function(item) {
              return !(newval.indexOf(item.dim_no) == -1);
            })
          );
        });
      } else {
        this.plotingData = option.totalData;
      }
      // console.log(this.plotingData);
    }
  }
};
</script>

<style lang="css" scoped>
.dimNoCheckBox {
  display: fixed;
  height: 200px;
  overflow: scroll;
}
</style>