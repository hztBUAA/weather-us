import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const CSRFKey = 'X-CSRFToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCSRFToken() {
  return Cookies.get(CSRFKey)
}

export function setCSRFToken(CSRFToken) {
  return Cookies.set(CSRFToken, CSRFToken, { expires: 1 })
}

export function removeCSRFToken() {
  return Cookies.remove(CSRFKey)
}
