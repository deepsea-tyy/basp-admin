import request from '@/utils/request'

export function getList() {
  return request({
    url: '/rbac/menu/index',
    method: 'get'
  })
}

export function update(id,data) {
  return request({
    url: `/rbac/menu/update`,
    method: 'post',
    data,
    params: { id }
  })
}

export function del(id) {
  return request({
    url: `/rbac/menu/delete`,
    method: 'post',
    params: { id }
  })
}

export function add(data) {
  return request({
    url: `/rbac/menu/create`,
    method: 'post',
    data
  })
}
