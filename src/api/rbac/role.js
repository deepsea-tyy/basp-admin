import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/rbac/role/index',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/rbac/role/create',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/rbac/role/update`,
    method: 'post',
    params: { id },
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/rbac/role/delete`,
    params: { id },
    method: 'post'
  })
}

export function viewRole(id) {
  return request({
    url: `/rbac/role/view`,
    params: { id },
    method: 'post'
  })
}

export function assign(id,data) {
  return request({
    url: `/rbac/role/assign`,
    params: { id },
    method: 'post',
    data
  })
}

export function remove(id,data) {
  return request({
    url: `/rbac/role/remove`,
    params: { id },
    method: 'post',
    data
  })
}
