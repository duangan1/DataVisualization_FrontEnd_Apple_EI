   
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
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.project"
            class="filter-item"
            style="width: 99%;"
            multiple
            placeholder="Project"
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
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.vendor"
            class="filter-item"
            style="width: 99%;"
            multiple
            placeholder="Vendor"
          >
            <el-option
              v-for="item in vendorLookup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchConditions.build"
            class="filter-item"
            style="width: 99%;"
            multiple
            placeholder="Build"
          >
            <el-option
              v-for="item in buildLookup"
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
              icon="el-icon-refresh"
              @click="handleReset"
            >{{ $t('core.reset') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="action-container">
      <el-row>
        <el-col :span="18">
          <el-upload
            class="upload-button"
            :action="uploadURL"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProcess"
          >
            <el-button
              type="primary"
              icon="el-icon-upload"
              :loading="uploading"
            >{{ $t('core.upload') }}</el-button>
          </el-upload>
          <el-button
            type="primary"
            icon="el-icon-download"
            :disabled="currentRow.uploadStatus!='Success'"
            @click="handleDownload"
          >{{ $t('core.download') }}</el-button>
          <el-button
            type="primary"
            icon="app-icon-JMP"
            :disabled="currentRow.uploadStatus!='Success' || currentRow.jmpStatus=='Running'"
            @click="generateJMP"
          >{{ $t('ei.cellQual.generateJMP') }}</el-button>
          <el-button
            type="primary"
            icon="app-icon-JMP"
            :disabled="currentRow.jmpStatus!='Success'"
            @click="downloadJMP"
          >{{ $t('ei.cellQual.downloadJMP') }}</el-button>

          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            :disabled="currentRow.uploadStatus!='Success'"
            :loading="createLoading"
            @click="handleCreate"
          >Generate Summary</el-button>
          <el-button class="filter-item" type="primary" @click="paramButton('parameterForm')">Param</el-button>
          <!-- 条件选择区域 end -->
          <el-dialog
            title="Select More Parameters"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
          >
            <el-form
              ref="parameterForm"
              class="form-container"
              :model="tempParameterForm"
              :show-message="true"
              label-width="120px"
              :rules="rules"
            >
              <!-- 如果show-message为false，则callback将不显示 -->
              <el-row :span="16" label-position="top">Point Risk Judgement Parameters</el-row>
              <el-row :gutter="20" style="padding:10px;">
                <el-col :span="8">
                  <el-form-item label="Risk level" prop="risk_level_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.risk_level_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Outlier risk" prop="outlier_risk_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.outlier_risk_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="Outlier potential"
                    prop="outlier_potential_val"
                    label-width="130px"
                  >
                    <el-input
                      v-model="tempParameterForm.outlier_potential_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="padding:10px;">
                <el-col :span="8">
                  <el-form-item label="Dispersity" prop="dispersity_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.dispersity_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Deviation" prop="deviation_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.deviation_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="16">Dim Risk Judgement Parameters</el-row>
              <el-row :gutter="20" style="padding:10px;">
                <el-col :span="8">
                  <el-form-item
                    label="Dim dispersity"
                    prop="dim_dispersity_val"
                    label-width="130px"
                  >
                    <el-input
                      v-model="tempParameterForm.dim_dispersity_val"
                      prop="dim_dispersity_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Dim outlier" prop="dim_outlier_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.dim_outlier_val"
                      prop="dim_outlier_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Dim deviation" prop="dim_deviation_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.dim_deviation_val"
                      prop="dim_deviation_val"
                      class="filter-item"
                      style="width: 99%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="16">Machine Fine Tune Parameters</el-row>
              <el-row :gutter="20" style="padding:10px;">
                <el-col :span="8">
                  <el-form-item label="Cp value" prop="cp_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.cp_val"
                      prop="cp_val"
                      class="filter-item"
                      style="width: 99%;"
                      placeholder="Cp value"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Mean drift value" prop="mean_drift_val" label-width="130px">
                    <el-input
                      v-model="tempParameterForm.mean_drift_val"
                      prop="mean_drift_val"
                      class="filter-item"
                      style="width: 99%;"
                      placeholder="Mean drift value"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="restoreDefault()">Restore Default</el-button>
              <el-button @click="cancel()">Cancel</el-button>
              <!-- 修改多选响应逻辑 -->
              <el-button
                type="primary"
                v-loading.fullscreen.lock="processLoading"
                element-loading-text="Loading..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @click="submit('parameterForm')"
              >Confirm</el-button>
              <!-- @click="dialogVisible = false" -->
            </div>
          </el-dialog>
          <!-- Select More Dialog end -->
          <el-button
            class="filter-item"
            type="primary"
            :disabled="currentRow.uploadStatus!='Success'"
            @click="doCalculate()"
            :loading="calculateLoading"
          >{{calculateStatus}}</el-button>
        </el-col>

        <el-col :span="6">{{ uploadMessage }}</el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
      @current-change="tableCurrentChange"
    >
      <el-table-column sortable prop="headerId" width="50" label="ID" />
      <el-table-column :label="$t('ei.cellQual.title')" width="350">
        <template
          scope="scope"
        >{{ scope.row.uploadFileName?scope.row.uploadFileName:scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="project" :label="$t('ei.cellQual.project')" />
      <el-table-column prop="build" :label="$t('ei.cellQual.build')" />
      <el-table-column prop="partNo" :label="$t('ei.cellQual.partNo')" width="90" />
      <el-table-column prop="partVersion" :label="$t('ei.cellQual.partVersion')" width="100" />
      <el-table-column prop="vendor" :label="$t('ei.cellQual.vendor')" />
      <el-table-column prop="cncSatation" :label="$t('ei.cellQual.cncSatation')" width="90" />
      <el-table-column prop="dataRound" :label="$t('ei.cellQual.dataRound')" />
      <el-table-column
        prop="updatedAt"
        :label="$t('ei.cellQual.updatedAt')"
        width="140"
        :formatter="tableDateTimeFormat"
      />
      <el-table-column prop="uploadStatus" :label="$t('ei.cellQual.uploadStatus')" width="100" />
      <el-table-column prop="jmpStatus" :label="$t('ei.cellQual.jmpStatus')" width="80" />
      <el-table-column
        prop="message"
        :label="$t('ei.cellQual.message')"
        width="100/>
    </el-table>
    <el-pagination
      v-if="
        table-data-
        :page-sizes="[10,20,50,100,300,400]"
        :page-size="limit"
        background
        style="text-align: center; margin-top:10px"
        layout="total,sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-table>
  </div>
</template>

<script>
const initialSearchConditions = {
  title: "",
  project: "",
  vendor: "",
  build: "",
  partNo: ""
};
import * as dvApi from "@/api/ei/dv";
import * as lookup from "@/utils/lookup";
import * as messageUtils from "@/utils/messageUtils";
import { MessageBox, Message, Loading } from "element-ui";
import * as cellQualDataApi from "@/api/ei/cellQualData";
import * as formatApi from "@/utils/formatUtils";
import * as requestApi from "@/utils/request";
import * as summaryApi from "@/api/ei/dimSummaryApi";
import i18n from "@/i18n";
import { notify } from "@/utils/webSocketUtils";
import { showSaveSuccess } from "@/utils/messageUtils";
export default {
  data() {
    return {
      createLoading: false,
      dialogVisible: false,
      searchConditions: { ...initialSearchConditions },
      uploadURL: requestApi.baseURL + "/ei/cellQualData/upload",
      uploading: false,
      tableData: [],
      currentRow: { status: "", uploadStatus: "" },
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      filter: "",
      partLookup: [],
      buildLookup: [],
      projectLookup: [],
      vendorLookup: [],
      uploadMessage: "",
      parameterForm: {
        risk_level_val: 0.3,
        outlier_risk_val: 0.7,
        outlier_potential_val: 0.5,
        dispersity_val: 0.25,
        deviation_val: 0.25,
        cp_val: 1,
        mean_drift_val: 0.5,
        dim_dispersity_val: 0.3,
        dim_deviation_val: 0.3,
        dim_outlier_val: 0.3
      }, //默认的阈值
      tempParameterForm: {
        risk_level_val: 0.3,
        outlier_risk_val: 0.7,
        outlier_potential_val: 0.5,
        dispersity_val: 0.25,
        deviation_val: 0.25,
        cp_val: 1,
        mean_drift_val: 0.5,
        dim_dispersity_val: 0.3,
        dim_deviation_val: 0.3,
        dim_outlier_val: 0.3
      },
      lastParameterForm: {},
      rules: {
        risk_level_val: [{ validator: this.limit0to1, trigger: "blur" }],
        outlier_risk_val: [{ validator: this.limit0to1, trigger: "blur" }],
        outlier_potential_val: [{ validator: this.limit0to1, trigger: "blur" }],
        deviation_val: [{ validator: this.limit0to1, trigger: "blur" }],
        dim_dispersity_val: [{ validator: this.limit0to1, trigger: "blur" }],
        dim_outlier_val: [{ validator: this.limit0to1, trigger: "blur" }],
        dim_deviation_val: [{ validator: this.limit0to1, trigger: "blur" }],
        cp_val: [{ validator: this.limit0to1, trigger: "blur" }],
        mean_drift_val: [{ validator: this.limit0to1, trigger: "blur" }],
        dispersity_val: [{ validator: this.limit0to1, trigger: "blur" }]
      },
      calculateStatus: "Calculate",
      calculateLoading: false
    };
  },
  mounted() {
    this.handleFilter();
    this.loadData();
    this.fetchLookup();
    notify("uploadCellQualProcess", this.notifyCallback);
  },
  methods: {
    paramButton(formName) {
      this.dialogVisible = true;
      this.lastParameterForm = JSON.parse(
        JSON.stringify(this.tempParameterForm)
      );
      this.$refs[formName].validate();
      console.log(this.lastParameterForm);
    },
    restoreDefault() {
      this.tempParameterForm = JSON.parse(JSON.stringify(this.parameterForm));
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          // 验证不通过禁止提交
          console.log("验证不通过");
          return false;
        } else {
          console.log("验证通过");
          dvApi
            .postCustomParam(this.tempParameterForm)
            .then(res => {
              if (res.msg == "Parameters have been updated") {
                alert(res.msg);
                this.dialogVisible = false;
              } else {
                alert(res.msg);
              }
              // console.log(res.msg)
            })
            .catch(err => {
              //暂时用alert
              alert(err.msg);
            });
        }
      });
    },
    cancel() {
      // console.log(this.lastParameterForm)
      this.tempParameterForm = JSON.parse(
        JSON.stringify(this.lastParameterForm)
      );
      // console.log(origin)
      this.dialogVisible = false;
    },
    limit0to1(rule, value, callback) {
      const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/; //正则表达式：数字4位小数

      // console.log(value)
      if (!value) {
        return callback(new Error("请输入阈值"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("格式不正确,请输入最多4位小数的非负数"));
        }
      }
      callback();
    },
    tableDateTimeFormat: formatApi.tableDateTimeFormat,
    notifyCallback(msg) {
      this.uploadMessage = msg.message;
      if (
        msg.message.startsWith("Success") ||
        msg.message.startsWith("Error")
      ) {
        this.loadData();
      }
      // this.uploadMessage =
      //  if (this.loading) { this.loading.setText(msg.message) }
      // console.log(msg.data)
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleCreate() {
      console.log("handleCreate...");
      this.createLoading = true;
      summaryApi
        .createSummary(this.currentRow.headerId)
        .then(response => {
          showSaveSuccess();
          this.createLoading = false;
        })
        .catch(() => {
          this.createLoading = false;
        });
    },
    handleSearch() {
      this.handleFilter();
      this.loadData();
    },
    loadData() {
      // debugger
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
        });
    },
    fetchLookup() {
      const lookupTypes = ["EI_BUILD"];
      lookup.queryLookup(lookupTypes).then(value => {
        this.buildLookup = value["EI_BUILD"];
      });
      lookup.queryDynamicLookup(["vendor", "project", "part"]).then(value => {
        this.vendorLookup = value.vendor;
        this.projectLookup = value.project;
        this.partLookup = value.part;
      });
    },
    tableCurrentChange(row) {
      this.currentRow = Object.assign({ status: "" }, row);
    },
    handleBeforeUpload() {
      messageUtils.showsSuccessMessage(
        "Uploading is in background,Pelase wait."
      );
      setTimeout(() => {
        this.loadData();
      }, 2000);
      return true;
    },
    handleUploadSuccess(response) {
      if (response.code !== 20000) {
        messageUtils.showsErrorMessage(response.message);
      } else {
        messageUtils.showUploadSuccess();
      }
      this.loadData();
    },
    handleUploadError() {
      this.uploading = false;
    },
    handleProcess(a, b, c, d) {
      debugger;
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
    handleDownload() {
      document.location.href =
        requestApi.baseURL +
        "/ei/cellQualData/download/" +
        this.currentRow.headerId;
    },
    generateJMP() {
      messageUtils
        .showConfirm(this.$t("ei.cellQual.generateJMPConfirm"))
        .then(() => {
          cellQualDataApi.generateJMP(this.currentRow.headerId).then(() => {
            setTimeout(() => {
              this.loadData();
            }, 2000);
          });
        });
    },
    downloadJMP() {
      document.location.href =
        requestApi.baseURL +
        "/ei/cellQualData/downloadJMP/" +
        this.currentRow.headerId;
    },
    handleFilter() {
      this.filter = "";
      if (this.searchConditions.title !== "") {
        this.filter =
          this.filter + ",t.title CONTAIN " + this.searchConditions.title;
      }
      if (this.searchConditions.project !== "") {
        this.filter =
          this.filter +
          ",t.projectId in " +
          this.searchConditions.project.join(" ");
      }
      if (this.searchConditions.vendor !== "") {
        this.filter =
          this.filter +
          ",t.vendorId in " +
          this.searchConditions.vendor.join(" ");
      }
      if (this.searchConditions.build !== "") {
        this.filter =
          this.filter + ",t.build in " + this.searchConditions.build.join(" ");
      }
      if (this.searchConditions.partNo !== "") {
        this.filter =
          this.filter + ",t.partNo CONTAIN " + this.searchConditions.partNo;
      }
    },
    handleReset() {
      this.searchConditions = { ...initialSearchConditions };
      this.filter = "";
      this.loadData();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.loadData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadData();
    },
    popupMoreSearch() {
      this.showMoreSelectionPopup = true;
      this.fillMoreSearchOptions();
    },
    closeMoreSelectionForm() {
      this.showMoreSelectionPopup = false;
    },
    fillMoreSearchOptions() {
      // // test data, only fill up dimNoLookup
      // let data = this.totalData;
      // // console.log(data);
      // for (var item of data) {
      //   if (this.chartType == "boxplot") {
      //     this.dimNoLookup.push(item["dim-point"]);
      //   } else if (this.chartType == "histogram") {
      //     this.dimNoLookup.push(item.dim_no);
      //   }
      // }
    },
    changedDrawingData() {
      //不再多拷贝一份数据，只在父组件中通过searchCondition去筛选画图的数据
      this.popDataChangedEvent("SM");
      this.showMoreSelectionPopup = false;
    },
    doCalculate() {
      let paramTemp = {
        header_id: this.currentRow.headerId,
        // header_id: 1
      };
      let type1 = "dispersity";
      let type2 = "outlier";
      let type3 = "debug_judgement";
      let type4 = "deviation_detection";
      let type5 = "point_risk_level";
      MessageBox.confirm(
        "Do you want to calculate the selected item?",
        i18n.t("core.tips"),
        {
          showClose: false,
          confirmButtonText: "Calculate",
          cancelButtonText: "Cancel",
          type: "info",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.calculateLoading = true;
          this.calculateStatus = "Calculating point risk level...";
          //point risk level calculation
          dvApi
            .doRuleCalculate(type5, paramTemp)
            .then(data => {
              if (data.code == 200) {
                Message({
                  showClose: true,
                  message: data.msg,
                  type: "success",
                  duration: 0
                });
                //算完point risk level 后才能算其他的
                /* **************************** */
                //debug judgement 3
                this.calculateStatus = "Calculating Debug Judgement...";
                dvApi
                  .doRuleCalculate(type3, paramTemp)
                  .then(data => {
                    if (data.code == 200) {
                      Message({
                        showClose: true,
                        message: data.msg,
                        type: "success",
                        duration: 0
                      });
                    } else {
                      Message({
                        showClose: true,
                        message: data.msg,
                        type: "error",
                        duration: 0
                      });
                    }
                    //算完了debug，请求算outlier
                    //outlier calculation 2
                    this.calculateStatus = "Calculating Outlier...";
                    dvApi
                      .doRuleCalculate(type2, paramTemp)
                      .then(data => {
                        if (data.code == 200) {
                          Message({
                            showClose: true,
                            message: data.msg,
                            type: "success",
                            duration: 0
                          });
                        } else {
                          Message({
                            showClose: true,
                            message: data.msg,
                            type: "error",
                            duration: 0
                          });
                        }
                        //算完了outlier，请求算deviation_detection
                        //deviation calculate 4
                        this.calculateStatus = "Calculating Deviation...";
                        dvApi
                          .doRuleCalculate(type4, paramTemp)
                          .then(data => {
                            if (data.code == 200) {
                              Message({
                                showClose: true,
                                message: data.msg,
                                type: "success",
                                duration: 0
                              });
                            } else {
                              Message({
                                showClose: true,
                                message: data.msg,
                                type: "error",
                                duration: 0
                              });
                            }

                            //算完了deviation detection，最后算dispersity
                            this.calculateStatus = "Calculating dispersity...";
                            dvApi
                              .doRuleCalculate(type1, paramTemp)
                              .then(data => {
                                if (data.code == 200) {
                                  Message({
                                    showClose: true,
                                    message: data.msg,
                                    type: "success",
                                    duration: 0
                                  });
                                } else {
                                  Message({
                                    showClose: true,
                                    message: data.msg,
                                    type: "error",
                                    duration: 0
                                  });
                                }
                              })
                              .catch(err => {
                                Message({
                                  showClose: true,
                                  message:
                                    "rule dispersity failed to be created" + err,
                                })
                              });

                            this.calculateLoading = false;
                            this.calculateStatus = "Calculate";
                          })
                          .catch(err => {
                            Message({
                              showClose: true,
                              message:
                                "rule deviation failed to be created" + err.msg,
                              type: "error",
                              duration: 0
                            });
                            this.calculateLoading = false;
                            this.calculateStatus = "Calculate";
                          });
                      })
                      .catch(err => {
                        Message({
                          showClose: true,
                          message:
                            "rule outlier failed to be created" + err.msg,
                          type: "error",
                          duration: 0
                        });
                      });
                  })
                  .catch(err => {
                    Message({
                      showClose: true,
                      message:
                        "rule debug judgement failed to be created" + err.msg,
                      type: "error",
                      duration: 0
                    });
                  });
              } else {
                Message({
                  showClose: true,
                  message: data.msg,
                  type: "error",
                  duration: 0
                });
                this.calculateLoading = false;
                this.calculateStatus = "Calculate";
              }
            })
            .catch(err => {
              Message({
                showClose: true,
                message: "rule risk level failed to be created" + err.msg,
                type: "error",
                duration: 0
              });
              this.calculateLoading = false;
              this.calculateStatus = "Calculate";
            });
        })
        .catch(() => {
          //messageBox catch: do nothing
        });
    }
  }
};
</script>
