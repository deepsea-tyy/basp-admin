import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/rbac/route/index',
    method: 'get'
  })
}

export function assign(data) {
  return request({
    url: `/rbac/route/assign`,
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: `/rbac/route/remove`,
    method: 'post',
    data
  })
}

export function addRoute(data) {
  return request({
    url: `/rbac/route/create`,
    method: 'post',
    data
  })
}
