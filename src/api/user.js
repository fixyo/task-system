import axios from '@/libs/api.request'
import {baseUrl} from '@/api/base.js'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password
  }
  return axios.request({
    url: 'http://sc.94rp.com/bzDCP/login',
    data: $qs.stringify(data),
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: baseUrl + '/login/getuser',
    method: 'post',
    data: $qs.stringify(token)
  })
}

export const logout = (token) => {
  return axios.request({
    // url: 'logout',
    url: baseUrl + '/login/removeuser',
    method: 'post',
    data: $qs.stringify(token)
  })
}
