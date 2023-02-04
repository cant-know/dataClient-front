import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from '@/views/TrendPage'
import MapPage from '@/views/MapPage'
import RankPage from '@/views/RankPage'
import HotPage from '@/views/HotPage'
import StockPage from '@/views/StockPage'
import screen from '@/views/ScreenTrue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  },
  {
    path: '/mappage',
    component: MapPage
  },
  {
    path: '/rankpage',
    component: RankPage
  },
  {
    path: '/hotpage',
    component: HotPage
  },
  {
    path: '/stockpage',
    component: StockPage
  },
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: screen
  }
]

const router = new VueRouter({
  routes
})

export default router
