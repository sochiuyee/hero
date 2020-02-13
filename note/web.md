### 网站色彩和字体定义

- 在 style.scss 中定义颜色值集合

```css
$colors:(
    变量名1:颜色值,
    变量名2:颜色值
)

/* 循环遍历生产类名。list代表集合 */
@each $var in list{
    .class-#{$var}{
        /* 具体的样式 */
        text-align: $var;
    }
}

/* sass的Map函数 */
map-get(map, key)  返回 Map 中 key 所对应的 value(值)。如没有对应的 key，则返回 null 值。

实例:
$font-sizes: ("small": 12px, "normal": 18px, "large": 24px)
map-get($font-sizes, "small")
结果: 12px
```

****

### 页面的顶部大多数页面是不变，使用 vue router 做子路由跳转

`vue add vue router`

```html
<!-- 在main.vue的导航栏下方放置router-link作为子路由跳转地方 -->
<div>
  <div class="nav"></div>
  <router-link></router-link>
</div>
```

****

### [vue-awesom-swiper](https://github.com/surmon-china/vue-awesome-swiper)

1. 把轮播图做成组件
2. 各个页面的轮播图可能不一样，在 pagination 的 div 上传 class 以便分辨

****

[查看雪碧图位置、大小](http://www.spritecow.com/)

1. 考虑到手机端分辨率不同，通常以 iPhone6 做标尺，所以要考虑 dpr 问题。雪碧图的 scale for retina display 要设置 2
2. 查看雪碧图位置要选择 percentage position

****

### listCard 组件

- [`具名插槽`](https://cn.vuejs.org/v2/guide/components-slots.html)

1. 卡片的具体`内容`放在 card 组件的`插槽为body中`
2. 内容是可以滑动的，由 swiper 组件提供
3. 具体的 swiper-slide 需要提供`插槽`来渲染，无法写定。`具名插槽`name 为 items
4. swiper-slide 的插槽`绑定父组件`传递的`categories的数据`
5. 在使用时需要`template`元素上使用 v-slot 指令获取(简写为#)
   > 在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称:<template v-slot:插槽名>

```html
<!-- listCard.vue -->
<me-swiper slot="body" :pagination="false">
  <swiper-slide v-for="(category,index) in categories" :key="index">
    <slot name="items" :category="category"></slot>
  </swiper-slide>
</me-swiper>

<!-- 使用listCard组件：Home.vue -->
<me-list-card iconName="cc-menu-circle" title="新闻资讯" :categories="newCates">
  <!-- 接收 prop 的名字为items的插槽，使用了解构赋值，category变量接收了categories的每一项值 -->
  <template #items="{category}">
    <div class="py-2" v-for="(news,index) in category.newList" :key="index">
      <span>[{{news.categoryName}}]</span>
      <span>|</span>
      <span>{{news.title}}</span>
      <span>{{news.date}}</span>
    </div>
  </template>
</me-list-card>
```

****
> 吸顶效果
```css
.className{
  position: sticky;
  top: 0;
}
```

****
### web数据录入
> 数据录入
### (require-all)[https://www.npmjs.com/package/require-all] 引用一个目录下所有文件
* 目标是只需要目录中的`所有.js和.json文件`，则可以将字符串传递给require-all

* [lean](https://mongoosejs.com/docs/api.html#query_Query-lean)
```js
/**
 * server/plugins/db.js 数据库文件中引用所有的数据模型文件。require('require-all')(数据模型地址)。无需再require模型文件，直接const 文档名 = mongoose。model(数据模型名)
 * 
 * 添加server/routes/web/index.js作为数据初始化接口
 * 
 * 在Chrome浏览器的console中可以使用$$(相关的class)找到对应的元素
 * $$('.news_list .title').map(el=>el.innerHTML)获取数据内容
 */

// db.js引用所有的数据模型供数据库使用
require('require-all')(__dirname+'/../models') // __dirname是db.js所在的位置。引用所有的数据库模型

// web/index.js
module.exports = app =>{
    const router = require('express').Router()

    const mongoose = require('mongoose')

    // 获取相关数据的数据模型。因为数据库已引入所有的model
    const Article =  mongoose.model('Article')
    const Category = mongoose.model('Category')

    router.get('/news/init',asycn(req,res)=>{
        const parent = await Category.findOne({name:"新闻分类"})

        // 找到parent是新闻分类的数据，lean返回JavaScript对象而不是mongoose文档，没有保存等各种方法
        const cates = await Category.find().where({parent:parent}).lean()

        const newsTitle = ["...通过$$在Chrome找到的数据内容"]

        const newsList = newsTitle.map(title=>{
            // 将新闻分类的数据打乱。避免修改数据复制一份cates数据，slice(0)
            const randomCates = cates.slice(0).sort((a,b)=>Math.random()-0.5)

            return {
                categories:randomCates.slice(0,2),
                title:title
            }
        })

        // 插入数据
        await Article.deleteMany({})
        await Article.insertMany(newsList)

        res.send(newsList)
        
    })


    // mount the router on the app。访问时localhost:3000/web/api/news/init
    app.use('/web/api',router)
}

// 在server/index.js中使用web的接口
require('./routes/web)(app)
```

****
> 数据模型的关联  

[`关联查询`](https://zhuanlan.zhihu.com/p/82936828)  

[`populate`](https://mongoosejs.com/docs/populate.html)

[`schema virtual`](https://mongoosejs.com/docs/api.html#schema_Schema-virtual)  

[`populate-virtual`](https://mongoosejs.com/docs/populate.html#populate-virtuals)

* `虚拟属性virtual`：是文档属性，您可以获取和设置但`不保存到MongoDB`。用于`格式化`或`组合字段`，从而制定者去组成一个单一的值为存储多个值是有用的。
```js
// define a schema
var personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

// compile our model
var Person = mongoose.model('Person', personSchema);

// create a document
var bad = new Person({
    name: { first: 'Walter', last: 'White' }
});

// 在personschema定义 虚拟属性的getter
personSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

console.log('%s is insane', bad.name.full); // Walter White is insane

// 注意，这里的虚拟属性并没有存入数据库，所以如果是直接获取，是获取不到值的。
```

```js
// models/Category.js
const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name:{
        type:String
    },
    parent:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Category'
    }
})

// 添加虚拟属性
schema.virtual('children',{
    localField:'_id',
    foreignField:'parent',
    justOne:false,
    ref:'Category'
})

module.exports = mongoose.model('Category',schema)

// 使用关联把子分类调出
const parent = Category.findOne({
    parent:'新闻分类'
}).populate({ 
    path:'children'
})
```
* 上面两步用到了一个`virtual操作`，即为Type模型添加一个`虚拟字段`，告诉MongoDB引擎去搜索这个`虚拟字段代表的数据`。
* ref 指去哪里找
* 本地和外地字段（local/foreign Field）指在本模型和（去找相关数据的）外地模型中具体找哪个字段
* justOne指是找一个还是找多个
* 第一个参数是一个字符串，就是虚拟字段的名称。指的是上面的'children'

```js
// models/Category.js
const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name:{
        type:String
    },
    parent:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Category'
    }
})

// 添加模型虚拟字段
schema.virtual('children',{
    localField:'_id',
    foreignField:'parent',
    justOne:false,
    ref:'Category'
})

/**
 * 为Category模型添加虚拟字段newsList:
 * 首先在Category模型(对应的Document)中（查询）获取到某个分类，此时获取到了某分类的_id
 * 然后去到Article模型(对应的Document)中查询categories包含这个_id数据。
 */
schema.virtual('newsList',{
    localField:'_id',
    foreignField:'categories',
    justOne:false,
    ref:'Article'
})

// 默认的集合名字是modelName的小写复数，categories。
// 可以自己修改集合名 mongoose.model('Category',schema,'最后这个参数自定义集合名字')
module.exports = mongoose.model('Category',schema)


const parent = Category.findOne({
    parent:'新闻分类'
}).populate({
    path:'children',
    populate:{
        path:'newsList'
    }
}).lean()
```

****
### [聚合查询](https://mongoosejs.com/docs/api/aggregate.html#aggregate_Aggregate)  

[mongodb aggregate](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/)

[操作符](https://docs.mongodb.com/manual/reference/operator/query/)
```js
// 使用Model.aggregate()构建聚合管道,参数是聚合管道作为对象数组Model.aggregate([])

// 1.获取Category Model
const Category = mongoose.model('Category')

// 2. 构建聚合管道
/**
 * $match:筛选文档流，以仅允许匹配的文档未经修改地传递到下一个管道阶段
 * $lookup:对同一数据库中的另一个集合执行左外部联接，以过滤“联接”集合中的文档以进行处理。
 * $addFields:将新字段添加到文档,$addFields重塑流中的每个文档。 具体而言，通过向输出文档添加新字段，该文档既包含输入文档中的现有字段，又包含新添加的字段。
 */
const cates = Category.aggregate([
  {$match:{筛选条件}},
  {$lookup:{
    from:"在同一数据库中指定要执行联接的集合",
    localField:"指定从文档输入到$ lookup阶段的字段。 $ lookup在from集合的文档中对localField和foreignField执行相等的匹配。 如果输入文档不包含localField，则$ lookup会将字段视为具有null值以进行匹配。",
    foreignField:"指定from集合中文档中的字段。 $ lookup对foreignField和输入文档中的localField进行相等匹配。 如果from集合中的文档不包含foreignField，则$ lookup会将值视为null以进行匹配。",
    as:"指定要添加到输入文档中的新数组字段的名称。 新数组字段包含from集合中的匹配文档。 如果输入文档中已经存在指定的名称，则现有字段将被覆盖。"
  }},
  {$addFields:{添加新字段}}
])

```

****
### web 前端调用接口
* server/routes/web/index.js
```js
const mongoose = require(mongoose)
const Category = mongoose.model("Category")

router.get('news/list',async(req,res)=>{
  const parent = await Category.find().where({
    name:'新闻分类'
  })

  const cates = await Category.aggregate([
    // 筛选新闻分类数据
    {$match:{parent:parent._id}},

    // 根据Category的虚拟字段newsList数据关联Article数据模型
    {
      $lookup:{
        from:"articles", // 从articles集合中查询_id数据，看categories文档是否含有同样的_id数据。mongoose.model("Article",schema,集合名)不写集合名默认是modelName的小写复数
        localField:"_id",
        foreignField:"categories", // 外键字段是指articles里的categories，在其他集合里查找categories的数据
        as:"newsList" // 将找到同样的数据添加新字段 newsList:categories和articles同样的_id数据。
      }
    },

    // 添加新字段到Category文档
    $addFields:{
      newsList:{ // 上一步$lookup已经添加了newsList字段，这里就把有的newsList字段覆盖成查询结果为5个的数据
        // $slice操作运算符，限制从数组投影的元素数量。限制关联数据得到的newsList字段数据的前5个数据
        $slice:["newsList",5]
      }
    }
  ])

  const subCates = cates.map(item => item._id)

  // 添加热门数据
  cates.unshift({
    name:"热门",
    newsList: await Article.find()
    .where({
      // 查找categories属性; $in:匹配操作符 匹配categories文档新闻分类中含有筛选过与articles文档相同的_id数据
      categories:{ $in: subCates}
    })
    .populate('categories') // 关联categories文档
    .limit(5)
    .lean() // 返回js对象，不是返回mongoose文档无法用mongoose方法
  })

  // 对热门分类在网页显示的标签应该是由category中：新闻、公共、活动、赛事中挑选
  cates.map(cate => {
    // 添加newsList属性
      cate.newsList.map(news => {
        // 对于热门分类中，选取上一步添加的categories属性值的第一项的name属性。对于非热门分类，categoryName属性值直接为name属性：新闻、公共、活动、赛事
        news.categoryName =
          cate.name === "热门" ? news.categories[0].name : cate.name;
        return news;
      });
      return cate;
    });
})
```

****
### 默认定义schema设置
[schema](https://mongoosejs.com/docs/guide.html#timestamps)
* 如果设置了时间戳，mongoose会向您的模式分配createdAt和updatedAt字段，分配的类型为Date
```js
// var thingSchema = new Schema({..}, { timestamps: true });生成的字段默认为updatedAt, createdAt

// 给Article数据模型设置时间戳
const schema = mongoose.Schema({
    title:{
        type:String
    },
    categories:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Category'
    }],
    body:{
        type:String
    }
},{
    // 设置时间戳
    timestamps:true
})

module.exports = mongoose.model('Article',schema)

// 在Home.vue中使用
<span>{{news.createdAt}}</span>
```

****
### 给幻灯片切换添加动态效果
[swiper 事件](https://www.swiper.com.cn/api/event/405.html)
[swiper 属性](https://www.swiper.com.cn/api/properties/310.html)

* swiper有slide-change事件
* mySwiper.realIndex 当前活动块的索引，与activeIndex不同的是，在`loop模式`下`不会`将`复制的块`的数量计算在内。

> 将swiper封装为组件，`不能`直接在`封装的swiper组件`中绑定事件
```js
// 直接使用vue-awesome-swiper可以在swiper中绑定事件
<template>
  <swiper @slide-change="..." ref="swiper">
    <swiper-slide></swiper-slide>
  </swiper>
</template>

import "swiper/dist/css/swiper.css";
import { swiper } from "vue-awesome-swiper";

mounted(){
  this.$refs.swiper.swiper // swiper实例
}
```

```js
// 将swiper封装为组件
<me-swiper ref="mecomponent">
  <swiper-slide></swiper-slide>
</me-swiper>

import MeSwiper from "../components/swiper";
import { swiperSlide } from "vue-awesome-swiper";

mounted(){
  this.$refs.mecomponent.$children[0].swiper // swiper实例
}

// 直接在封装组件上监听swiper事件失败，因为封装组件并不是组件实例
<me-swiper ref="mecomponent" @slide-change>

// 给封装swiper组件监听swiper事件需要获取swiper实例再用on绑定事件
mounted(){
  this.$refs.mecomponent.$children[0].swiper.on('slideChange',function(){})
}
```

****
### [vue filters](https://cn.vuejs.org/v2/guide/filters.html)
* 给在页面显示的时间戳修改显示`时间为月/日`
```html
<span class="text-gray fs-sm">{{news.createdAt|date}}</span>
```
```js
filters:{
  // val指传给filters里date函数的数据库时间戳createAt
    date(val){
      if(!val) return
      val = (val.slice(5,10)).replace(/-/,'/')
      return val
    }
  }
```

****
> 在Chrome浏览器获取数据
```js
$$('.hero-nav > li').map((li,i)=>{
    return {
        name:li.innerText,
        heroes:$$('li',$$('.hero-list')[i]).map(el=>{
            return {
                name:$$('h3',el)[0].innerHTML,
                avatar:$$('img',el)[0].src
            }
        })
    }
})

JSON.stringfy(在Chrome得到的数据)
```

****
### Article.vue  

(路由组件传参)[https://router.vuejs.org/zh/guide/essentials/passing-props.html]  

`通过props解耦` 
1. 在template中{{路由参数}}获取
2. 在script中通过this.路由参数获取

```js
// 在文章的路由
{
  path:'/articles/:id',
  name:'article',
  component:()=>import('../views/Article.vue'),
  props:true
}
```

```js
// 通过props来解耦，id是路由传递过来的参数
props: {
    id: {
      required: true
    }
  },
methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    }
  },

// 当id发生变化执行fetch函数
watch:{
  id:'fetch'
}

/**
 * 上面监听id可以写另一种写法
 * watch:{
 *    id(){
 *      this.fetch()
 *    }
 * }
```

****
> 英雄详情页
1. web/router添加英雄详情页路由
```js
{
    path:'/heroes/:id',
    name:'hero',
    component:()=>import ('../views/Hero.vue'),
    props:true // 在页面中在props接收
}
```

2. web/Home.vue中放置英雄详情页的路由跳转
```html
<!-- 在英雄列表里放置路由 -->
<router-link tag="div" :to="`/heroes/${英雄数据的id}`">
  <img :src="英雄照片">
  <span>英雄名字</span>
</router-link>
```

3. web/Hero.vue
```js
// 接收路由传递过来的id
props:{
  id: {
      required: true
    }
}

// 根据路由传递过来的id获取数据库英雄对应数据
methods: {
    async fetch() {
      const res = await this.$http.get(`heroes/${this.id}`);
      this.model = res.data;
    }
  }
```

4. server/routes/web/index.js 请求英雄数据接口
```js
router.get("/heroes/:id",async(req,res)=>{
  // 关联categories得到的是英雄分类：法师、辅助...，而不再是mongoose.SchemaTypes.ObjectId。关联后得到的是具体的数据而不是mongoose.SchemaTypes.ObjectId
    const data = await Hero.findById(req.params.id).populate('categories items1 items2 partners.hero').lean()
    res.send(data)
  })
```

5. web/Hero.vue渲染数据
* 请求后台英雄数据接口获取英雄详情数据
```js
data() {
    return {
      model: null
    };
  },
methods: {
    async fetch() {
      const res = await this.$http.get(`heroes/${this.id}`);
      this.model = res.data;
    }
  },
```

* 渲染获取到的数据
```html
<div v-if="model">
<!-- 在后端接口已经关联categories字段得到的是js对象，通过数组遍历得到英雄定位类型，得到的是数组形式，需要拆分成字符串并用/连接 -->
  <p>{{model.categories.map(item=>item.name).join('/')}}</p>
</div>
```

****
### chrome获取颜色

* F12 点击元素看到有颜色的地方点击颜色，出现吸管可以吸取颜色