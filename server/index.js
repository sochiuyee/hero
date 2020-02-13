const express = require('express')

const app = express()

// 设置变量用于token的秘钥
app.set('secret','asdfghjkl')

// 引入跨域模块
app.use(require('cors')())
// 开启json解析
app.use(express.json())

app.use('/uploads',express.static(__dirname+'/uploads'))
app.use('/admin',express.static(__dirname+'/admin'))
app.use('/web',express.static(__dirname+'/web'))

// 连接数据库
require('./plugins/db')(app)

require('./routes/admin')(app)

require('./routes/web')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})