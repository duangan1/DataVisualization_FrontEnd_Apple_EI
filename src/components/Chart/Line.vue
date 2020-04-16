
<template>
  <e-charts ref="line" :options="options" :init-options="initOptions" autoresize />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  components: { ECharts },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const names = this.data.map(item => item.name)
    const values = this.data.map(item => item.value)

    return {
      options: {
        title: {
          text: this.title,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: names
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: values,
            type: 'line'
          }
        ]
      },
      initOptions: {
        renderer: 'canvas'
      }
    }
  }
}
</script>
