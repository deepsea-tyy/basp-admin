
import Layout from '@/layout'

const promotionRouter = {
  path: '/promotion',
  component: Layout,
  redirect: '/',
  alwaysShow: true,
  name: 'Promotion',
  meta: {
    title: 'Promotion',
    icon: 'tree-table'
  },
  children: [
    {
      path: 'coupon',
      name: 'coupon-manage',
      component: () => import('@/views/promotion/components/layout'),
      meta: { title: 'CouponManage' },
      children: [
        {
          path: 'index',
          name: 'coupon-index',
          component: () => import('@/views/promotion/coupon/index'),
          meta: { title: 'CouponIndex' }
        }
      ]
    },
    {
      path: 'promotion',
      name: 'promotion-manage',
      component: () => import('@/views/promotion/components/layout'),
      meta: { title: 'PromotionManage' },
      children: [
        {
          path: 'edit',
          name: 'promotion-index',
          component: () => import('@/views/promotion/promotion/index'),
          meta: { title: 'PromotionIndex' }
        }
      ]
    }
  ]
}

export default promotionRouter
