const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

const server = app.listen(4000, () => {
  const { host, port } = server.address()
  console.log('server is runnning at http://%s%s', host, port)
})
