<template>
  <div class="app-container">
    <OptionBar ref="option" @dataChanged="updateData" chartType="hotmap"/>
    <title-of-project
      v-show="showVendorProjectTitle"
      :cellQualProjName="cellQual.projName"
      :cellQualVendorName="cellQual.vendorName"
    > Hotmap </title-of-project>
    <el-row v-if="show"> 
      <el-col :span="6"><p class="ruleName">Rules:</p></el-col>
      <el-col :span="18">
        <div style="margin-top: 8px">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="dim_risk_level" ></el-radio-button>
            <el-radio-button label="dim_outlier_detection"></el-radio-button>
            <el-radio-button label="dim_dispersion_detection"></el-radio-button>
            <el-radio-button label="dim_deviation_detection"></el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <div ref="chartDv" style="width: 100%;height: 1000px;">
    </div>
  </div>
</template>

<script>
import OptionBar from "../components/OptionBar.vue";
import TitleOfProject from "../components/TItleOfProject.vue";
import echarts from "echarts";
import "echarts/dist/extension/dataTool";
import axios from 'axios'
// import testData from './heat_map_response.json'

import * as dvApi from "@/api/ei/dv";

var riskLevel2num={
  '0.0':'ok',
  '1.0':'ok*',
  '2.0':'SIP Alert +',
  '-2.0':'SIP Alert -',
  '2.5':'Drawing Alert +',
  '-2.5':'Drawing Alert -',
  '3.0':'SIP Reject +',
  '-3.0':'SIP Reject -',
  '4.0':'Drawing Reject +',
  '-4.0':'Drawing Reject -'
}
var outlier2num={
  '0.0':'NaN',
  '1.0':'outlier_ok',
  '2.0':'outlier_ok*',
  '3.0':'outlier_potential',
  '4.0':'outlier_potential*',
  '5.0':'outlier_risk',
  '6.0':'outlier_risk*'
}
var dispersion2num={
  '0.0':'NaN',
  '1.0':'dispersion_ok',
  '2.0':'dispersion_ok*',
  '3.0':'dispersion_risk',
  '4.0':'dispersion_risk*'
}
var deviation2num={
  '0.0':'NaN',
  '1.0':'deviation_ok',
  '2.0':'deviation_ok*',
  '3.0':'deviation_risk',
  '4.0':'deviation_risk*'
}

var riskLevelColorRule=[
  {value: "0.0", label: riskLevel2num["0.0"], color:'rgba(0,145,0,0.8)'}, //深绿
  {value: "1.0", label: riskLevel2num["1.0"], color:'rgba(0,236,0,0.8)'}, //浅绿
  {value: "2.0", label: riskLevel2num["2.0"], color:'rgba(255,88,9,0.8)'}, //橙色
  {value: "-2.0", label: riskLevel2num["-2.0"], color:'rgba(255,88,9,0.8)'}, //橙色
  {value: "2.5", label: riskLevel2num["2.5"], color:'rgba(255,88,9,0.8)'}, //橙色
  {value: "-2.5", label: riskLevel2num["-2.5"], color:'rgba(255,88,9,0.8)'}, //橙色
  {value: "3.0", label: riskLevel2num["3.0"], color:'rgba(255,117,117,0.8)'}, //浅红
  {value: "-3.0", label: riskLevel2num["-3.0"], color:'rgba(255,117,117,0.8)'}, //浅红
  {value: "4.0", label: riskLevel2num["4.0"], color:'rgba(174,0,0,0.8)'}, //深红
  {value: "-4.0", label: riskLevel2num["-4.0"], color:'rgba(174,0,0,0.8)'}, //深红
]
var outlierColorRule=[
  {value: "0.0", label: outlier2num["0.0"], color:'rgba(235,235,235,0.8)'},
  {value: "1.0", label: outlier2num["1.0"], color:'rgba(0,145,0,0.8)'},//深绿
  {value: "2.0", label: outlier2num["2.0"], color:'rgba(0,145,0,0.8)'},
  {value: "3.0", label: outlier2num["3.0"], color:'rgba(255,88,9,0.8)'},//橙色
  {value: "4.0", label: outlier2num["4.0"], color:'rgba(255,88,9,0.8)'},//橙色
  {value: "5.0", label: outlier2num["5.0"], color:'rgba(174,0,0,0.8)'},
  {value: "6.0", label: outlier2num["6.0"], color:'rgba(174,0,0,0.8)'},//深红
]
var dispersionColorRule=[
  {value: "0.0", label: dispersion2num["0.0"], color:'rgba(235,235,235,0.8)'},
  {value: "1.0", label: dispersion2num["1.0"], color:'rgba(0,145,0,0.8)'},//深绿
  {value: "2.0", label: dispersion2num["2.0"], color:'rgba(0,145,0,0.8)'},
  {value: "3.0", label: dispersion2num["3.0"], color:'rgba(174,0,0,0.8)'},
  {value: "4.0", label: dispersion2num["4.0"], color:'rgba(174,0,0,0.8)'},//深红
]

var deviationColorRule=[
  {value: "0.0", label: deviation2num["0.0"], color:'rgba(235,235,235,0.8)'},
  {value: "1.0", label: deviation2num["1.0"], color:'rgba(0,145,0,0.8)'},//深绿
  {value: "2.0", label: deviation2num["2.0"], color:'rgba(0,145,0,0.8)'},
  {value: "3.0", label: deviation2num["3.0"], color:'rgba(174,0,0,0.8)'},
  {value: "4.0", label: deviation2num["4.0"], color:'rgba(174,0,0,0.8)'},//深红
]

export default {
  name: "hotMapChart",
  components: {
    OptionBar,
    TitleOfProject
  },
  data() {
    return {
      showVendorProjectTitle: false,
      cellQual: {
        projName: "",
        vendorName: ""
      },
      plotDataAll: [],
      radio: "dim_risk_level",
      show: false,
      showRuleData: []
    };
  },
  // mounted() {
  //     this.plotDataAll = dvApi.testData_json();
  //     this.initPlot();
  // },
  methods: {
    //将option组件request到的一些data传递到父组件使用
    updateData(param) {
      let option = this.$refs.option;
      this.cellQual.projName = option.project;
      this.cellQual.vendorName = option.vendor;
      this.showVendorProjectTitle = true;
      //目前只筛选dimNo
      let dimNo = option.searchMoreConditions.dimNo;
      if (dimNo != 0) {
        this.plotDataAll = option.totalData.filter(function(item) {
          return !(dimNo.indexOf(item.dim_no) == -1);
        });
      } else {
        this.plotDataAll = option.totalData;
      }
      if (this.plotDataAll.hasOwnProperty("msg")){
          alert(this.plotDataAll.msg)
      }
      
    },
    formatPlotData() {},

    initPlot(ruleName) {
      let chartDv = this.$refs.chartDv;
      let echart = echarts.init(chartDv);
      
      // let data=this.plotDataAll

      // console.log(ruleName)
      // console.log(this.plotDataAll)
      // var data=testData[ruleName]
      var data=this.plotDataAll[ruleName]
      var num2rule
      var rulePieces
      if (ruleName=="dim_risk_level"){
        num2rule=riskLevel2num
        rulePieces=riskLevelColorRule
      }
      if (ruleName=="dim_outlier_detection"){
        num2rule=outlier2num
        rulePieces=outlierColorRule
      }
      if (ruleName=="dim_dispersion_detection"){
        num2rule=dispersion2num
        rulePieces=dispersionColorRule
      }
      if (ruleName=="dim_deviation_detection"){
        num2rule=deviation2num
        rulePieces=deviationColorRule
      }
      let xlabel = data.cnc_no
      let ylabel = data.fai_no_list
      let arr=[]
      for (var item of data.data){
        // console.log(item)
        arr.push(
            // [item.cnc_no, item.fai_no.toString(), item.projected_yields, item.risk2num]
            [item.cnc_no, item.fai_no.toString(), item.risk2num]
            );
      } 
      // console.log(xlabel)
      // console.log(ylabel)
      let option = {
        tooltip: {
            show:true,
            position: 'top',
            formatter:function(params){
              return [ 
                'CNC: ' + params.name + '&nbsp&nbsp&nbsp&nbspFAI NO: ' + params.data[1],
                'Risk Level :' + num2rule[params.data[2].toFixed(1).toString()],
                // 'Projected Yields: ' + params.data[2]
              ].join("<br/>");
            },
        },
        animation: false,
        grid: {
            height: '90%',
            width: '10%',
            top: '2%',
            left: '20%'
        },
        xAxis: {
            type: 'category',
            data: xlabel,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: ylabel,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            type: 'piecewise',
            splitNumber: 10,
            pieces:rulePieces,
            calculable: false,
            orient: 'vertical',
            left: '0%',
            bottom: '50%'
        },
        series: [{
            name: 'Risk Level',
            type: 'heatmap',
            data: arr,
            label: {
                normal:{
                    show: true,
                    formatter:function(params){
                      let temp=num2rule[params.data[2].toFixed(1).toString()]
                      // console.log(temp.charAt(temp.length-1))
                      if (ruleName!='dim_risk_level' && temp.charAt(temp.length-1) == '*'){
                        return '*';
                      }else {
                        return '';
                      }
                    },
                    fontSize: 16,
                    fontFamily:'宋体',
                },
                emphasis:{
                    show: false,
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
          }]
      
      };
      echart.setOption(option);
    },
  },
  watch: {
    plotDataAll: function(newValue, oldValue) {
      this.initPlot('dim_risk_level');//值的改变触发initPlot函数
      this.show = true
    },
    radio: function(newValue, oldValue) {
      // console.log(newValue)
      this.initPlot(newValue)
      this.show = true
    }
  }
};
</script>
<style scoped>
  .ruleName {
  text-align: center;
}
</style>