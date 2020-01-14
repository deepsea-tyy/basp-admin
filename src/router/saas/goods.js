import Layout from '@/layout'

const goodsRouter = {
  path: '/spu',
  name: 'spu',
  component: Layout,
  redirect: '#',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'SPU',
    icon: 'tree-table'
  },
  children: [{
      path: 'goods',
      name: 'goods',
      redirect: 'index',
      // alwaysShow: true,
      component: () => import('@/views/spu/components/layout'),
      meta: { title: 'GoodsManage' },
      children: [{
          path: 'index',
          name: 'goods-index',
          component: () => import('@/views/spu/goods/index'),
          meta: { title: 'GoodsIndex' }
        },
        {
          path: 'create',
          name: 'goods-create',
          hidden: true,
          component: () => import('@/views/spu/goods/create'),
          meta: { title: 'GoodsCreate' }
        },
        {
          path: 'update',
          name: 'goods-update',
          hidden: true,
          component: () => import('@/views/spu/goods/update'),
          meta: { title: 'GoodsUpdate' }
        }
      ]
    },
    {
      path: 'type',
      name: 'type',
      component: () => import('@/views/spu/components/layout'),
      meta: { title: 'TypeManage' },
      children: [{
        path: 'index',
        name: 'type-index',
        component: () => import('@/views/spu/type/index'),
        meta: { title: 'TypeIndex' }
      }]
    },
    {
      path: 'category',
      name: 'category',
      meta: { title: 'CategoryManage' },
      component: () => import('@/views/spu/components/layout'),
      children: [{
          path: 'index',
          name: 'spu-category-index',
          component: () => import('@/views/spu/category/index'),
          meta: { title: 'CategoryIndex' }
        },
        {
          path: 'edit',
          name: 'goods-category-edit',
          hidden: true,
          component: () => import('@/views/spu/category/edit'),
          meta: { title: 'CategoryEdit' }
        }
      ]
    },
    {
      path: 'spec',
      name: 'spec',
      component: () => import('@/views/spu/components/layout'),
      meta: {
        title: 'SpecManage'
      },
      children: [{
        path: 'index',
        name: 'spec-index',
        component: () => import('@/views/spu/spec/index'),
        meta: { title: 'SpecIndex' }
      }]
    },
    {
      path: 'parmas',
      name: 'parmas',
      component: () => import('@/views/spu/components/layout'),
      meta: {
        title: 'ParmasManage'
      },
      children: [{
        path: 'index',
        component: () => import('@/views/spu/parmas/index'),
        meta: { title: 'ParmasIndex' }
      }]
    }
  ]
}


export default goodsRouter
