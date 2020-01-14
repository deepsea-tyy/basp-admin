import request from '@/utils/request'

export function getList() {
  return request({
    url: '/rbac/assignment/index',
    method: 'get'
  })
}

export function view(id) {
  return request({
    url: `/rbac/assignment/view`,
    method: 'get',
    params: { id }
  })
}

export function assign(id,data) {
  return request({
    url: `/rbac/assignment/assign`,
    method: 'post',
    params: { id },
    data
  })
}

export function revoke(id,data) {
  return request({
    url: `/rbac/assignment/revoke`,
    method: 'post',
    params: { id },
    data
  })
}
