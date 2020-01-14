import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/base/brand/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/base/brand/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/base/brand/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/base/brand/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/base/brand/view`,
    method: 'get',
    params: data
  })
}
