<template>
  <div class="app-container">
    <OptionBar ref="option" @dataChanged="updateData" chartType="hotmap"/>
    <title-of-project
      v-show="showVendorProjectTitle"
      :cellQualProjName="cellQual.projName"
      :cellQualVendorName="cellQual.vendorName"
    />
    <div ref="chartDv" style="width: 100%;height: 1000px">
        <h1>hotmap</h1>
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
      plotDataAll: []
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
      this.cellQual.projName = option.cellQualProjName;
      this.cellQual.vendorName = option.cellqualVenderName;
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
    // getdata(){
    //     // var _this=this
    //     this.$axios({
    //     baseURL: _baseurl,   //重写baseURL
    //     url: 'api_visual_heat_map',
    //     method: 'post',
    //     data: {
    //       header_id: '1',
    //     }
    //   })
    //   .then(response =>{
    //     this.data=response.data
    //     // post 成功，制response.data 为返回的数百据
    //     // console.log(response.data)
    //     // return response.data
    //   })
    //   .catch(error => {
    //     // 请求失度败
    //     console.log(error)
    //   })
    // },

    initPlot() {
      let chartDv = this.$refs.chartDv;
      let echart = echarts.init(chartDv);
      
      // 绘制图表
      // let data={'columns': [1,
      //   2,
      //   3,
      //   4,
      //   5,
      //   6,
      //   7,
      //   8,
      //   9,
      //   10,
      //   11,
      //   12,
      //   13,
      //   14,
      //   15,
      //   16,
      //   17,
      //   18,
      //   19,
      //   20,
      //   21,
      //   22,
      //   23,
      //   24,
      //   25,
      //   26,
      //   27,
      //   28,
      //   29,
      //   30,
      //   31,
      //   32,
      //   33,
      //   34,
      //   35,
      //   36,
      //   37,
      //   38,
      //   39,
      //   40,
      //   41,
      //   42,
      //   43,
      //   44,
      //   45,
      //   46,
      //   47,
      //   48,
      //   49,
      //   50,
      //   51,
      //   52,
      //   53,
      //   54,
      //   55,
      //   56,
      //   57,
      //   58,
      //   59],
      //   'index': ['301', '302', '303'],
      //   'data': [[-4.0,
      //   -4.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   -2.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   -4.0,
      //   -2.0,
      //   2.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   -4.0,
      //   0.0,
      //   -4.0,
      //   0.0,
      //   -2.0,
      //   -2.0,
      //   0.0,
      //   -4.0,
      //   0.0,
      //   0.0,
      //   2.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   0.0,
      //   -2.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   1.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   2.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   -2.0,
      //   -2.0,
      //   0.0],
      //   [4.0,
      //   4.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   -2.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   -4.0,
      //   -2.0,
      //   2.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   -4.0,
      //   -2.0,
      //   0.0,
      //   -4.0,
      //   0.0,
      //   0.0,
      //   2.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   0.0,
      //   -2.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   2.0,
      //   2.0,
      //   1.0,
      //   0.0,
      //   1.0,
      //   -2.0,
      //   1.0,
      //   0.0,
      //   -2.0,
      //   -2.0,
      //   0.0],
      //   [-4.0,
      //   -4.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   -4.0,
      //   -4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   0.0,
      //   0.0,
      //   0.0,
      //   4.0,
      //   -4.0,
      //   4.0,
      //   2.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   -4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   0.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   2.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0,
      //   4.0]]
      // }  

      let mes = window.location;
      let _baseurl = `//${mes.hostname}:${mes.port}`;
      
      // axios({
      //   baseURL: _baseurl,   //重写baseURL
      //   url: 'api_visual_heat_map/',
      //   method: 'post',
      //   data: {
      //     header_id: '1',
      //   }
      // })
      // .then(response =>{
      //   this.plotDataAll=response.data
      //   // post 成功，制response.data 为返回的数百据
      //   // console.log(response.data)
      // })
      // .catch(error => {
      //   // 请求失度败
      //   console.log(error)
      // })
      
      let data=this.plotDataAll
      // console.log(data)
      let xlabel = data.index
      let ylabel = data.columns
      let arr=[]
      for (let x in xlabel){
        for (let y in ylabel){
            arr.push(
                [xlabel[x],ylabel[y].toString(),data.data[x][y]]
                );
        } 
      }
      
      // data.data.map(function (item){
          // console.log(item[4])
      // })

      let option = {
        tooltip: {
            show:true,
            position: 'top',
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
              return 'Risk Level: ' + text + '<br/>CNC: ' + params.name + '&nbsp&nbsp&nbsp&nbspFAI NO: ' + params.data[1];
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