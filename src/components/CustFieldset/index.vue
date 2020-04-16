<template>
  <div v-if="collapsible" class="cust-fieldset" :style="custStyle">
    <a @click="showFieldset = !showFieldset">
      <b :class="showFieldset?'el-icon-arrow-down':'el-icon-arrow-right'" />{{ title }}
    </a>
    <el-collapse-transition>
      <div v-show="showFieldset">
        <slot />
      </div>
    </el-collapse-transition>
  </div>

  <div v-else class="cust-fieldset" :style="custStyle">
    <a>
      {{ title }}
    </a>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    custStyle: {
      type: String,
      default: '',
      required: false
    },
    collapsible: {
      type: Boolean,
      default: true,
      required: false
    },
    collapsed: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      showFieldset: !this.collapsed
    }
  }
}
</script>

