import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/base/region/area',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/base/region/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/base/region/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/base/region/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/base/region/view`,
    method: 'get',
    params: data
  })
}
