
import Layout from '@/layout'

const rbacRouter = {
    path: '/rbac',
    component: Layout,
    redirect: '#',
    alwaysShow: true, // will always show the root menu
    name: 'rbac',
    meta: {
      title: 'Rbac',
      icon: 'lock',
      // roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        name: 'role-index',
        component: () => import('@/views/rbac/role/index'),
        meta: {title: 'RoleIndex'}
      },
      {
        path: 'role/view',
        name: 'role-view',
        hidden: true,
        component: () => import('@/views/rbac/role/view'),
        meta: {title: 'RoleView'}
      },
      {
        path: 'permission',
        name: 'permission-index',
        component: () => import('@/views/rbac/permission/index'),
        meta: {title: 'PermissionIndex'}
      },
      {
        path: 'permission/view',
        name: 'permission-view',
        hidden: true,
        component: () => import('@/views/rbac/permission/view'),
        meta: {title: 'PermissionView'},
      },
      {
        path: 'route',
        name: 'route-index',
        component: () => import('@/views/rbac/route/index'),
        meta: {title: 'RouteIndex'}
      },
      {
        path: 'rule',
        name: 'rule-index',
        component: () => import('@/views/rbac/rule/index'),
        meta: {title: 'RuleIndex'}
      },
      {
        path: 'assignment',
        name: 'assignment-index',
        component: () => import('@/views/rbac/assignment/index'),
        meta: {title: 'AssignmentIndex'}
      },
      {
        path: 'assignment/view',
        name: 'assignment-view',
        hidden: true,
        component: () => import('@/views/rbac/assignment/view'),
        meta: {title: 'AssignmentView'}
      },
      {
        path: 'menu',
        name: 'menu-index',
        component: () => import('@/views/rbac/menu/index'),
        meta: {title: 'MenuIndex'}
      }
    ]
  }


export default rbacRouter