### 后台通用接口
```js
/**
 * 后台请求接口 server/routes/admin/index.js
 * 将请求接口路由以函数形式对外公开 model.exports = app => {}
 * 参数传递形式把路由传递 require('./routes/admin')(app)
 * 对于不同的后台管理页面接口采用:resource形式匹配
 * router.请求方式
 * app.use('路径/:resource',中间件,router)
 */

model.exports = app => {
    const exprss = require('express')
    const router = exprss.Router({
        mergeParams: true // 保留父路由参数，如果与子路由参数冲突就使用子路由参数。合并路由参数
    })

    // 请求接口
    router.post('/', async (req, res) => {
        // do somethings
    })

    router.put('/:id', async (req, res) => {
        // do somethings
    }

    app.use('/admin/api/rest/:resource', async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource) // 转成大写单数来寻找对应的数据库模型
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router)
}

/**
 * 前端请求
 * main.js把axios实例挂载在Vue原型上
 * Config Defaults:
 * axios.defaults.baseURL
 */
const http = axios.create({
    baseURL:'http://localhost:3000/admin/api'
})

import http from './http.js'
Vue.prototype.$http = http

/**
 * 请求后端接口时
 * rest/categories rest是后端通用接口的地址部分，categories是后端通用接口的:resource部分
 */
this.$http.get("rest/categories")
```

****

### 上传图片
- upload图片不是通用接口，不用router  

- 安装[multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)
    - Multer 会添加一个 body 对象 以及 file 或 files 对象 到 express 的 `request 对象`中。 `body` 对象包含表单的`文本域信息`，`file 或 files 对象`包含对象表单上传的`文件信息`。
    - req.body
    - req.file
    - req.files
```js
/**
 * 在后端接口routes/admin/index.js中添加上传图片接口
 * 使用multer插件
 */
const multer = require('multer')
    const upload = multer({
        dest: __dirname + '/../../uploads' // 保存上传文件的地址
    })
    // 上传文件接口
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => { // 上传的文件字段为file，在network的Form Data可以查询到
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}` // request对象的file对象添加url属性
        res.send(file)
    })

/**
 * 在前端上传图片的请求修改对应请求数据地址：为后端请求上传文件的地址
 */
<el-upload :action="$http.defaults.baseURL+'/upload'"></el-upload>
```

****
### 富文本编辑器 [vue2-editor](https://www.npmjs.com/package/vue2-editor)

- 本质是把内容转成`HTML格式`
- 上传图片会把图片转成base64格式，会令请求庞大降低请求速率
- 修改上传图片为上传图片接口

```js
/**
 * 前端的需要用到富文本编辑器页面添加<vue-editor
 * 例子查看文档的Example - Custom Image Handler部分
 */
<vue-editor v-model="model.body" useCustomImageHandler @image-added="handleImageAdded"></vue-editor>

components: {
    VueEditor
  },

methods:{
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData(); // 提交表单信息用HTML自带的FormData
      formData.append("file", file); // 与请求upload接口的请求字段一致upload.single('file')

      const res = await this.$http.post("upload", formData); // 发起请求后端上传图片接口
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    }
}
```

****
### 密码加密
- 安装 [bcryptjs](https://www.npmjs.com/package/bcryptjs)

```js
/**
 * 在定义用户模型时对密码进行加密
 * select: boolean 查询时默认输出该属性
 * get, set: function, 自定义属性的值
 */
const schema = mongoose.Schema({
    username: {
        type: String
    },
    password:{
        type: String,
        select:false, //  这里设置false因为把密码序列化每次得到的结果都不一样，就算没有改动密码但是提交时都会序列化密码，会导致有问题，需要不输出该属性使得没有改动密码就不会改变序列化的密码结果
        set(val){ // 将密码加密
            return require('bcryptjs').hashSync(val,10)
        }
    }
})
```

****
**登录接口**

1. 编写后端登录接口 `server/routes/admin/index.js`
```js
app.post('/admin/api/login',async (res,req)=>{
    const { username, password } = req.body
        // 1. 根据用户名找用户
        const AdminUser = require('../../models/AdminUser')
        const user = await AdminUser.findOne({ username }).select('+password') // 在AdminUser数据模型中设置select:false，需要在寻找时把密码也输出
        if (!user) {
            // 找不到对应的用户信息返回状态码422并且返回信息
            return res.status(422).send({
                message: '用户不存在'
            })
        }
})
```

2. 设置登录拦截 `admin/src/http.js`   

- [axios](https://www.npmjs.com/package/axios) 的拦截器 `Interceptors` ( 先拦截请求或响应，然后再由then或处理catch )  
    - 查看// Add a response interceptor的例子

- [element-ui message](https://element.eleme.cn/#/zh-CN/component/message#fang-fa)

    ```js
    /**
     * 拦截响应，对错误进行弹出消息框提示
     */
    import Vue from 'vue'
    http.interceptors.response.use(res =>{
        return res
    },err=>{
        if(err.response.data.message){ // message是app.post('/admin/api/login'登录接口出现错误时返回的信息
            Vue.prototype.$message({ // 将element-ui的Message提示消息挂载到Vue原型上，无需要在各个页面对错误状态码进行处理
                type:'error',
                message:err.response.data.message
            })
    }
    return Promise.reject(err)
    })
    ```

3. 使用bcryptjs校验密码 `server/routes/admin/index.js`
[bcryptjs](https://www.npmjs.com/package/bcryptjs)

 - `compareSync(s, hash)`

  Parameter	 | Type | Description
  :-: | :-: | -:
  s | string | String to compare| 
  hash | string | Hash to test against|
  @returns	| boolean	|true if matching, otherwise false

```js
/**
 * 对登录页面输入的密码和存储的密码进行解密并比对正确与否
 * 密码错误的话就发送错误状态码与错误信息
 */
const isValid = require('bcryptjs').compareSync(password,user.password) // password是结构赋值req.body.password。user.password是寻找到数据库密码的hash值
        if(!isValid){
            return res.status(422).send({
                message:'密码错误'
            })
        }
```

4. [token](https://www.npmjs.com/package/jsonwebtoken)
```js
[express API](http://expressjs.jser.us/3x_zh-cn/api.html)
/**
 * express的API
 * app.set(name, value) 将设置项 name 的值设为 value
 * app.get(name) 获取设置项 name 的值
 */
```

`server/index.js`
```js
// 设置变量作为token秘钥
app.set('secret','asdfghjkl')
```

`server/routes/admin/index.js`
```js
/**
 * Synchronous Sign with default (HMAC SHA256)
 * var jwt = require('jsonwebtoken');
 * var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
 */
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ id: user._id },app.get('secret')) // app.get('secret')获取全局设置的变量
    res.send({token})
```

5. 使用localStorage存储token
`admin/src/views/Login.vue`
```js

// 在login方法中添加
localStorage.token = res.data.token

this.$router.push('/')

this.$message({
    type:'success',
    message:'登录成功'
})
```

****
**服务端登录校验jwt**
> 在router.get('/',接口中`校验用户是否登录`，登录才能访问数据。校验的`条件`就是是否有`token`

1. 获取用户信息（一般在请求头`Request Headers传递信息`）  

[axios](https://www.npmjs.com/package/axios) 

- 搜索request
// Add a request interceptor

>> 前端发送请求头信息包括token数据
```js
// 在admin/src/http.js
http.interceptors.request.use(function (config) {
    if(localStorage.token){ // 没有接收到服务器端发来的token就不需要发送请求头
        config.headers.Authorization = 'Bearer '+localStorage.token // 请求头信息添加上token信息。授权信息一般用Authorization
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
```

>> 后端进行token的解析验证
2. 后端接口验证request带有的token信息
`server/routes/admin/index.js`
```js
/**
 * 在通用接口处加入中间件函数function(req,res,next){... next()}
 * 前端把生成的token放到请求头信息req.headers交给服务器
 * 在后端把前端发送来的token进行处理 
 */
```

>>> 错误处理
- `npm i http-assert`
[http-assert](https://www.npmjs.com/package/http-assert)
```js
/**
 * 出现错误的解决
 * 需要用express5
 */

// 登录接口
    app.post('/admin/api/login', async (req, res, next) => {
        // 接收前段在请求头发送的token信息并提取
        const token = String(req.headers.authorization || '').split(' ').pop()

        // 根据秘钥解析token   verify(token, secretOrPublicKey, [options, callback])，将token解析得到的数据为登录接口时设置的jwt.sign({ id: user._id }时的id数据
        const {id} = jwt.verify(token,app.get('secret'))

        // 把找到的信息挂载到req对象供其他地方使用
        req.user = await AdminUser.findById(id)
        
        await next()
    },async (req, res) => {
        const { username, password } = req.body
        // 1. 根据用户名找用户。+password是因为在存储管理员信息时对密码设置select:false避免没有改密码提交又生成不同的加密密码
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user,422,'用户不存在') // 如果没有user，状态码为422，报错信息为用户不存在
```

****
> 前端在请求拦截器里对服务端返回转态码401统一处理
`admin/src/http.js`

```js
// 解决Vue.prototype.$router访问不到路由，需要引入路由
import router from './router'

http.interceptors.response.use(res => {
    return res
}, err => {
    if (err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })

        // 对服务端返回的状态码401进行统一处理。登录拦截，出错就只能停留在登录页面
        if(err.response.status === 401){
            router.push('/login')
        }
    }
    return Promise.reject(err)
})
```

****
### 中间件 function(req,res,next){... next()}
1. 把通用的中间件单独成一个模块  
[express的request对象](http://www.expressjs.com.cn/en/4x/api.html#req.app)
```js
module.exports = options => { // 导出函数，返回中间件，通过参数可以修改里面的配置
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../models/AdminUser')
    const assert = require('http-assert')

    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '没有token，请先登录')

        const { id } = jwt.verify(token, req.app.get('secret')) // 中间件访问Express实例需要用request对象的app属性
        assert(id, 401, '找不到该token，请先登录')

        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '找不到该用户，请先登录')

        await next()
    }
}
/**
 * req.app此属性保存对使用中间件的Express应用程序实例的引用。
 * 如果遵循创建仅导出中间件功能并将其在主文件中的require（）的模块的模式，则中间件可以通过req.app访问Express实例
 */

// 使用中间件 1.引入 2.以函数形式使用authMiddleware()。因为module.exports = options => { 以函数形式导出中间件
const authMiddleware = require('../../middleware/auth')
// 在需要的中间件的地方插入中间件
app.use('地址',authMiddleware(),...)
```

****
### 客户端路由限制
- 登录检验因为请求了`服务端`接口返回`状态码401`，而且在前端`http.js`进行`响应拦截`服务器返回`状态码401会跳转`到`登录页`面
- 但是访问admin/src/views/ItemEdit在创建物品的时候，`没有服务端返回状态码`，只是提交数据给客户端的post，所以`不能登录拦截`。需要`路由限制`

[路由元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)  

[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)
```js
/**
 * admin/src/router/index.js
 * 1.给路由添加meta字段
 * 2.导航守卫
 */
{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      isPublic: true // 给不需要验证就可以登录的页面添加meta字段，内容随意改。
    }
  },

  // 使用 router.beforeEach 注册一个全局前置守卫。
  router.beforeEach((to, from, next) => {

  // to.meta包含自己定义的字段内容
  if (!to.meta.isPublic && !localStorage.token) {
    console.log(to.meta) // 打印出设置的meta字段

    return next('/login') // 限制跳转到登录页面直到顺利登录为止才可以跳转到其他页面
  }
  next() // 确保要调用 next 方法，否则钩子就不会被 resolved。
})
```
  
****
### 上传文件的登录校验
- 因为例如ItemEdit.vue`上传文件 :action="$http.defaults.baseURL+'/upload'"。`利用的是`element-ui底层的ajax请求库`。但是在request`请求拦截器`里发送`headers带有token`是`axios`，所以通过element-ui上传文件并`没有发送token到headers`，服务端就会返回401

```js
/**
 * 全局混入设置请求头request.headers发送token
 * 全局混入计算属性$_myMixin_uploadUrl来给element-ui请求后端上传文件接口
 */
Vue.mixin({
  computed:{
    $_myMixin_uploadUrl(){
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods:{
    $_myMixin_getAuthHeaders(){
      return {
        Authorization:`Bearer ${localStorage.token || ''}`
      }
    }
  }
})

// element-ui的上传文件组件中修改发送ajax请求的action地址和设置发送请求头带上token
<el-upload
          class="avatar-uploader"
          :action="$_myMixin_uploadUrl"
          :headers="$_myMixin_getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
```

****
### 退出登录
* 在后台登录界面admin/src/views/Main.vue中的el-header中修改
```html
<!-- 1.修改登录用户名 2.添加点击退出登录 -->
<el-header style="text-align: right; font-size: 12px">
    <!-- 添加下拉菜单点击退出登录 -->
    <el-dropdown trigger="click" @command="handleCommand">
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <!-- 登录用户名 -->
    <span>{{username}}</span>
</el-header>
```
```js
methods: {
    handleCommand(command) {
      // 退出登录
      if(command=='logout'){
        // 清除localStorage挂载的token
        localStorage.token = ''
        console.log(localStorage)
        this.$router.push('/login')
      }
    }
  },
  computed: {
    username() {
      return localStorage.user;
    }
  }
```

****
> 修复新建分类和分类列表跳转问题：点击编辑列表再点击新建列表不跳转
* router-view`默认以组件区分`，但是编辑和创建页面是同一个组件，所以跳转有问题
1. 在跳转路由展现地方router-view中绑定路由对象属性($route.path)[https://router.vuejs.org/zh/api/#%E8%B7%AF%E7%94%B1%E5%AF%B9%E8%B1%A1]
2. $route.path 字符串，对应当前路由的路径，总是解析为绝对路径

```html
<!-- 在admin/src/views/Main.vue中 -->
<el-main>
    <!-- 因为点击导航栏仅是右边内容进行跳转而不是整个页面跳转 -->
    <router-view :key="$route.path"></router-view>
</el-main>
```







