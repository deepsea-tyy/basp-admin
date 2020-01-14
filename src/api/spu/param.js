import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/spu/params/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/spu/params/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/spu/params/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/spu/params/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/spu/params/view`,
    method: 'get',
    params: data
  })
}
