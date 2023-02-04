<template>
  <div class="com-screen">
    <header>
    <div class="com-title">
      <!-- <span>
        <img src="../../public/static/img/logo2.png" id="logo">
      </span> -->
      <span id="qiehuan">
        <!-- <img src="../../public/static/img/qiehuan_dark.png"> -->
      </span>
      <span id="time">
        2023-1-31 0:00:00
      </span>
      <span id="title">电商平台实时监控系统</span>
    </div>
  </header>
  <div class="screen-body">
    <section class="screen-left">
      <div class="left-top" :id="fullScreenStatus.trend ? 'fullscreen' : ''">
        <trend ref="trend"></trend>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
        </div>
        <!-- 销售趋势图表 -->
      </div>
      <div class="left-bottom" :id="fullScreenStatus.seller ? 'fullscreen' : ''">
        <seller ref="seller"></seller>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('seller')" :class="fullScreenStatus.seller ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt'"></span>
        </div>
        <!-- 销售金额图表 -->
      </div>
    </section>
    <section class="screen-middle">
      <div class="middle-top" :id="fullScreenStatus.map1 ? 'fullscreen' : ''">
        <map1 ref="map1"></map1>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('map1')" :class="fullScreenStatus.map1 ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt'"></span>
        </div>
        <!-- 商家分布图表 -->
      </div>
      <div class="middle-bottom" :id="fullScreenStatus.rank ? 'fullscreen' : ''">
        <rank ref="rank"></rank>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('rank')" :class="fullScreenStatus.rank ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt'"></span>
        </div>
        <!-- 地区销量排行图表 -->
      </div>
    </section>
    <section class="screen-right">
      <div class="right-top" :id="fullScreenStatus.hot ? 'fullscreen' : ''">
        <hot ref="hot"></hot>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('hot')" :class="fullScreenStatus.hot ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt'"></span>
        </div>
        <!-- 热销商品占比图表 -->
      </div>
      <div class="right-bottom" :id="fullScreenStatus.stock ? 'fullscreen' : ''">
        <stock ref="stock"></stock>
        <div class="resize">
          <!-- icon-compress-alt -->
          <span @click="changeSize('stock')" :class="fullScreenStatus.stock ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt'"></span>
        </div>
        <!-- 库存销量分析图表 -->
      </div>
    </section>
  </div>
</div>
</template>

<script>
import hot from '@/components/HotTrue.vue'
import map1 from '@/components/MapTrue.vue'
import rank from '@/components/RankTrue.vue'
import seller from '@/components/SellerTrue.vue'
import stock from '@/components/StockTrue.vue'
import trend from '@/components/TrendTrue.vue'
export default {
  data () {
    return {
      fullScreenStatus: {
        hot: false,
        map1: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 数据发生改变，不能立即更新
      // document.querySelector['#chartName'].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handlkeChangeTheme () {
      this.$store.commit('changeTheme')
    }
  },
  components: {
    hot,
    map1,
    rank,
    seller,
    stock,
    trend
  }
}
</script>

<style lang="less" scoped>
// 定义全屏样式
#fullscreen {
  position: absolute;
  left: 0  !important;
  top: 0 !important;
  margin: 0 !important;
  z-index: 100 !important;
  display: fixed !important;
  width: 100% !important;
  height: 100% !important;
}
.com-screen {
  background-color: #161522;
  width: 100%;
  height: 100%;
  .com-title {
  border: 1px solid white;
  height: 3.18875rem;
  #logo {
  padding-left: 2%;
  }
  #qiehuan {
  display: inline-block;
  position: relative;
  margin-left: 85%;
  cursor: pointer;
  margin-top: 1.5rem;
  }
  #time {
  position: relative;
  float: right;
  padding-top: 2%;
  margin-right: 2%;
  color: white;
  }
  #title {
  display: block;
  margin: 0 auto;
  text-align: center;
  line-height: 4.5375rem;
  margin-top: -1.6rem;
  background-color: #161522;
  width: 20%;
  font-size: 1.25rem;
  color: white;
  font-size: 1.5625rem;
  }
  }
  .screen-body {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    .screen-left {
    height: 100%;
    width: 27.6%;
    .left-top {
      position: relative;
      // background-color: #fff;
      height: 53%;
    }
    .left-bottom {
      position: relative;
      // background-color: #fff;
      height: 31%;
      margin-top: 1.5625rem;
    }
  }
    .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    .middle-top {
      width: 100%;
      height: 56%;
      position: relative;
      // background-color: #fff;
    }
    .middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
      // background-color: #fff;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    .right-top {
      height: 46%;
      position: relative;
      // background-color: #fff;
    }
    .right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
      // background-color: #fff;
    }
  }
  }
  .resize {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: white;
  }
}
</style>
