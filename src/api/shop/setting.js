import request from '@/utils/request'

export function getList() {
  return request({
    url: '/shop/setting/index',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `/shop/setting/update`,
    method: 'post',
    data
  })
}