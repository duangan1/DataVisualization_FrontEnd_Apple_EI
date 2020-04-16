<template>
  <e-charts ref="pie" :options="options" :init-options="initOptions" autoresize />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  components: { ECharts },
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: undefined
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // console.log(this.data || [])

    return {
      options: {
        title: {
          text: this.title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            data: this.data || [],
            radius: '40%',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
