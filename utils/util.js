const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (date, separator = '/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(separator);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const endpoint = {
  apiDomain: 'your host/api', 
  login: "/auth/login",
  getFreeNum : "/freeRecords/getFreeNum",
  getTotalParseNum: "/records/total",
  parseVideo: "/video-parse",
  decreaseFreeNum: "/freeRecords/decreaseFreeNum",
  increaseFreeNum: "/freeRecords/increaseFreeNum",
  updateUser: "/user/updateUser",
  getUser: "/user/getUser"
}

const shareImage = "/images/share_image.png"

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  endpoint: endpoint,
  shareImage: shareImage
}
