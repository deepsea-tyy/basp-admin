import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/base/file/index',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: `/base/file/update`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/base/file/delete`,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: `/base/file/create`,
    method: 'post',
    data
  })
}

export function destoryfile(data) {
  return request({
    url: `/base/file/destoryfile`,
    method: 'post',
    data
  })
}

export function excelExport(data) {
  return request({
    url: `/base/file/export`,
    method: 'post',
    data
  })
}

export function excelImport(data) {
  return request({
    url: `/base/file/import`,
    method: 'post',
    data
  })
}

export function excelField(data) {
  return request({
    url: `/base/file/excelfield`,
    method: 'post',
    data
  })
}
