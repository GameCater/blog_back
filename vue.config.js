const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    port: 8090,
    open: true,
    headers: {
      // "Access-Control-Allow-Origin": "*"
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000", // 要访问的接口域名
    //     ws: false, // 是否启用websockets
    //     changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    //     pathRewrite: {
    //         "^/api": "" 
    //         //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
    //     }
    //   },
    // }
  }
})
