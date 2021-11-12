const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs');
require('dotenv').config({ path: require('find-config')('.env') });

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

const {
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PORT,
  NODE_ENV,
  WEB_NAME,
  API_VERSION
} = process.env;

const app = express();
const version = 'v' + (API_VERSION || 1);

// Connection mongo
let options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

if (NODE_ENV == 'production') options.user = process.env.MONGO_ROOT_USER;
if (NODE_ENV == 'production') options.pass = process.env.MONGO_ROOT_PASSWORD;
if (NODE_ENV == 'production') options.auth = { authSource: 'admin' };

const url = `mongodb://${NODE_ENV == 'production' ? WEB_NAME + '-db' : DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

// Promises
mongoose.connect(url, options);
const db = mongoose.connection;

db.on('error', err => {
  console.error('Mongodb Connection Error:' + err);
});
db.once('open', () => {
  console.log(colors.bggreen + colors.white + '[______________________________________________________________]' + colors.reset);
  console.log(colors.bggreen + colors.white + '[___________________________DATABASE___________________________]' + colors.reset);
  console.log(colors.bggreen + colors.white + '[______________________________________________________________]' + colors.reset);
  console.log('');
  console.log(colors.green + '💡 Mongo Connected ===> ' + colors.reset + colors.cyan + url);
  console.log('');
});

// Middleware
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes 
fs.readdir('./routes/', (error, files) => {
  if (error) return console.log(err);

  files.forEach(file => {
    if (!file.endsWith('.js')) return;

    const routeName = file.split('.')[0];
    app.use(`/api/${version}/${routeName}`, require(`./routes/${file}`))
  })
})

// Middleware for Vue.js router mode history
const history = require('connect-history-api-fallback')
app.use(history());

app.set('port', process.env.API_PORT || 3000)
app.set('host', NODE_ENV == 'production' ? process.env.WEB_NAME + '-api' : 'localhost')
app.listen(app.get('port'), app.get('host'), () => {
  console.log(colors.bgmagenta + colors.white + '[______________________________________________________________]' + colors.reset);
  console.log(colors.bgmagenta + colors.white + '[________________________________API___________________________]' + colors.reset);
  console.log(colors.bgmagenta + colors.white + '[______________________________________________________________]' + colors.reset);
  console.log('');
  console.log(colors.green + '💻 Server Start ===> ' + colors.reset + colors.blue + app.get('host') + colors.reset + colors.magenta + ':' + app.get('port') + colors.reset);
  console.log('');
})
