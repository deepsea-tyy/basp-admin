import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/article/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/cms/article/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/cms/article/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/cms/article/create`,
    method: 'post',
    data
  })
}

export function view(data) {
  return request({
    url: `/cms/article/view`,
    method: 'get',
    params: data
  })
}

export function setLabel(id,data) {
  return request({
    url: `/cms/article/setlabel`,
    method: 'post',
    params: {id:id},
    data
  })
}
