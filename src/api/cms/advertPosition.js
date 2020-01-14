import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/advert-position/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/cms/advert-position/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/cms/advert-position/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/cms/advert-position/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/cms/advert-position/view`,
    method: 'get',
    params: data
  })
}
