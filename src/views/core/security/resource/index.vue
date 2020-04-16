<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="8" class="left" tag="a">
        <el-scrollbar class="user-detail-dialog-wrap" wrap-class="user-detail-dialog-wrap">
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="id"
            :props="treeProps"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            @node-contextmenu="rightClick"
            @node-click="treeClick"
          >
            <span slot-scope="{ node,data }" class="app-tree-icon">
              <svg-icon :icon-class="data.icon" :class="'resource_'+data.type" />
              <span>   {{ node.label }} </span>
            </span>
          </el-tree>
        </el-scrollbar>

        <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li v-show="canAddMenuButton" class="menu__item" @click="menuClick('addButton')">添加按钮</li>
            <li v-show="canAddMenu" class="menu__item" @click="menuClick('addMenu')">添加菜单</li>
            <li class="menu__item" @click="menuClick('addMenu',-1)">添加顶级菜单</li>
            <li v-show="canDelete" class="menu__item" @click="showDeleteConfirm()">删除</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="16" class="center">
        <div v-show="!form.locked" class="filter-container" style="text-align: right;">
          <el-button type="primary" @click="saveForm">保存</el-button>
        </div>
        <el-form
          v-show="form.type=='menu'"
          ref="form"
          :inline="true"
          :model="form"
          label-width="100px"
        >
          <el-form-item label="路径">
            <el-input v-model="form.path" />
          </el-form-item>
          <el-form-item label="默认跳转">
            <el-input v-model="form.redirect" />
          </el-form-item>
          <!-- <el-form-item label="小程序组件">
            <el-input v-model="form.wxComponent" />
          </el-form-item> -->
          <el-form-item label="组件">
            <el-select v-model="form.component" style="width:177px" filterable allow-create default-first-option>
              <el-option label="Layout" value="Layout" />
              <el-option label="core/user/index" value="core/user/index" />
            </el-select>
          </el-form-item>

          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="标签">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="icon">
            <el-input v-model="form.icon" />
          </el-form-item>
          <el-form-item label="隐藏" style="width: 273px;">
            <el-switch v-model="form.hidden" />
          </el-form-item>
          <el-form-item label="关闭缓存" style="width: 273px;">
            <el-switch v-model="form.noCache" />
          </el-form-item>
          <el-form-item label="排序权重">
            <el-input v-model="form.orderNumber" type="number" />
          </el-form-item>

        </el-form>

        <el-form
          v-show="form.type=='menuButton'"
          ref="form"
          :inline="true"
          :model="form"
          label-width="120px"
        >
          <el-form-item label="名称">
            <el-input v-model="form.menuButtonName" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="form.title" />
          </el-form-item>

          <el-form-item label="API URI">
            <el-select
              v-model="form.listApiResources"
              style=" width:490px;"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="queryApi"
              :loading="loading"
            >
              <el-option
                v-for="item in apiOptions"
                :key="item.uri+' '+item.httpMethod"
                :label="item.uri+' '+item.httpMethod"
                :value="item.uri+' '+item.httpMethod"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="icon">
            <el-input v-model="form.icon" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as resoruce from '@/api/core/security/resource'
// import SvgIcon from "@/components/SvgIcon/index.vue"
import {
  showDeleteConfirm,
  showSaveSuccess,
  showsDeleteSuccess,
  showsDeleteCancel
} from '@/utils/messageUtils'

export default {
  name: 'Resource',
  //  components: { SvgIcon },
  data() {
    return {

      treeData: null,
      treeProps: {
        children: 'children',
        label: 'title'
      },
      form: {
        listApiResources: [],
        locked: true
      },

      menuVisible: false,
      loading: false,
      apiOptions: [],
      currentTreeData: null,
      currentTreeNode: null,
      canAddMenu: false,
      canAddMenuButton: false,
      canDelete: false
    }
  },
  created() {
    this.fetchData(1)
  },
  methods: {
    fetchData() {
      // this.listLoading = true;

      resoruce.resourceList({}).then(response => {
        this.treeData = response.data
        // this.listLoading = false;
        // this.totalCount = response.data.totalCount;
      })
    },
    menuClick(action, parentId, c, d) {
      if (action === 'addButton') {
        this.form = {
          type: 'menuButton',
          menuId: this.currentTreeData.menuId,
          listApiResources: []
        }
      } else {
        this.form = {
          type: 'menu',
          parentMenuId: parentId || this.currentTreeData.menuId
        }
      }
    },
    rightClick(event, object, node, element) {
      this.currentTreeData = object
      this.currentTreeNode = node
      this.canAddMenuButton = object.type === 'menu'
      this.canAddMenu = this.canAddMenuButton
      this.canDelete = !object.locked
      this.menuVisible = false
      this.menuVisible = true
      var menu = document.querySelector('#menu')
      menu.style.left = event.clientX + 10 + 'px'
      document.addEventListener('click', this.foo)
      menu.style.top = event.clientY - 15 + 'px'
    },
    foo() {
      this.menuVisible = false
      document.removeEventListener('click', this.foo)
    },
    treeClick(node, data, value) {
      if (node.type === 'menu') {
        node.listApiResources = []
      }

      this.form = node

      this.menuVisible = false
    },
    saveForm() {
      if (this.form.type === 'menuButton') {
        resoruce.menuButtonSave(this.form).then(response => {
          const newChild = response.data
          newChild.name = newChild.menuButtonName || newChild.name
          if (this.currentTreeData) {
            if (!this.currentTreeData.children) {
              this.$set(this.currentTreeData, 'children', [])
            }
            this.form.menuButtonId = newChild.menuButtonId

            this.currentTreeData.children.push(this.form)
          }
          showSaveSuccess()
        })
      } else {
        if (this.form.parentMenuId === -1) {
          delete this.form.parentMenuId
        }
        resoruce.menuSave(this.form).then(response => {
          debugger

          const newChild = response.data
          newChild.name = newChild.menuButtonName
          if (this.currentTreeData) {
            if (!this.currentTreeData.children) {
              this.$set(this.currentTreeData, 'children', [])
            }
            this.form.menuId = newChild.menuId
            if (this.form.parentMenuId) { this.currentTreeData.children.push(this.form) } else this.treeData.push(this.form)
          }
          showSaveSuccess()
        })
      }
    },
    queryApi(query) {
      if (query !== '') {
        this.loading = true
        resoruce.apiList({ key: query }).then(response => {
          this.loading = false
          this.apiOptions = response.data
        })
      } else {
        this.options = []
      }
    },
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      return draggingNode.data.type === 'menu'
    },
    allowDrag(draggingNode) {
      debugger
      return draggingNode.data.type === 'menu'
    },

    showDeleteConfirm() {
      showDeleteConfirm()
        .then(() => {
          resoruce
            .resourceDelete(
              this.currentTreeData.type,
              this.currentTreeData.type === 'menu'
                ? this.currentTreeData.menuId
                : this.currentTreeData.menuButtonId
            )
            .then(response => {
              if (response.data === '1') {
                const parent = this.currentTreeNode.parent
                const children = parent.data.children || parent.data
                const index = children.findIndex(
                  d => d.id === this.currentTreeData.id
                )
                children.splice(index, 1)

                showsDeleteSuccess()
              }
            })
        })
        .catch(() => {
          showsDeleteCancel()
        })
    }
  }
}
</script>

<style   scoped>
.user-detail-dialog-wrap {
       height: calc(100vh - 140px);

}
</style>
