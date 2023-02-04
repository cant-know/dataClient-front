<template>
  <div class="com-box">
    <div class="title" :style="cantStyle">
      <span>{{'▎' + showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="cantStyle">&#xe6eb;</span>
      <div class="select-arr" v-if="showChoice">
        <div class="select-item" v-for="item in selectType" :key="item.key" @click="handleSelect(item.key)" :style="marginStyle">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" id="trend">
    </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器数据
      showChoice: false, // 控制箭头是否展示可选项
      choiceType: 'map', // 显示的数据类型
      titleFontSize: 0 // 标题大小
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
  },
  computed: {
    selectType () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    cantStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize * 0.62 + 'px'
      }
    }
  },
  methods: {
    // 初始化
    initChart () {
      this.chartInstance = this.$echarts.init(document.querySelector('#trend'), 'chalk')
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          // 距离包含坐标轴上的文字
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '15%',
          left: '3%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('trend')
      // console.log(ret)
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 半透明颜色
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明颜色
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: true,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const ledgendArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr,
          boundaryGap: false
        },
        legend: {
          data: ledgendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率适配
    screenAdapter () {
      this.titleFontSize = document.querySelector('#trend').offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect (choiceType) {
      this.choiceType = choiceType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-arr {
    background-color: #222733;
    cursor: pointer;
  }
}

</style>
