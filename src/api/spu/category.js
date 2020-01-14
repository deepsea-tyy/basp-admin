import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/spu/category/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/spu/category/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/spu/category/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/spu/category/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/spu/category/view`,
    method: 'get',
    params: data
  })
}

export function getTree(data) {
  return request({
    url: `/spu/category/tree`,
    method: 'get',
    params: data
  })
}

