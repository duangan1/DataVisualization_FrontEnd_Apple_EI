<template>
  <div class="app-container">
    <OptionBar ref="option" @dataChanged="updateData" chartType="hotmap"/>
    <title-of-project
      v-show="showVendorProjectTitle"
      :cellQualProjName="cellQual.projName"
      :cellQualVendorName="cellQual.vendorName"
      
    > Risk Level Hotmap </title-of-project>
    <div ref="chartDv" style="width: 100%;height: 1000px">
        <!-- <h1>hotmap</h1> -->
    </div>
  </div>
</template>

<script>
import OptionBar from "../components/OptionBar.vue";
import TitleOfProject from "../components/TItleOfProject.vue";
import echarts from "echarts";
import "echarts/dist/extension/dataTool";
import axios from 'axios'
// import 'echarts/lib/chart/heatmap';
// import 'echarts/lib/chart/heatmap';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';


//test plot
import * as dvApi from "@/api/ei/dv";

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
      updateTime: "",
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
      this.updateTime = option.updateTime ;
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
    },
    formatPlotData() {},

    initPlot() {
      let chartDv = this.$refs.chartDv;
      let echart = echarts.init(chartDv);
      
      let mes = window.location;
      let _baseurl = `//${mes.hostname}:${mes.port}`;
      
      let data=this.plotDataAll

      // console.log(data)
      let xlabel = data.machine_no_list
      let ylabel = data.fai_no_list
      let arr=[]
      for (var item of data.data){
        // console.log(item)
        arr.push(
            [item.machine_no, item.fai_no.toString(), item.projected_yields, item.risk2num]
            );
      } 
      // console.log(xlabel)
      // console.log(ylabel)

      let option = {
        tooltip: {
            show:true,
            position: 'top',
            formatter:function(params){
              let text;
              switch (params.data[3]){
                  case 0:
                      text = 'ok';
                      break;
                  case 1.0:
                      text = 'ok*';
                      break;
                  case 2.0:
                      text = 'SIP Alert +';
                      break;
                  case -2.0:
                      text = 'SIP Alert -';
                      break;
                  case 2.5:
                      text = 'Drawing Alert +';
                      break;
                  case -2.5:
                      text = 'Drawing Alert -';
                      break;
                  case  3.0:
                      text = 'SIP Reject +';
                      break;
                  case  -3.0:
                      text = 'SIP Reject -';
                      break;
                  case  4.0:
                      text = 'Drawing Reject +';
                      break;
                  case  -4.0:
                      text = 'Drawing Reject -';
                      break;
              } 
              return [ 
                'CNC: ' + params.name + '&nbsp&nbsp&nbsp&nbspFAI NO: ' + params.data[1],
                'Risk Level :' + text,
                'Projected Yields: ' + params.data[2]
              ].join("<br/>");
            },
        },
        animation: false,
        grid: {
            height: '90%',
            width: '10%',
            top: '5%',
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
            pieces:[
                {value: '0', label: 'ok', color:'rgba(0,145,0,0.8)'},
                {value: "1", label: "ok*", color:'rgba(0,236,0,0.8)'},
                {value: "2", label: "SIP Alert +", color:'rgba(255,88,9,0.8)'},
                {value: "-2", label: "SIP Alert -", color:'rgba(255,88,9,0.8)'},
                {value: "2.5", label: "Drawing Alert +", color:'rgba(255,88,9,0.8)'},
                {value: "-2.5", label: "Drawing Alert -", color:'rgba(255,88,9,0.8)'},
                {value: "3", label: "SIP Reject +", color:'rgba(255,117,117,0.8)'},
                {value: "-3", label: "SIP Reject -", color:'rgba(255,117,117,0.8)'},
                {value: "4", label: "Drawing Reject +", color:'rgba(174,0,0,0.8)'},
                {value: "-4", label: "Drawing Reject -", color:'rgba(174,0,0,0.8)'},
                ],
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
                    show: false,
                    formatter:function(params){
                        let text;
                        switch (params.data[2]){
                            case 0:
                                text = 'ok';
                                break;
                            case 1.0:
                                text = 'ok*';
                                break;
                            case 2.0:
                                text = 'SIP Alert +';
                                break;
                            case -2.0:
                                text = 'SIP Alert -';
                                break;
                            case 2.5:
                                text = 'Drawing Alert +';
                                break;
                            case -2.5:
                                text = 'Drawing Alert -';
                                break;
                            case  3.0:
                                text = 'SIP Reject +';
                                break;
                            case  -3.0:
                                text = 'SIP Reject -';
                                break;
                            case  4.0:
                                text = 'Drawing Reject +';
                                break;
                            case  -4.0:
                                text = 'Drawing Reject -';
                                break;
                        } 
                        return text;
                    },
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
    }
  },
  watch: {
    plotDataAll: function(newValue, oldValue) {
      // alert('lalu')
      this.initPlot();//值的改变触发initPlot函数
    }
  }
};
</script>