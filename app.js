const express = require('express')
const app = express()
const mysql = require('mysql')

function connect() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '8889',
    password: 'root',
    database: 'e-book'
  })
}

app.get('/book/list', (req, response) => {
  const conn = connect()
  conn.query('select * from book', (err, res) => {
    if (err) {
      response.json({
        err_code: 1,
        msg: '数据库连接失败'
      })
      console.log('err', err)
    }else {
      response.json({
        err_code: 0,
        data: res
      })
    }
    conn.end()
  })
})

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

const server = app.listen(4000, () => {
  const { host, port } = server.address()
  console.log('server is runnning at http://%s%s', host, port)
})
