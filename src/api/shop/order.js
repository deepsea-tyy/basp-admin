import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/order/order/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/order/order/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/order/order/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/order/order/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/order/order/view`,
    method: 'get',
    params: data
  })
}

export function spec(type_id) {
  return request({
    url: `/order/order/spec`,
    method: 'get',
    params: { type_id: type_id }
  })
}

export function setLabel(id, data) {
  return request({
    url: `/order/order/setlabel`,
    method: 'post',
    params: { id: id },
    data
  })
}
