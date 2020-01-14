import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/advert/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/cms/advert/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/cms/advert/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/cms/advert/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/cms/advert/view`,
    method: 'get',
    params: data
  })
}
