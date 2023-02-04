<!-- 商家销量统计横向柱状图 -->
<template>
  <div class="com-box">
    <div class="com-chart" id="chart"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      // 从服务器获取的数据
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timer1: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timer1)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echart实例对象
    initChart () {
      this.chartInstance = this.$echarts.init(document.querySelector('#chart'), 'chalk')
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer1)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
      const initOption = {
        title: {
          text: '▎商家销售统计'
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          // 距离包含坐标轴上的文字
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow',
            z: 0,
            shadowStyle: {
              opacity: 0.5
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              fontStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      // 数据排序
      this.allData.sort((a, b) => {
        return a.value - b.value // 从小到大
        // return b.value - a.value // 从大到小
      })
      // 计算总页数
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 开始定时器
    startInterval () {
      if (this.timer1) {
        clearInterval(this.timer1)
      }
      this.timer1 = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 分辨率适配
    screenAdapter () {
      const titleFontSize = document.querySelector('#chart').offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          },
          left: '20px',
          top: '20px'
        },
        // tooltip: {
        //   axisPointer: {
        //     lineStyle: {
        //       width: titleFontSize * 0.5
        //     }
        //   }
        // },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize * 0.5, titleFontSize * 0.5, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 一定要手动调用resize()
      this.chartInstance.resize()
    }
  }
}
</script>

<style>

</style>
