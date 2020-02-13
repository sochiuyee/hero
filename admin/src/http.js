import axios from "axios";
import Vue from "vue";
import router from "./router";

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/admin/api"
});

// 设置请求拦截发送token
http.interceptors.request.use(
  function(config) {
    if (localStorage.token) {
      config.headers.Authorization = "Bearer " + localStorage.token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截设置错误处理
http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (err.response.data.message) {
      // 给Vue使用element-ui的提醒
      Vue.prototype.$message({
        type: "error",
        message: err.response.data.message
      });

      if (err.response.status === 401) {
        router.push("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default http;
