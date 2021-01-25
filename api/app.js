const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')

const colors = {
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  bgblack: '\u001b[40m',
  bgred: '\u001b[41m',
  bggreen: '\u001b[42m',
  bgyellow: '\u001b[43m',
  bgblue: '\u001b[44m',
  bgmagenta: '\u001b[45m',
  bgcyan: '\u001b[46m',
  bgwhite: '\u001b[47m',
  reset: '\u001b[0m',
  carriage: '\r'
}

const app = express();
const version = 'v' + (process.env.API_VERSION || 1);

// Connection mongo

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

const database = process.env.DATABASE_HOST || 'localhost'
const url = 'mongodb://' + database + ':27017/teamcoo'

// Promises
mongoose.connect(url, options)
  .then(
    () => { 
      console.log( colors.bggreen + colors.white + '[______________________________________________________________]' + colors.reset );
      console.log( colors.bggreen + colors.white + '[___________________________DATABASE___________________________]' + colors.reset );
      console.log( colors.bggreen + colors.white + '[______________________________________________________________]' + colors.reset );
      console.log('');
      console.log( colors.green +  '💡 Mongo Connected ===> ' + colors.reset +  colors.cyan + url );
      console.log('');
    },
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

// Routes

app.use('/api/' + version + '/actions', require('./routes/actions'))
app.use('/api/' + version + '/users', require('./routes/users'))
app.use('/api/' + version + '/tokens', require('./routes/tokens'))
app.use('/api/' + version + '/wg', require('./routes/workinggroups'))
app.use('/api/' + version + '/interests', require('./routes/interests'))
app.use('/api/' + version + '/files', require('./routes/files'))
app.use('/api/' + version + '/questions', require('./routes/questions'))

// Middleware for Vue.js router mode history

const history = require('connect-history-api-fallback')
app.use(history());
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000)
app.set('host', process.env.HOST || '0.0.0.0')
app.listen(app.get('port'),app.get('host') , () => {
  console.log( colors.bgmagenta + colors.white + '[______________________________________________________________]' + colors.reset );
  console.log( colors.bgmagenta + colors.white + '[______________________________SERVER__________________________]' + colors.reset );
  console.log( colors.bgmagenta + colors.white + '[______________________________________________________________]' + colors.reset );
  console.log('');
  console.log( colors.green + '💻 Server Start ===> ' + colors.reset +  colors.blue + app.get('host') + colors.reset + colors.magenta + ':' + app.get('port') + colors.reset );
  console.log('');
})
