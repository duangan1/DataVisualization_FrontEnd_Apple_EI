<template>
  <div class="filter-container">
    <div class="filter-toolbar">
      <el-row>
        <el-col :span="5" @click="showFieldset = !showFieldset">

          <a class="title" @click="showFieldset = !showFieldset">
            <i :class="showFieldset?'el-icon-arrow-down':'el-icon-arrow-right'" />查询
          </a>
        </el-col>
        <el-col :span="19">
          <div style="text-align: right">
            <slot name="toolbar" />
          </div></el-col>
      </el-row>
    </div>
    <el-collapse-transition>
      <div v-show="showFieldset" class="filter-content">
        <slot />
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      showFieldset: true
    }
  }
}
</script>

