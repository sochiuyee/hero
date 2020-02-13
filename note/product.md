> 生成环境编译
* 将admin的文件打包：npm run build

* 不依赖任何生产环境的情况下：dist是vue cli3打包完的dist文件夹
```shell
npm i -g serve

cd admin

serve dist
```

### 在编译打包后，放在服务器上访问时，遇到axios实例的baseURL: 'http://localhost:3000/admin/api',无法访问本地的localhost:3000

1. 需要根据生产环境和开发环境配置不同的baseURL  

[vue cli 环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E5%9C%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%BE%A7%E4%BB%A3%E7%A0%81%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

* 只有以 `VUE_APP_ 开头`的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。 

[环境变量及模式](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)
```shell
你可以替换你的项目根目录中的下列文件来指定环境变量:

.env.[mode]   # 只在指定的模式中被载入

一个环境文件只包含环境变量的“键=值”对：
VUE_APP_SECRET=secret
```
> 设置环境变量
```js
// admin/src/http.js
const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/admin/api"  // 访问的地址会以API_URL变量或 根地址/admin/api访问。
});

// 假如换上线上地址moba.com, 根地址就是moba.com
``` 

```js
// 生成.env.development文件，指定在开发环境中载入

VUE_APP_API_URL = http://localhost:3000/admin/api
```

2. 更改`打包输出路径`和`模板HTML`的`引用路径`
* 在admin路径下添加vue.config.js配置publicPath和outputDir
* 在web路径下添加vue.config.js配置publicPath和outputDir

```js
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/admin/" : "/",

    outputDir:__dirname+'/../server/admin'
}
/**
 * publicPath设置输出的HTML模板路径index.html的 href=/admin/...。不设置默认为 href=/...
 * outputDir设置打包输出路径，默认是在打包项目下的dist文件夹，这里admin打包放在同级的server文件夹下的admin文件夹
 */
```

3. 服务器文件夹管理静态文件
```js
// server/index.js管理静态文件资源
app.use('/admin',express.static(__dirname+'/admin'))
app.use('/web',express.static(__dirname+'/web'))
```

4. 使用
```shell
1. 对server文件夹npm run serve开启服务器localhost:3000

2. 因为管理了静态文件资源，现在使用 http://localhost:3000/admin  http://localhost:3000/web
```