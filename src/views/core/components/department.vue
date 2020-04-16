<template>
  <div>
    <el-input
      v-model="innerDepartmentName"
      :name="id"
      :disabled="disabled"
      :size="size"
      :clearable="clearable"
      :placeholder="placeholder"
      class="input-with-select"
      @clear="clearInput"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        :disabled="disabled"
        @click="showDepartmentDialog('submit')"
      />

    </el-input>
    <el-dialog
      title="选择部门"
      :close-on-click-modal="false"
      :visible.sync="dialogDepartmentVisible"
      append-to-body
    >
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
      <el-scrollbar class="department-dialog-wrap" wrap-class="department-dialog-wrap">
        <el-tree
          ref="deparTree"
          :data="departTreeData"
          node-key="id"
          :show-checkbox="multiple"
          :props="{
            children: 'children',
            label: 'name'
          }"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :highlight-current="!multiple"
          :filter-node-method="filterNode"
          :current-node-key="currentNodeKey"
          :check-strictly="true"
        />
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepartmentVisible = false">取消</el-button>
        <el-button type="primary" @click="selectDepartment()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as departmentApi from '@/api/core/security/department'

const departTreeDataCache = []
function perLoadData() {
  departmentApi.findAllDataOnly().then(response => {
    response.data.forEach(item => {
      departTreeDataCache.push(item)
    })
    departTreeDataCache.forEach(dt => {
      dt.disabled = true
    })
  })
}
let cacheId = 1
const cacheIdLevelDepart = {}
export function getDepartments(ids) {
  const departments = []
  traceDepartment(departTreeDataCache, departments, ids)
  return departments
}

function traceDepartment(departmentTree, departments, ids) {
  departmentTree.forEach(dpt => {
    ids.forEach(id => {
      if (dpt.id === id) {
        departments.push({ id: dpt.id, name: dpt.name, fullName: dpt.fullName })
      }
    })
    if (dpt.children) {
      traceDepartment(dpt.children, departments, ids)
    }
  })
}

perLoadData()
export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined,
      required: false
    },
    departmentName: {
      type: [String, Number],
      default: undefined,
      required: false
    },
    disabled: { type: Boolean, default: false, required: false },
    multiple: { type: Boolean, default: false, required: false },
    clearable: { type: Boolean, default: false, required: false },
    size: { type: String, default: undefined, required: false },
    showLevel: { type: Number, default: 100, required: false },
    placeholder: { type: String, default: '请选择部门', required: false }
  },
  data() {
    return {
      id: 'departmentId' + (cacheId++),
      filterText: '',
      dialogDepartmentVisible: false,
      innerDepartmentName: '',
      departmentId: 0,
      departTreeData: [],
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      currentNodeKey: ''
    }
  },
  watch: {
    departmentName(val) {
      //   this.innerDepartmentName = val
    },
    value(val) {
      this.restTree(val)
    },
    filterText(val) {
      this.$refs.deparTree.filter(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.departTreeData.length === 0) {
        if (this.showLevel === 100) {
          this.departTreeData = departTreeDataCache
        } else {
          // debugger
          if (cacheIdLevelDepart[this.showLevel]) {
            this.departTreeData = cacheIdLevelDepart[ this.showLevel]
          } else {
            this.departTreeData = []
            this.copyTreeLevel(departTreeDataCache, this.departTreeData, 1, this.showLevel)
            if (this.departTreeData.length > 0) {
              cacheIdLevelDepart[ this.showLevel] = this.departTreeData
            }
          }
        }
      }
      // debugger
      document.getElementsByName(this.id)[0].readOnly = true
      this.restTree(this.value)
    },
    copyTreeLevel(src, des, level, maxLevel) {
      if (level <= maxLevel) {
        src.forEach(node => {
          const tem = Object.assign({}, node)
          des.push(tem)
          if (node.children) {
            tem.children = []
            this.copyTreeLevel(node.children, tem.children, level + 1, maxLevel)
          }
        })
      }
    },
    restTree(val) {
      if (val && typeof val === 'object') {
        if (this.$refs.deparTree) {
          this.$refs.deparTree.setCheckedKeys(this.value)
        } else {
          this.defaultCheckedKeys = this.value
        }
        const tempName = []
        let expandKeys = null
        if (departTreeDataCache.length > 0) {
          expandKeys = [departTreeDataCache[0].id]
        }
        val.forEach(item => {
          const tempExpandKeys = []
          tempName.push(
            this.getDepartmentName(departTreeDataCache, item, tempExpandKeys)
          )
          expandKeys = expandKeys.concat(tempExpandKeys)
        })
        this.innerDepartmentName = tempName.join(',')
        this.defaultExpandedKeys = expandKeys
      } else if (val) {
        //   .setDefaultExpandedKeys()

        const expandKeys = [departTreeDataCache[0].id]

        this.innerDepartmentName = this.getDepartmentName(
          departTreeDataCache,
          val,
          expandKeys
        )
        this.defaultExpandedKeys = expandKeys
        this.currentNodeKey = val
        // this.$refs.deparTree.setCurrentKey(val)
      } else {
        if (this.$refs.deparTree) {
          this.$refs.deparTree.setCheckedKeys([])
        }
        this.defaultCheckedKeys = []
        this.innerDepartmentName = ''
        const first = departTreeDataCache[0]
        this.defaultExpandedKeys = first ? [first.id] : []
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    selectDepartment() {
      if (this.multiple) {
        this.departmentId = this.$refs.deparTree.getCheckedKeys()
        const name = []
        this.departmentId.forEach(item => {
          name.push(this.getDepartmentName(this.departTreeData, item, []))
        })
        this.innerDepartmentName = name.join(',')
      } else {
        this.departmentId = this.$refs.deparTree.getCurrentKey()
        this.innerDepartmentName = this.getDepartmentName(
          this.departTreeData,
          this.departmentId,
          []
        )
      }

      this.$emit('input', this.departmentId)
      this.$emit('change', {
        departmentId: this.departmentId,
        departmentName: this.innerDepartmentName
      })
      this.dialogDepartmentVisible = false
    },
    showDepartmentDialog() {
      this.init()

      this.dialogDepartmentVisible = true
    },
    getDepartmentName(treeData, selectId, expandKeys) {
      for (let i = 0; i < treeData.length; i++) {
        expandKeys.push(treeData[i].id)
        if (treeData[i].id === selectId) {
          treeData[i].icon = 'finish'
          return treeData[i].fullName
        }
        treeData[i].icon = ''
        if (treeData[i].children) {
          const departName = this.getDepartmentName(
            treeData[i].children,
            selectId,
            expandKeys
          )
          if (departName) {
            return departName
          }
        }
        expandKeys.pop()
      }
    },
    clearInput() {
      if (this.multiple) {
        this.$emit('input', [])
      } else {
        this.$emit('input', null)
      }
      // this.restTree(this.value)
    }
  }
}
</script>

<style>
.department-dialog-wrap {
  height: 400px;
}
</style>
