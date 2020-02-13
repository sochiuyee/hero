// 导出函数，参数是对象到时候引用时把express()传给app参数
module.exports = app => {
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1:27017/hero',{
        useNewUrlParser:true,
        useUnifiedTopology: true
    })

    require('require-all')(__dirname+'/../models')
}