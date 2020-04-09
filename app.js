import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'

const app = express()

// Connection mongo

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

const url = 'mongodb://localhost:27017/teamcoo'

// Promises
mongoose.connect(url,options)
  .then(
    () => { console.log('Conectado a DB') },
    err => { console.log(err) }
  )
  .catch((err) => {
    console.log(err)
  })

// Middleware

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, 'public')))

// Rutas

app.use('/api/actions', require('./routes/actions'))
app.use('/api/users', require('./routes/users'))
app.use('/api/tokens', require('./routes/tokens'))
app.use('/api/wg', require('./routes/workinggroups'))
app.use('/api/topics', require('./routes/topics'))
app.use('/api/files', require('./routes/files'))
app.use('/api/questions', require('./routes/questions'))

// Middleware for Vue.js router mode history

const history = require('connect-history-api-fallback')
app.use(history());
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'))
})
