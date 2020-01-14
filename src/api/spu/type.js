import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/spu/type/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/spu/type/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/spu/type/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/spu/type/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/spu/type/view`,
    method: 'get',
    params: data
  })
}
