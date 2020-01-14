import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/base/label/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/base/label/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/base/label/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/base/label/create`,
    method: 'post',
    data
  })
}
