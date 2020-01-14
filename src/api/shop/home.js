import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/shop/home/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/shop/home/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/shop/home/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/shop/home/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/shop/home/view`,
    method: 'get',
    params: data
  })
}

export function spec(type_id) {
  return request({
    url: `/shop/home/spec`,
    method: 'get',
    params: { type_id: type_id }
  })
}

export function setLabel(id, data) {
  return request({
    url: `/shop/home/setlabel`,
    method: 'post',
    params: { id: id },
    data
  })
}
