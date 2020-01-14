import request from '@/utils/request'

export function getList() {
  return request({
    url: '/payment/payment/index',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `/payment/payment/update`,
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: `/payment/payment/update`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/payment/payment/view`,
    method: 'get',
    params: data
  })
}