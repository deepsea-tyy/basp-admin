import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/promotion/promotion/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/promotion/promotion/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/promotion/promotion/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/promotion/promotion/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/promotion/promotion/view`,
    method: 'get',
    params: data
  })
}
