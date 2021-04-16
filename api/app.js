const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs');

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

// Routes TODO: Change response codes correctly

fs.readdir('./routes/', (error, files) => {
  if (error) return console.log(err);

  files.forEach(file => {
    if(!file.endsWith('.js')) return;

    const routeName = file.split('.')[0];
    app.use(`/api/${version}/${routeName}`, require(`./routes/${file}`))
  })
})

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
