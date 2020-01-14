import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/category/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/cms/category/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/cms/category/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/cms/category/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/cms/category/view`,
    method: 'get',
    params: data
  })
}

export function getTree(data) {
  return request({
    url: `/cms/category/tree`,
    method: 'get',
    params: data
  })
}
