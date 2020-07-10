<template>
  <el-card
    :body-style="{padding:'0px'}"
    :class="{'card-base':baseStyle,'card-alert':alertStyle}"
    :ref="cncStation"
  >
    <div slot="header" class="clearfix">
      <span>{{cncStation}}</span>
      <el-button
        style="float: right; padding: 3px 0"
        icon="el-icon-document"
        type="text"
        @click="setShowChartDetailsFlag()"
      >More Details</el-button>
      <span :style="{color:debugColor}" style="margin-left:2em;font-size:20px;font-weight:bold;">{{debugText}}</span>
    </div>
    <div :id="cncStation+'-chart'" class="line-chart" style="height:370px;width:100%;left:0"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
let header_background_color = '';
const alert_background_color = 'rgba(255, 0, 0, 0.527)';
const debug_background_color = 'rgba(255, 255, 0, 0.719)';
export default {
  name: "ChartCard",
  props: {
    drawingData: {
      type: Array,
      required: true
    },
    cncStation: {
      type: String,
      required: true
    },
    alertList: {
      type: Array,
      required: true
    },
    debugList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      baseStyle: true,
      alertStyle: false,
      debugText: "",
      debugColor: '',
    };
  },
  methods: {
    initPlot() {
      // console.log(this.cncStation + "-chart");
      let chartDv = document.getElementById(this.cncStation + "-chart");
      // console.log(chartDv);
      let chart = echarts.init(chartDv);
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

      this.drawingData.forEach(item => {
        // console.log(item);
        xPointNumber.push(item.dim_no + "-" + item.pointNum);
        dev1Val.push(Number(item.dev1));
        dev2Val.push(Number(item.dev2));
        dev3Val.push(Number(item.dev3));
        alertTolPlusVal.push(Number(item.alertTolPlus));
        alertTolMinusVal.push(Number(item.alertTolMinus));
        drawingTolPlusVal.push(Number(item.drawingTolPlus));
        drawingTolMinusVal.push(Number(item.drawingTolMinus));
        nomialVal.push(Number(item.nominalDim));
        sipTolPlusVal.push(Number(item.sipTolPlus));
        sipTolMinusVal.push(Number(item.sipTolPlus));
      });

      //determine dataZoom's end
      let xAxisLen = xPointNumber.length;
      let zoomEnd = 10;
      if (xAxisLen <= 15) {
        zoomEnd = 100;
      } else if (xAxisLen <= 30) {
        zoomEnd = 50;
      } else if (xAxisLen <= 45) {
        zoomEnd = 20;
      }

      // console.log(dev1Val);
      let option = {
        backgroundColor: "rgb(250,250,250)", //'#f3f3f3',
        title: {
          top: 15,
          text: this.cncStation,
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
              color: "#57617B"
            }
          },
          axisLabel: {
            // formatter: "Point Number: {value}"
          }
        },
        legend: {
          top: "10",
          // orient: "vertical",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [
            "Sample 1",
            "Sample 2",
            "Sample 3",
            "Alert - TOL",
            "Alert + TOL",
            "Drawing - TOL",
            "Drawing + TOL",
            "Nominal",
            "SIP - TOL",
            "SIP + TOL"
          ],
          right: "0",
          show: false,
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
            restore: { show: true },
            saveAsImage: { show: true }
            // myTool1: {
            //   show: true,
            //   title: "More Details",
            //   icon:
            //     "path://M512 128q69.675 0 135.51 21.163t115.498 54.997 93.483 74.837 73.685 82.006 51.67 74.837 32.17 54.827L1024 512q-2.347 4.992-6.315 13.483T998.87 560.17t-31.658 51.669-44.331 59.99-56.832 64.34-69.504 60.16-82.347 51.5-94.848 34.687T512 896q-69.675 0-135.51-21.163t-115.498-54.826-93.483-74.326-73.685-81.493-51.67-74.496-32.17-54.997L0 513.707q2.347-4.992 6.315-13.483t18.816-34.816 31.658-51.84 44.331-60.33 56.832-64.683 69.504-60.331 82.347-51.84 94.848-34.816T512 128.085zm0 85.333q-46.677 0-91.648 12.331t-81.152 31.83-70.656 47.146-59.648 54.485-48.853 57.686-37.675 52.821-26.325 43.99q12.33 21.674 26.325 43.52t37.675 52.351 48.853 57.003 59.648 53.845T339.2 767.02t81.152 31.488T512 810.667t91.648-12.331 81.152-31.659 70.656-46.848 59.648-54.186 48.853-57.344 37.675-52.651T927.957 512q-12.33-21.675-26.325-43.648t-37.675-52.65-48.853-57.345-59.648-54.186-70.656-46.848-81.152-31.659T512 213.334zm0 128q70.656 0 120.661 50.006T682.667 512 632.66 632.661 512 682.667 391.339 632.66 341.333 512t50.006-120.661T512 341.333zm0 85.334q-35.328 0-60.33 25.002T426.666 512t25.002 60.33T512 597.334t60.33-25.002T597.334 512t-25.002-60.33T512 426.666z",
            //   onclick: function() {
            //     // that.showChartDetails = true;
            //     // that.currenSelectedChartMachine = chartAreaId;
            //   }
            // }
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
              show: false,
              lineStyle: {
                color: "#57617B"
              }
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: zoomEnd
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
                lineStyle: {
                  type: "dotted"
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
                lineStyle: {
                  type: "dotted"
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
                lineStyle: {
                  type: "dashed"
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
                lineStyle: {
                  type: "dashed"
                }
              }
            },
            data: drawingTolPlusVal
          },
          // {
          //   name: "Nominal",
          //   type: "line",
          //   smooth: false,
          //   symbol: "circle",
          //   symbolSize: 1,
          //   showSymbol: false,
          //   lineStyle: {
          //     normal: {
          //       width: 1
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: "rgb(55,195,64)",
          //       borderColor: "rgb(55,195,64)",
          //       borderWidth: 1,
          //       lineStyle: {
          //         type: "dotted"
          //       }
          //     }
          //   },
          //   data: nomialVal
          // },
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
                lineStyle: {
                  type: "dotted"
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
                lineStyle: {
                  type: "dotted"
                }
              }
            },
            data: sipTolPlusVal
          }
        ]
      };

      chart.setOption(option);
      // console.log("options setted");
    },
    setShowChartDetailsFlag() {
      // console.log("emit showDatial")
      this.$emit("showDetail", this.cncStation);
    }
  }, //methods
  watch: {
    drawingData: function(newval, oldval) {
      this.initPlot();
    },
    alertList: function(newval, oldval) {
      if (newval.indexOf(this.cncStation) != -1) {
        this.alertStyle = true;
        // console.log(this.cncStation + ": alert");
      } else {
        this.alertStyle = false;
      }
    },
    debugList: function(newval, oldval) {
      this.debugText = "";
      newval.forEach(item => {
        if (item.cnc_no == this.cncStation) {
          if(item.calc_debug_judgement){
            this.debugText = item.calc_debug_judgement.replace(/^\S/, s => s.toUpperCase());
          }
          else if(item.chk_debug_judgement){
            this.debugText = item.chk_debug_judgement.replace(/^\S/, s => s.toUpperCase());
          }
          if (this.debugText == "Alert") {
            this.debugColor = 'rgba(255, 0, 0, 0.527)'
          }
          if (this.debugText == "Debug") {
            this.debugColor = 'rgba(255, 255, 0, 0.719)'
          }
        }
        else{
          // this.debugText = "";
        }
      });
    }
  },
  mounted() {
    this.initPlot();
  }
};
</script>

<style lang="scss" scoped>
.card-base {
  margin-right: 8px;
  margin-top: 8px;
}
.card-alert {
  border: 1px solid red !important;
}
</style>