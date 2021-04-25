const express = require('express')
const app = express()
const mysql = require('mysql')
// const InitManager = require('./core/init')
const cors = require('cors')
const userRouter = require('./app/api/v1/user')
const tokenRouter = require('./app/api/v1/token')
const likeRouter = require('./app/api/v1/like')
const catchError = require('./middlewares/exception')

app.use(cors())

app.use('/v1/user', userRouter)
app.use('/v1/token', tokenRouter)
app.use('/v1/like', likeRouter)

app.use((err, req, res, next) => {
	// res.status(500).send(err.message);
  // next()
  // console.log(err)
  catchError(err, req, res, next)
})

// app.use(function(req, res, next) {
//   // next(catchError(req, res, next))
//   console.log('asdfasdffasdfasdfasd')
//   // catchError(req, res, next)
// })

// app.use(catchError)

// InitManager.initCore(app)

// function connect() {
//   return mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     port: '8889',
//     password: 'root',
//     database: 'e-book'
//   })
// }

// app.get('/book/list', (req, response) => {
//   const conn = connect()
//   conn.query('select * from book', (err, res) => {
//     if (err) {
//       response.json({
//         err_code: 1,
//         msg: '数据库连接失败'
//       })
//       console.log('err', err)
//     }else {
//       response.json({
//         err_code: 0,
//         data: res
//       })
//     }
//     conn.end()
//   })
// })

// function randomArray(n, l) {
//   let rnd = []
//   for (let i = 0; i < n; i++) {
//     rnd.push(Math.floor(Math.random() * l))
//   }
//   return rnd
// }

// const url = 'http://192.168.0.100:8083'
// function createData(res, key) {
//   console.log('resss', res[key])
//   const data = res[key]
//   if (data&&data.cover && !data.cover.startsWith('http://')) {
//     data['cover'] = `${url}/img${data.cover}`
//   }
//   return data
// }

// function handleData(data) {
//   if (!data.cover.startsWith('http://')) {
//     data['cover'] = `${url}/img${data.cover}`
//   }
//   data['selected'] = false
//   data['private'] = false
//   data['cache'] = false
//   data['haveRead'] = 0
//   return data
// }

// app.get('/book/detail', (req, res) => {
//   const conn = connect()
//   const fileName = req.query.fileName
//   const sql = `select * from book where fileName='${fileName}'`
//   conn.query(sql, (err, results) => {
//     if (err) {
//       res.json({
//         error_code: 1,
//         msg: '电子书详情获取失败'
//       })
//     } else {
//       if (results && results.length === 0) {
//         res.json({
//           error_code: 1,
//           msg: '电子书详情获取失败'
//         })
//       } else {
//         const book = handleData(results[0])
//         res.json({
//           error_code: 0,
//           msg: '获取成功',
//           data: book
//         })
//       }
//     }
//     conn.end()
//   })
// })

// app.get('/book/home', (req, response) => {
//   const cn  = connect()
//   cn.query('select * from book where cover != \'\'', (err, res) => {

//     const recommend = []
//     const guess = []
//     const arr1 = [0, 1, 2]
//     const arr2 = [3, 4, 5]
//     const length = res && res.length || 0
    
//     console.log('121212121221', guess)
//     arr1.forEach(key => {
//       guess.push(createData(res, key))
//     })

//     arr2.forEach(key => {
//       recommend.push(createData(res, key))
//     })
//     response.json({
//       recommend,
//       guess
//     })
//     cn.end()
//   })
// })

// app.get('/', (req, res) => {
//   res.send(new Date().toDateString())
// })

const server = app.listen(4000, () => {
  const { host, port } = server.address()
  console.log('server is runnning at http://%s%s', host, port)
})
