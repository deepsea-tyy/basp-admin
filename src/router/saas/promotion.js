
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
        },
        {
          path: 'edit',
          name: 'coupon-edit',
          hidden: true,
          component: () => import('@/views/promotion/coupon/edit'),
          meta: { title: 'CouponEdit' }
        }
      ]
    }/*,
    {
      path: 'edit',
      name: 'edit-manage',
      component: () => import('@/views/promotion/components/layout'),
      meta: { title: 'EditManage' },
      children: [
        {
          path: 'index',
          name: 'edit-index',
          component: () => import('@/views/promotion/coupon/index'),
          meta: { title: 'EditIndex' }
        },
      ]
    }*/
  ]
}

export default promotionRouter
