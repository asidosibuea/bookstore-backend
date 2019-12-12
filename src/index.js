const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const app = express()
const port = 3001

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(bookRouter)

app.listen(port, () => {
  console.log(`Server is running in ${port}`)
})
