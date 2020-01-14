import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/spu/goods/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/spu/goods/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/spu/goods/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/spu/goods/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/spu/goods/view`,
    method: 'get',
    params: data
  })
}

export function spec(type_id) {
  return request({
    url: `/spu/goods/spec`,
    method: 'get',
    params: {type_id:type_id}
  })
}

export function setLabel(id,data) {
  return request({
    url: `/spu/goods/setlabel`,
    method: 'post',
    params: {id:id},
    data
  })
}
