import axios from "axios";
import Vue from "vue";
import router from "@/router";

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
});

// 配置请求拦截器
http.interceptors.request.use(function (config) {
  // 配置请求头
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
  }
  return config;
}, function (error) {
  // 请求出错时
  return Promise.reject(error);
});

// 配置响应拦截器
http.interceptors.response.use(res => {
  const { code, message } = res.data;
  // if (message?.includes('token')) {
  //   Vue.prototype.$message({
  //     type: 'error',
  //     message: '身份已失效，请重新登录！'
  //   })
  //   localStorage.clear();
  //   router.replace('/login');
  // }

  console.log(res);

  return res;
}, err => {
  // 测试：打印响应错误
  console.log(err);
  // if (err.response.data.message) {
  //   Vue.prototype.$message({
  //     type: 'error',
  //     message: err.response.data.message
  //   })
    
  //   // 401请求者未授权
  //   if (err.response.status === 401) {
  //     // 清理本地缓存
  //     localStorage.clear();
  //     router.replace('/login');
  //   }
  // }
  
  return Promise.reject(err);
});

// 通用方法
http.GET = function (url, params) {
  return this.get(url, { params }).then((res) => res.data);
}

http.POST = function (url, params) {
  return this.post(url, params).then((res) => res.data);
}

http.PUT = function (url, params) {
  return this.put(url, params).then((res) => res.data);
}

http.DELETE = function (url) {
  return this.delete(url).then((res) => res.data);
}

export default http;