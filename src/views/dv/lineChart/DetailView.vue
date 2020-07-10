<template>
  <el-dialog
    title="Chart Details"
    :fullscreen="true"
    :close-on-press-escape="false"
    :visible.sync="showChartDetails"
    :close-on-click-modal="false"
    :modal="fale"
    @close="closeDetail"
  >
    <!-- chart card -->
    <el-row>
      <el-col :span="14">
        <el-card :body-style="{padding:'0px'}" style="width:100%">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold;">{{cncStation}} Detail</span>
          </div>
          <div id="chartDetailArea" style="width:100%;height:700px"></div>
        </el-card>
      </el-col>
      <!-- info part -->
      <el-col :span="10">
        <!-- machine tune card -->
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{padding:'2px'}">
              <div slot="header" class="clearfix">
                <span style="font-weight:bold;">Machine Fine Tune</span>
                <el-button
                  type="text"
                  style="float: right;padding: 3px 0"
                  @click="popMachineFineTuneDialog()"
                >Edit Judgement</el-button>
              </div>
              <el-table :data="debugTableData" border style="width: 100%">
                <el-table-column prop="cp" label="Cp"></el-table-column>
                <el-table-column prop="meanDrift" label="Mean-Drift"></el-table-column>
                <el-table-column prop="cpVal" label="Cp-val"></el-table-column>
                <el-table-column prop="meanDriftVal" label="M-D-val"></el-table-column>
                <el-table-column prop="judgement" label="judgement"></el-table-column>
                <el-table-column prop="check" label="Check"></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
        <!-- updated risk suggest card -->
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{padding:'2px'}">
              <div slot="header" class="clearfix">
                <span style="font-weight:bold;">Updated Risk Suggest</span>
                <el-button
                  type="text"
                  style="float: right;padding: 3px 0"
                  @click="popRiskSuggestDialog()"
                >New Record</el-button>
              </div>
              <el-table :data="riskTableDataUpdated" border height="200" style="width: 100%">
                <el-table-column prop="dimPoint" label="DimNo-PointNum"></el-table-column>
                <el-table-column prop="ruleName" label="Rule Name"></el-table-column>
                <el-table-column prop="level" label="Level"></el-table-column>
                <el-table-column prop="check" label="Check"></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
        <!-- Risk Suggest Card -->
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{padding:'2px'}">
              <div slot="header" class="clearfix">
                <span style="font-weight:bold;">Risk Suggest</span>
                <el-button
                  type="text"
                  style="float: right;padding: 3px 0"
                  @click="popRiskSuggestDialog()"
                >New Record</el-button>
              </div>
              <el-table :data="riskTableData" border style="width: 100%" height="300">
                <el-table-column prop="ruleName" label="Rule Name"></el-table-column>
                <el-table-column prop="level" label="Level"></el-table-column>
                <el-table-column prop="dimPoint" label="DimNo-PointNum"></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- new risk record dailog -->
    <el-dialog
      title="New Risk Record"
      :fullscreen="false"
      :modal="false"
      :visible.sync="showRiskInput"
      style="right:0px;"
    >
      <!-- header -->
      <div id="risk-record-input-header-box" style="margin-bottom:4px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <label>DimNO-PointNum</label>
          </el-col>
          <el-col :span="6">
            <label>Rule Name</label>
          </el-col>
          <el-col :span="6">
            <label>Level</label>
          </el-col>
          <el-col :span="6">
            <label>Check</label>
          </el-col>
        </el-row>
      </div>
      <!-- confirmed input item -->

      <div
        v-for="(item, index) in riskInputList"
        :key="'inputlist-' + index"
        style="margin-bottom:8px"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- <label for="dimPoint">{{item.dimPoint}}</label> -->
            <el-input placeholder :value="item.dimPoint" :disabled="true"></el-input>
          </el-col>
          <el-col :span="6">
            <!-- <label for="ruleName">{{item.rule_name}}</label> -->
            <el-input placeholder :value="item.rule_name" :disabled="true"></el-input>
          </el-col>
          <el-col :span="6">
            <!-- <label for="Level">{{item.level}}</label> -->
            <el-input placeholder :value="item.level" :disabled="true"></el-input>
          </el-col>
          <el-col :span="6">
            <!-- <label for="Check">{{item.chk_result}}</label> -->
            <el-input placeholder :value="item.chk_result" :disabled="true"></el-input>
          </el-col>
        </el-row>
      </div>

      <!-- input -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-autocomplete
            clearable
            class="inline-input"
            v-model="riskInput.dimPoint"
            :fetch-suggestions="queryDimPointOptions"
            placeholder="DimNo-PointNum"
            @select="handleSelectDimPoint"
          ></el-autocomplete>
          <span style="color:red;" v-show="showDimPointAlert">Please Input DimNo-PointNum</span>
        </el-col>
        <el-col :span="6">
          <el-select v-model="riskInput.rule_name" clearable placeholder="Rule Name">
            <el-option
              v-for="item in ruleNameOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="Level" v-model="riskInput.level" :disabled="true"></el-input>
        </el-col>
        <el-col :span="6">
          <!-- <el-input v-model="riskInput.chk_result" placeholder="chk_result"></el-input> -->
          <el-select v-model="riskInput.chk_result" clearable placeholder="Check">
            <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- add one more input item, add button -->
      <el-button type="primary" @click="addOneMoreRiskInput()" style="margin-top:8px;">Add</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button style="right:8px" @click="closeRiskSuggestDialog()">Cancel</el-button>
        <el-button
          type="primary"
          style="right:0px;"
          @click="submitRiskSuggestOrMachineFineTune('risk')"
          :loading="submitLoading"
        >{{submitText}}</el-button>
      </div>
    </el-dialog>
    <!-- machine fine tune dailog -->
    <el-dialog
      title="New Machine Fine Tune"
      :fullscreen="false"
      :modal="false"
      :visible.sync="showMachineFineTuneInput"
      style="right:0px;"
    >
      <el-row>
        <el-col :span="4">
          <span style="display:inline;font-weight:bold;">Your Judgement:</span>
        </el-col>
        <el-col :span="5">
          <!-- <el-input v-model="machineFineTuneInput.judgement" placeholder="Judgement"></el-input> -->
          <el-select v-model="machineFineTuneInput.chk_result" clearable placeholder="Judgement">
            <el-option
              v-for="item in machineFineTuneOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button style="right:8px" @click="closeMachineFineTuneDialog()">Cancel</el-button>
        <el-button
          type="primary"
          style="right:0px;"
          @click="submitRiskSuggestOrMachineFineTune('machineFine')"
          :loading="submitLoading"
        >{{submitText}}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import echarts from "echarts";
import * as dvApi from "@/api/ei/dv";
import { MessageBox, Message, Loading } from "element-ui";
import i18n from "@/i18n";
const pointRiskLevelLevels = [
  "ok",
  "ok*",
  "Drawing Alert +",
  "Drawing Alert -",
  "SIP Alert +",
  "SIP Alert -",
  "SIP Reject +",
  "SIP Reject -",
  "Drawing Reject +",
  "Drawing Reject -"
];
const outlierDetectionLevels = [
  "outlier_ok",
  "outlier_potential",
  "outlier_risk"
];
const dispersionDetectionLevels = ["dispersion_ok", "dispersion_risk"];
const samplesDeviationDetectionLevels = [
  "samples_deviation_ok",
  "samples_deviation_risk"
];
export default {
  name: "DetailView",
  props: {
    drawingData: {
      type: Array,
      required: true
    },
    rulesRiskData: {
      type: Object,
      required: true
    },
    rulesRiskDataUpdated: {
      type: Object,
      required: true
    },
    cncStation: {
      type: String,
      required: true
    },
    showChartDetails: {
      type: Boolean,
      required: true
    },
    debugItem: {
      type: Object,
      required: true
    },
    debugItemUpdated: {
      type: Object,
      required: true
    },
    headerId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chartAearDom: Object,
      riskTableData: [],
      riskTableDataUpdated: [],
      debugTableData: [
        {
          cp: "",
          meanDrift: "",
          cpVal: "",
          meanDriftVal: "",
          judgement: "",
          check: ""
        }
      ],
      debugText: "",
      debugColor: "",
      showRiskInput: false,
      showMachineFineTuneInput: false,
      showFineTuneInput: false,
      //人为判断结果上传
      riskInput: {
        rule_name: "",
        level: "",
        dimPoint: "",
        chk_result: "",
        dim_no: "",
        point_num: "",
        header_id: "",
        sam_no: ""
      },
      riskInputList: [],
      machineFineTuneInput: {
        header_id: "",
        rule_name: "debug_judgement",
        sam_no: "",
        chk_result: "",
        point_num: "",
        dim_no: ""
      },
      machineFineTuneOptions: ["ok", "alert", "debug"],
      dimPointOptions: [],
      ruleNameOptions: [
        { label: "Point Risk Level", value: "point_risk_level" },
        { label: "Outlier Detection", value: "outlier_detection" },
        { label: "Dispersion Detection", value: "dispersion_detection" },
        { label: "Samples Deviation Detection", value: "deviation_detection" }
      ],
      levelOptions: [],
      rulesRiskDataFormatAll: [],
      showDimPointAlert: false,
      submitLoading: false,
      submitText: "Submit"
    };
  },
  methods: {
    initPlot() {
      //用的是drawing data, 会随着筛选条件变化
      // console.log(this.cncStation + "-chart");
      let chartDv = document.getElementById("chartDetailArea");
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
        this.dimPointOptions.push({ value: item.dim_no + "-" + item.pointNum }); //保存详情页的点位信息
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
      if (xAxisLen <= 30) {
        zoomEnd = 100;
      } else if (xAxisLen <= 60) {
        zoomEnd = 50;
      } else if (xAxisLen <= 90) {
        zoomEnd = 20;
      }

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
          top: "30px",
          right: "0",
          show: true,
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
            name: "Point Number",
            show: true,
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
    tableCurrentChange() {},
    closeDetail() {
      this.rulesRiskDataFormatAll = [];
      this.$emit("closeDetail");
    },
    formatTableData() {
      //用的是rulesDataAll， 不会随着筛选条件变化
      //risk table
      this.riskTableData = []; //risk suggest table data
      // this.riskTableDataUpdated = []; //risk suggest updated table data, 需要和原始数据对比，不相同的展示
      this.rulesRiskDataFormatAll = []; //用于 input 检索
      let dataAll = this.rulesRiskData;
      //format riskInput form
      this.riskInput.sam_no = this.cncStation;
      this.riskInput.header_id = this.headerId;
      //format machineFine form
      this.machineFineTuneInput.sam_no = this.cncStation;
      this.machineFineTuneInput.header_id = this.headerId;
      for (let ruleNameKey in dataAll) {
        for (let levelKey in dataAll[ruleNameKey]) {
          // console.log(levelKey);
          //筛选出本台cnc的所有数据，并按点位规整
          if (dataAll[ruleNameKey][levelKey][this.cncStation]) {
            dataAll[ruleNameKey][levelKey][this.cncStation].forEach(
              pointItem => {
                this.rulesRiskDataFormatAll.push({
                  ruleName: ruleNameKey,
                  level: levelKey,
                  dimNo: pointItem.dim_no,
                  pointNum: pointItem.point_num,
                  dimNoPointNum: pointItem.dim_no + "-" + pointItem.point_num
                });
              }
            );
          }
          if (
            levelKey == "NaN" ||
            levelKey == "ok" ||
            levelKey == "dispersion_ok" ||
            levelKey == "outlier_ok" ||
            levelKey == "samples_deviation_ok"
          ) {
            //do nothing
          } else if (dataAll[ruleNameKey][levelKey][this.cncStation]) {
            let dimPointListString = "";
            let cnt = 1;
            //筛选出本台cnc的所有数据，并按点位规整
            dataAll[ruleNameKey][levelKey][this.cncStation].forEach(
              pointItem => {
                this.rulesRiskDataFormatAll.push({
                  ruleName: ruleNameKey,
                  level: levelKey,
                  dimNo: pointItem.dim_no,
                  pointNum: pointItem.point_num,
                  dimNoPointNum: pointItem.dim_no + "-" + pointItem.point_num
                });
                //拼凑表格字符串
                if (cnt == 1) {
                  dimPointListString =
                    dimPointListString +
                    "" +
                    pointItem.dim_no +
                    "-" +
                    pointItem.point_num;
                } else {
                  dimPointListString =
                    dimPointListString +
                    ", " +
                    pointItem.dim_no +
                    "-" +
                    pointItem.point_num;
                }
                cnt += 1;
              }
            );
            this.riskTableData.push({
              ruleName: ruleNameKey,
              level: levelKey,
              dimPoint: dimPointListString
            });
          }
        }
      }

      //debug table
      this.debugTableData = [
        {
          cp: "",
          meanDrift: "",
          cpVal: "",
          meanDriftVal: "",
          judgement: "",
          check: ""
        }
      ];
      let debugData = this.debugItem;
      let debugDataUpdated = this.debugItemUpdated;
      if (debugData) {
        this.debugTableData[0].cp = debugData.cp;
        this.debugTableData[0].meanDrift = debugData.mean_drift;
        this.debugTableData[0].cpVal = debugData.cp_val;
        this.debugTableData[0].meanDriftVal = debugData.mean_drift_val;
        this.debugTableData[0].judgement = debugData.calc_debug_judgement;
      }
      if (debugDataUpdated) {
        this.debugTableData[0].check = debugDataUpdated.chk_debug_judgement;
      }
      // if (this.debugItem) {
      //   this.debugTableData.push({
      //     cp: debugData.cp,
      //     meanDrift: debugData.mean_drift,
      //     cpVal: debugData.cp_val,
      //     meanDriftVal: debugData.mean_drift_val,
      //     judgement: debugData.calc_debug_judgement,
      //     check: this.debugItemUpdated.chk_debug_judgement
      //   });
      // }
      // else{
      //   this.debugTableData.push({
      //     cp: '',
      //     meanDrift: '',
      //     cpVal: '',
      //     meanDriftVal: '',
      //     judgement: '',
      //     check:this.debugItemUpdated.chk_debug_judgement
      //   });
      // }
      // console.log(this.rulesRiskDataFormatAll);
      this.formatRiskUpdatedTableData();
    },
    formatRiskUpdatedTableData() {
      if (this.rulesRiskDataFormatAll) {
        //用的是rulesDataAll，不会随着筛选条件变化
        //比对 rulesRiskData 和 rulesRiskDataUpdated，不相同的给予展示
        this.riskTableDataUpdated = []; //每次更新先清空
        let dataAllFormatted = this.rulesRiskDataFormatAll;
        // console.log(dataAllFormatted);
        let dataUpdated = this.rulesRiskDataUpdated;
        let cnc = this.cncStation;
        for (let ruleNameKey in dataUpdated) {
          for (let levelKey in dataUpdated[ruleNameKey]) {
            //先筛选出本台cnc
            if (dataUpdated[ruleNameKey][levelKey][cnc]) {
              //判断更新后的结果和原来的是否相同，不同的给予展示
              let itemUpdatedTemp = dataUpdated[ruleNameKey][levelKey][cnc];
              itemUpdatedTemp.forEach(pointItem => {
                let flag = false;
                let itemFormatTemp = dataAllFormatted.filter(item => {
                  return (
                    item.dimNo == pointItem.dim_no &&
                    item.pointNum == pointItem.point_num
                  );
                })[0];
                // console.log(itemFormatTemp.length);
                //再比较cal_result 和 chk_result 是否相同, 不同是加入riskTableDataUpdated
                if (pointItem.chk_result != itemFormatTemp.level) {
                  this.riskTableDataUpdated.push({
                    dimPoint: pointItem.dim_no + "-" + pointItem.point_num,
                    ruleName: ruleNameKey,
                    level: itemFormatTemp.level,
                    check: pointItem.chk_result
                  });
                }
              });
            }
          }
        }
      }
    },
    popRiskSuggestDialog() {
      this.showRiskInput = true;
    },
    popMachineFineTuneDialog() {
      this.showMachineFineTuneInput = true;
    },
    closeRiskSuggestDialog() {
      this.showRiskInput = false;
    },
    closeMachineFineTuneDialog() {
      this.showMachineFineTuneInput = false;
    },
    clearRiskInput() {
      this.riskInput.rule_name = "";
      this.riskInput.level = "";
      this.riskInput.dimPoint = "";
      this.riskInput.chk_result = "";
      this.dim_no = "";
      this.point_num = "";
    },
    submitRiskSuggestOrMachineFineTune(type) {
      // console.log(this.riskInputList);
      let formData = [];
      if (type == "risk") {
        //正在输入的表单判断是否有空后提交至list
        if (
          this.riskInput.rule_name != "" &&
          this.riskInput.dimPoint != "" &&
          this.riskInput.chk_result != ""
        ) {
          this.addOneMoreRiskInput();
        }
        formData = this.riskInputList;
      } else {
        if (this.machineFineTuneInput.chk_result == "") {
          Message({
            showClose: true,
            message: "Please select your judgement before submit",
            type: "warning",
            duration: 3000
          });
          return;
        } else {
          formData = [this.machineFineTuneInput];
        }
      }
      console.log(formData);
      MessageBox.confirm(
        "Do you want to upload these records",
        i18n.t("core.tips"),
        {
          showClose: false,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "info",
          dangerouslyUseHTMLString: true
        }
      ) //confirm 则上传数据
        .then(() => {
          this.submitLoading = true;
          this.submitText = "Uploading...";
          dvApi
            .pushRiskSuggestOrMachineFineTune(formData)
            .then(data => {
              this.submitLoading = false;
              this.submitText = "Submit";

              if (data.code == 200) {
                if (type == "risk") {
                  //这是risk input 的处理
                  this.clearRiskInput;
                  this.riskInputList = [];
                  this.closeRiskSuggestDialog();
                  this.$emit("rulesUpdated");
                } else {
                  //machine fine tune 的处理
                  this.closeMachineFineTuneDialog();
                  this.debugTableData[0].check = this.machineFineTuneInput.chk_result;
                  this.machineFineTuneInput.chk_result = "";
                  this.$emit("debugUpdated");
                }
                Message({
                  showClose: true,
                  message: data.msg,
                  type: "success",
                  duration: 3000
                });
              } else {
                Message({
                  showClose: true,
                  message: data.msg,
                  type: "error",
                  duration: 3000
                });
              }
            })
            .catch(err => {
              this.submitLoading = false;
              this.submitText = "Submit";
              Message({
                showClose: true,
                message: "Upload Record failed, check error in console",
                type: "error",
                duration: 3000
              });
            });
        });
    },
    addOneMoreRiskInput() {
      // console.log(this.riskInput);
      //添加前检查是否为空
      let errType = "";
      if (this.riskInput.rule_name == "") {
        if (errType == "") {
          errType = "Rule Name";
        } else {
          errType = errType + ", Rule Name";
        }
      }
      if (this.riskInput.dimPoint == "") {
        if (errType == "") {
          errType = "DimNo-PointNum";
        } else {
          errType = errType + ", DimNo-PointNum";
        }
      }
      if (this.riskInput.dimPoint == "") {
        if (errType == "") {
          errType = "Check Result";
        } else {
          errType = errType + ", Check Result";
        }
      }
      if (errType == "") {
        if (this.riskInput.level == "AutoFill") {
          this.riskInput.level = "";
        }
        //深度拷贝，取消关联
        let temp = JSON.stringify(this.riskInput);
        this.riskInputList.push(JSON.parse(temp));
        this.clearRiskInput();
      } else {
        let errMesage = errType + " can't be blank";
        Message({
          showClose: true,
          message: errMesage,
          type: "warning",
          duration: 3000
        });
      }
    },
    submitMachineFineTune() {
      //提交人为判断的Machine Fine Tune表单
    },
    queryDimPointOptions(queryString, cb) {
      var dimPointOptions = this.dimPointOptions;
      var result = queryString
        ? dimPointOptions.filter(item => {
            return (
              item.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
            );
          })
        : dimPointOptions;
      cb(result);
    },
    handleSelectDimPoint(item) {
      console.log(item);
    }
  },
  watch: {
    showChartDetails: function(newval, oldval) {
      // console.log(this.drawingData);
      setTimeout(() => {
        this.initPlot();
        this.formatTableData();
      }, 0);
    },
    "riskInput.rule_name": function(newval, oldval) {
      if (newval) {
        if (newval == "point_risk_level") {
          this.levelOptions = pointRiskLevelLevels;
          // console.log(this.levelOptions);
        } else if (newval == "outlier_detection") {
          this.levelOptions = outlierDetectionLevels;
        } else if (newval == "dispersion_detection") {
          this.levelOptions = dispersionDetectionLevels;
        } else if (newval == "deviation_detection") {
          this.levelOptions = samplesDeviationDetectionLevels;
        } else {
          //nothing else
        }
        //检查dimPoint输入是否为空
        //不空是，用dimPoint和rule_name检索this.rulesRiskDataFormatAll,自动补全level
        if (this.riskInput.dimPoint == "") {
          this.showDimPointAlert = true;
        } else {
          let rule_name = this.riskInput.rule_name;
          // console.log(rule_name);
          // console.log(this.rulesRiskDataFormatAll);
          let dimPoint = this.riskInput.dimPoint;
          let riskItem = this.rulesRiskDataFormatAll.filter(item => {
            return rule_name == item.ruleName && dimPoint == item.dimNoPointNum;
          })[0];
          // console.log(riskItem);
          this.riskInput.level = riskItem.level;
          this.riskInput.dim_no = riskItem.dimNoPointNum.substring(
            0,
            riskItem.dimNoPointNum.indexOf("-")
          );
          let dimNoPointNumTemp = riskItem.dimNoPointNum;
          this.riskInput.point_num = dimNoPointNumTemp.substring(
            dimNoPointNumTemp.indexOf("-") + 1,
            dimNoPointNumTemp.length
          );
          console.log("point_num" + this.riskInput.point_num);
          // console.log(this.riskInput);
        }
      } else {
        this.riskInput.level = "AutoFill";
        this.levelOptions = [];
      }
    },
    "riskInput.dimPoint": function(newval, oldval) {
      if (newval == "") {
        this.riskInput.rule_name = "";
        this.showDimPointAlert = true;
      } else {
        this.showDimPointAlert = false;
        let rule_name = this.riskInput.rule_name;
        // console.log(rule_name);
        // console.log(this.rulesRiskDataFormatAll);
        let dimPoint = this.riskInput.dimPoint;
        let riskItem = this.rulesRiskDataFormatAll.filter(item => {
          return rule_name == item.ruleName && dimPoint == item.dimNoPointNum;
        })[0];
        // console.log(riskItem);
        this.riskInput.level = riskItem.level;
        this.riskInput.dim_no = riskItem.dimNoPointNum.substring(
          0,
          riskItem.dimNoPointNum.indexOf("-")
        );
        this.riskInput.point_num = riskItem.dimNoPointNum.substring(
          riskItem.indexOf("-") + 1,
          riskItem.dimNoPointNum.length
        );
        console.log(this.riskInput.point_num);
      }
      // console.log(this.riskInput);
    },
    debugItemUpdated: function(newval, oldval) {
      if (newval) {
        this.debugTableData[0].check = newval.chk_result;
      }
    },
    rulesRiskDataUpdated: function(newval, oldval) {
      this.formatTableData();
    }
    // debugList: function(newval, oldval) {
    //   newval.forEach(item => {
    //     if (item.cnc_no == this.cncStation) {
    //       this.debugText = item.calc_debug_judgement;
    //       if (this.debugText == "alert") {
    //         this.debugColor = 'rgba(255, 0, 0, 0.527)'
    //       }
    //       if (this.debugText == "debug") {
    //         this.debugColor = 'rgba(255, 255, 0, 0.719)'
    //       }
    //     }
    //   });
    // }
  },
  mounted() {
    this.chartAearDom = document.getElementById("chartDetailArea");
  }
};
</script>