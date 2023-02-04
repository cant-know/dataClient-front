<template>
<div class="com-box">
  <div class="com-chart" id="stock"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      // 当前显示页数
      currentPage: 0,
      // 定时器标识
      timerId: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化
    initChart () {
      this.chartInstance = this.$echarts.init(document.querySelector('#stock'), 'chalk')
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: '20px',
          top: '20px'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentPage * 5
      const end = (this.currentPage + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false, // 关闭鼠标移入时的动画效果
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            color: colorArr[index][0],
            formatter: item.name + '\n\n' + item.sales
          },
          data: [
            {
              // name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = document.querySelector('#stock').offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          }
        ]

      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > 1) {
          this.currentPage = 0
        }
        this.updateChart()
      }, 5000)
    }
  }
}
</script>

<style>

</style>
