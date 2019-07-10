import Vue from 'vue'

export const defaultListObj = {
  result: [],
  page: 0,
  noMore: false,
  nothing: false,
  loading: false,
  error: null,
  fetched: false,
  total: 0,
  extra: null
}

export const generateFieldName = (func, type, query = {}) => {
  let result = `${func}-${type}`
  Object.keys(query)
    .filter(
      _ =>
        !~['undefined', 'object', 'function'].indexOf(typeof query[_]) &&
        !~['page', 'changing', 'is_up', '__refresh__'].indexOf(_)
    )
    .sort()
    .forEach(key => {
      result += `-${key}-${query[key]}`
    })
  return result
}

export const parseDataUniqueId = (data, changing) => {
  if (!/\./.test(changing)) {
    return data[changing]
  }
  let result = data
  changing.split('.').forEach(key => {
    result = result[key]
  })
  return result
}

export const getDateFromCache = ({ key, now }) => {
  try {
    const expiredAt = localStorage.getItem(`vue-mixin-store-${key}-expired-at`)
    const cacheStr = localStorage.getItem(`vue-mixin-store-${key}`)
    if (!expiredAt || !cacheStr || now - expiredAt > 0) {
      localStorage.removeItem(`vue-mixin-store-${key}`)
      localStorage.removeItem(`vue-mixin-store-${key}-expired-at`)
      return null
    }
    return JSON.parse(cacheStr)
  } catch (e) {
    return null
  }
}

export const setDataToCache = ({ key, value, expiredAt }) => {
  try {
    localStorage.setItem(`vue-mixin-store-${key}`, JSON.stringify(value))
    localStorage.setItem(`vue-mixin-store-${key}-expired-at`, expiredAt)
  } catch (e) {
    // do nothing
  }
}

export const isArray = data =>
  Object.prototype.toString.call(data) === '[object Array]'

export const setReactivityField = (field, key, value, type, insertBefore) => {
  if (field[key]) {
    if (type === 'jump' || !isArray(value)) {
      Vue.set(field, key, value)
    } else {
      field[key] = insertBefore
        ? value.concat(field[key])
        : field[key].concat(value)
    }
  } else {
    Vue.set(field, key, value)
  }
}

export const computeResultLength = data => {
  let result = 0
  if (isArray(data)) {
    result = data.length
  } else {
    Object.keys(data).forEach(key => {
      result += data[key].length
    })
  }
  return result
}
