<template>
<div class="com-box">
  <div class="com-chart" id="rank">
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值，一个页面显示10个
      timerId: null // 控制定时器启动
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 页面加载时主动调用一次
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化
    initChart () {
      this.chartInstance = this.$echarts.init(document.querySelector('#rank'), 'chalk')
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: '20px',
          right: '20px'
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData () {
      const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      this.updateChart()
      this.startInteval()
    },
    // 更新图表
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E2E5'],
        ['#5052EE', '#AB6EE5']
      ]
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      const nameArr = this.allData.map((item) => {
        return item.name
      })
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      let targetColor = null
      const dataOption = {
        xAxis: {
          data: nameArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                if (arg.value > 300) {
                  targetColor = colorArr[0]
                } else if (arg.value > 200) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInteval()
      })
    },
    // 分辨率适配
    screenAdapter () {
      const titleFontSize = document.querySelector('#rank').offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [titleFontSize * 0.5, titleFontSize * 0.5, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInteval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style>

</style>
