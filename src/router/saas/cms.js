import Layout from '@/layout'

const cmsRouter = {
  path: '/cms',
  component: Layout,
  redirect: '/',
  alwaysShow: true, // will always show the root menu
  name: 'cms',
  meta: {
    title: 'CMS',
    icon: 'tree-table'
    // roles: ['admin'] // you can set roles in root nav
    // , noCache: true
  },
  children: [{
      path: 'advert',
      name: 'advert-manage',
      component: () => import('@/views/cms/components/layout'),
      meta: { title: 'AdvertManage' },
      children: [{
          path: 'index',
          name: 'advert-index',
          component: () => import('@/views/cms/advert/index'),
          meta: { title: 'AdvertIndex' }
        },
        {
          path: 'position',
          name: 'advert-position',
          component: () => import('@/views/cms/advert/position'),
          meta: { title: 'AdvertPosition' }
        }
      ]
    },
    {
      path: 'article',
      name: 'article-manage',
      component: () => import('@/views/cms/components/layout'),
      meta: { title: 'ArticleManage' },
      children: [{
          path: 'index',
          name: 'article-index',
          component: () => import('@/views/cms/article/index'),
          meta: { title: 'ArticleIndex' }
        },
        {
          path: 'edit',
          name: 'article-edit',
          hidden: true,
          component: () => import('@/views/cms/article/edit'),
          meta: { title: 'ArticleEdit' }
        }
      ]
    },
    {
      path: 'category',
      name: 'category-manage',
      component: () => import('@/views/cms/components/layout'),
      meta: { title: 'CategoryManage' },
      children: [{
        path: 'index',
        name: 'cms-category-index',
        component: () => import('@/views/cms/category/index'),
        meta: { title: 'CategoryIndex' }
      },
      {
        path: 'edit',
        name: 'cms-category-edit',
        hidden: true,
        component: () => import('@/views/cms/category/edit'),
        meta: { title: 'CategoryEdit' }
      }]
    }
  ]
}

export default cmsRouter
