<template>
  <div class="app-container">
    <div class="filter-container" style="text-align: right">
      <el-button
        v-if="checkButtonPermission(['loopkupTypeCreate'])"
        class="filter-item"
        type="primary"
        size="small"
        :disabled="disableSaveButton"
        @click="handleSave"
      >保存</el-button>

    </div>
    <div>
      <h4>基本信息</h4>
    </div>
    <div>
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :show-message="false"
        :model="editRow"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="列表值" required>
              <el-input v-model="data.lookupTypeCode" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input v-model="data.description" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div><h4>值列表选项</h4></div>
    <div class="filter-container">
      <el-button
        v-if="checkButtonPermission(['loopkupTypeCreate'])"
        class="filter-item"
        style="margin-right: 10px;"

        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        v-if="checkButtonPermission(['loopkupTypeCreate'])"
        class="filter-item"
        icon="el-icon-edit"
        :disabled="disableSaveButton|| currentRow==null"
        @click="handelEditRow"
      >编辑</el-button>
      <el-button
        v-if="checkButtonPermission(['loopkupTypeCreate'])"
        class="filter-item"
        icon="el-icon-delete"
        :disabled="disableSaveButton|| currentRow==null"
        @click="handelDeleteRow"
      >删除</el-button>
    </div>
    <div>
      <el-table
        ref="lookupTable"
        v-loading="listLoading"
        :data="data.lookupCodes"
        border
        fit
        highlight-current-row
        element-loading-text="加载中..."
        @current-change="handleCurrentRowChange"
      > <el-table-column type="expand" fixed="left">
          <template slot-scope="props">
            <div style="padding:10px" class="appList">
              <table width="30%">
                <tr><th>语言</th><th>显示值</th></tr>
                <tr v-for="(item) in props.row.languages" :key="item.meaning">
                  <td>{{ item.languageLabel }}</td>
                  <td>{{ item.meaning }}
                  </td>
                </tr>
              </table>

            </div>
          </template>
        </el-table-column>
        <el-table-column prop="displaySequence" label="序号" width="70" fixed="left" />
        <el-table-column prop="lookupCode" label="编码" width="350" fixed="left" />
        <el-table-column prop="meaning" label="显示值" width="350" fixed="left" />
        <el-table-column prop="description" label="备注" />
        <el-table-column prop="attr1" label="扩展1" />
        <el-table-column prop="attr2" label="扩展2" />
        <el-table-column prop="attr3" label="扩展3" />
        <el-table-column prop="attr4" label="扩展4" />
        <el-table-column prop="attr5" label="扩展5" />
        <el-table-column prop="attr6" label="扩展6" />
        <el-table-column prop="parentLookupType" label="父值列表编码" />
        <el-table-column prop="parentLookupCode" label="父值编码" />
        <el-table-column prop="enabledFlagLabel" label="是否有效" width="80" />

      </el-table>
      <el-pagination
        :page-sizes="[10,20,50,100,300]"
        background
        style="text-align: center; margin-top:10px"
        :page-size="limit"
        layout="total,sizes, prev, pager, next"
        :total="totalCount"

        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="新增值列表" :visible.sync="editDialogVisible" width="70%" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="100px"
        :show-message="false"
        :model="editRow"
        :rules="formRules"
      >
        <el-row>

          <el-col :span="12">
            <el-col :span="12">
              <el-form-item label="序号" prop="displaySequence">
                <el-input v-model="editRow.displaySequence" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否有效" prop="enabledFlag">
                <el-select v-model="editRow.enabledFlag" placeholder="请选择">
                  <el-option
                    v-for="item in lookups.YES_NO"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="编码" prop="lookupCode">
                <el-input v-model="editRow.lookupCode" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="editRow.description" type="textarea" :rows="3" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <custFieldSet title="国际化" cust-style="margin-top: 5px;padding: 20px 10px 10px 10px;" :collapsible="false">
          <el-form
            ref="dataFormTable"
            label-position="right"
            label-width="0"
            :show-message="false"
            :model="editRow"
            :rules="formRules"
          >
            <el-table
              :data="editRow.languages"
              border
              fit
            >
              <el-table-column prop="languageLabel" label="语言" width="200" />
              <el-table-column prop="meaning" label="显示值">
                <template scope="scope">
                  <el-form-item :prop="'languages.' + scope.$index + '.meaning'" :rules="formRules.meaning">
                    <el-input v-model="scope.row.meaning" type="input" placeholder="请输入内容" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </custFieldSet>
        <custFieldSet title="扩展" cust-style="margin-top: 15px;padding: 20px 10px 0px 10px;" :collapsible="true">
          <el-row>
            <el-col :span="12">
              <el-form-item label="扩展1">
                <el-input v-model="editRow.attr1" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展2">
                <el-input v-model="editRow.attr2" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展3">
                <el-input v-model="editRow.attr3" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展4">
                <el-input v-model="editRow.attr4" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展5">
                <el-input v-model="editRow.attr5" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展6">
                <el-input v-model="editRow.attr6" type="input" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>

        </custfieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEditRow()">确认</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as lookupApi from '@/api/core/system/lookup'
import * as messageUtils from '@/utils/messageUtils'
import checkButtonPermission from '@/utils/permission'
import * as lookup from '@/utils/lookup'
import { getLang } from '@/utils/auth'

import { updateTitle } from '@/utils/pageTitle'
// import { lang } from 'moment'
let counter = -1
export default {
  name: 'LookupCode',
  data() {
    return {
      lang: getLang(),
      limit: 10,
      totalCount: 0,
      currentPage: 1,
      lookupTypeId: -1,
      lookupTypeCode: null,
      disableSaveButton: false,
      editDialogVisible: false,
      currentRow: null,
      editRow: {},
      listLoading: true,
      data: {},

      lookups: {
        YES_NO: [],
        LANGUAGE: []
      },
      formRules: {
        displaySequence: { required: true, message: '用户名不能为空', trigger: 'blur' },
        enabledFlag: { required: true, message: '姓名不能为空', trigger: 'blur' },
        lookupCode: { required: true, message: '姓名不能为空', trigger: 'blur' },
        meaning: { required: true, message: '管理类别不能为空', trigger: 'blur' }
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchLookup()
    this.lookupTypeId = id
    this.fetchTypeData(this.lookupTypeId)
  },
  methods: {
    checkButtonPermission,
    fetchLookup() {
      const lookupTypes = ['YES_NO', 'LANGUAGE']
      lookup.queryLookup(lookupTypes).then(value => {
        this.lookups.YES_NO = value['YES_NO']
        this.lookups.LANGUAGE = value['LANGUAGE']
      })
    },
    fetchTypeData(id) {
      lookupApi.queryLookupTypeById(id).then(response => {
        response.data.deleteCodeIds = []
        this.data = response.data
        updateTitle(this, this.$t('route.lookupType') + '-' + this.data.lookupTypeCode)
        this.listLoading = false
      })
    },
    handleCurrentChange(row) {
      this.currentRow = row
    },
    handleFilter() {},
    handleCreate() {
      this.editRow = { lookupTypeId: this.lookupTypeId, languages: [], enabledFlag: 'Y' }

      this.lookups.LANGUAGE.forEach(lang => {
        this.editRow.languages.push({ language: lang.value, languageLabel: lang.label, meaning: '' })
      })
      this.editDialogVisible = true
    },
    handelEditRow() {
      this.editRow = Object.assign({}, this.currentRow)
      this.editDialogVisible = true
    },
    // handleDelete() {
    //   const index = this.data.indexOf(this.currentRow)
    //   this.data.splice(index, 1)
    //   if (this.currentRow.lookupCodeId !== -1) {
    //     this.payload.deleteCodeIds.push(this.currentRow.lookupCodeId)
    //   }
    // },
    saveEditRow() {
      this.$refs['dataFormTable'].validate((tableValid, tableInvalidateMsg) => {
        messageUtils.transTableFormInvalidMsg('国际化', tableInvalidateMsg)
        this.$refs['dataForm'].validate((valid, invalidateMsg) => {
          if (!valid || !tableValid) {
            messageUtils.showFormInvalidateMessage(Object.assign(invalidateMsg, tableInvalidateMsg))
            return
          } else {
            this.editRow.enabledFlagLabel = lookup.getLabel(this.editRow.enabledFlag, this.lookups.YES_NO)

            for (let i = 0; i < this.editRow.languages.length; i++) {
              if (this.editRow.languages[i].language === this.lang) {
                this.editRow.meaning = this.editRow.languages[i].meaning
              }
            }

            if (!this.editRow.lookupCodeId) {
              this.editRow.lookupCodeId = counter--

              this.currentRow = {}
              this.data.lookupCodes.push(this.currentRow)
            }

            for (const pro in this.editRow) {
              this.$set(this.currentRow, pro, this.editRow[pro])
            }
            this.$refs.lookupTable.setCurrentRow(this.currentRow)
            this.editDialogVisible = false
          }
        })
      })
    },
    handelDeleteRow() {
      messageUtils.showDeleteConfirm().then(() => {
        debugger
        const id = this.currentRow.lookupCodeId
        const index = this.data.lookupCodes.indexOf(this.currentRow)
        this.data.lookupCodes.splice(index, 1)
        if (id > 0) {
          this.data.deleteCodeIds.push(id)
        }
        this.currentRow = null
      }).catch(() => {
        messageUtils.showsDeleteCancel()
      })
    },
    handleSave() {
      this.disableSaveButton = true

      lookupApi.updateLookupById(this.lookupTypeId, this.data).then(response => {
        response.data.deleteCodeIds = []
        this.data = response.data
        // this.fetchData(this.lookupTypeId)
        messageUtils.showSaveSuccess()

        // 清除当前lookuptype的缓存
        this.clearLookupCache(this.data.lookupTypeCode)
        this.disableSaveButton = false
      }).catch(() => {
        this.disableSaveButton = false
      })
    },
    handleCurrentRowChange(currentRow) {
      // table删除为空后判断
      if (currentRow == null) {
        return
      }
      this.currentRow = currentRow
    // currentRow.editing = true
    },
    handleCurrentTypeRowChange(currentRow) {
      currentRow.editing = true
    },
    clearLookupCache(lookupTypeCode) {
      sessionStorage.removeItem(lookupTypeCode)
    }
  }
}
</script>
