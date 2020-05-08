
import Layout from '@/layout'

const shopRouter = {
  path: '/shop',
  component: Layout,
  redirect: '/',
  alwaysShow: true, // will always show the root menu
  name: 'shop',
  meta: {
    title: 'Shop',
    icon: 'tree-table'
    // roles: ['admin'] // you can set roles in root nav
    // , noCache: true
  },
  children: [
    {
      path: 'home',
      name: 'home-manage',
      component: () => import('@/views/shop/components/layout'),
      meta: { title: 'HomeManage' },
      children: [
        {
          path: 'index',
          name: 'home-index',
          component: () => import('@/views/shop/home/index'),
          meta: { title: 'HomeIndex' }
        }
      ]
    },
    {
      path: 'order',
      name: 'order-manage',
      component: () => import('@/views/shop/components/layout'),
      meta: { title: 'OrderManage' },
      children: [
        {
          path: 'index',
          name: 'order-index',
          component: () => import('@/views/shop/order/index'),
          meta: { title: 'OrderIndex' }
        },
        {
          path: 'view',
          name: 'order-view',
          hidden: true,
          component: () => import('@/views/shop/order/view'),
          meta: { title: 'OrderView' }
        }
      ]
    },
    {
      path: 'payment',
      name: 'payment-manage',
      component: () => import('@/views/shop/components/layout'),
      meta: { title: 'PaymentManage' },
      children: [
        {
          path: 'index',
          name: 'payment-index',
          component: () => import('@/views/shop/payment/index'),
          meta: { title: 'PaymentIndex' }
        },
        {
          path: 'edit',
          name: 'payment-edit',
          hidden: true,
          component: () => import('@/views/shop/payment/edit'),
          meta: { title: 'PaymentEdit' }
        }
      ]
    }
  ]
}

export default shopRouter
