import request from '@/utils/request'

export function getRules() {
  return request({
    url: '/rbac/rule/index',
    method: 'get'
  })
}

export function updateRule(id,data) {
  return request({
    url: `/rbac/rule/update`,
    method: 'post',
    data,
    params: { id }
  })
}

export function deleteRule(id) {
  return request({
    url: `/rbac/rule/delete`,
    method: 'post',
    params: { id }
  })
}

export function addRule(data) {
  return request({
    url: `/rbac/rule/create`,
    method: 'post',
    data
  })
}
