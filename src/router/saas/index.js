
/**
 * asyncRoutes 动态路由设置
 * the routes that need to be dynamically loaded based on user roles
 */
import rbacRouter from './rbac'
import spuRouter from './goods'
import baseRouter from './base'
import shopRouter from './shop'
import cmsRouter from './cms'
import promotionRouter from './promotion'
const asyncRoutes = [
  shopRouter,
  spuRouter,
  cmsRouter,
  baseRouter,
  rbacRouter,
  promotionRouter,
]
export default asyncRoutes 