
<template>
  <e-charts id="chart" ref="bar" :options="options" :init-options="initOptions" autoresize />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {},
        yAxis: {
          type: 'category',
          data: names,
          axisTick: {
            alignWithLabel: true
          }
        },
        grid: {
          left: '10',
          containLabel: true
        },
        series: [
          {
            name: this.title,
            type: 'bar',
            barWidth: '60%',
            data: values
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
