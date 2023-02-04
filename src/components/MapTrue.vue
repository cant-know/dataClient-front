<template>
  <div class="com-box" @dblclick = 'revertMap'>
    <div class="com-chart" id="map">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      allData: null,
      chartInstance: null
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
  methods: {
    // 初始化
    async initChart () {
      this.chartInstance = this.$echarts.init(document.querySelector('#map'), 'chalk')
      // 中国地图的矢量数据
      // http://localhost:8080/static/map/china.JSON
      const ret = await axios.get('http://localhost:8080/static/map/china.JSON')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: '20px',
          top: '20px'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          bottom: '5%',
          left: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        const ret = await axios.get('http://localhost:8080' + provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key, ret.data)
        const provinceOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(provinceOption)
      })
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      // 图例的数据
      const legendArr = this.allData.map((item) => {
        return {
          name: item.name
        }
      })
      // console.log(legendArr)
      // 散点的数据
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          // 在地图中显示散点的数据
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = document.querySelector('#map').offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style>

</style>
