import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/spu/spec/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/spu/spec/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/spu/spec/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/spu/spec/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/spu/spec/view`,
    method: 'get',
    params: data
  })
}
