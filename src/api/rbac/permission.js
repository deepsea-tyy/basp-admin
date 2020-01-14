import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/rbac/permission/index',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/rbac/permission/create',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/rbac/permission/update`,
    method: 'post',
    params: { id },
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/rbac/permission/delete`,
    params: { id },
    method: 'post'
  })
}

export function viewRole(id) {
  return request({
    url: `/rbac/permission/view`,
    params: { id },
    method: 'post'
  })
}

export function assign(id,data) {
  return request({
    url: `/rbac/permission/assign`,
    params: { id },
    method: 'post',
    data
  })
}

export function remove(id,data) {
  return request({
    url: `/rbac/permission/remove`,
    params: { id },
    method: 'post',
    data
  })
}
