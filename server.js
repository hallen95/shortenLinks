const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrls')
const app = express()

/* esto funciona para una base de datos local, 
pero para hacer el deploy en Heroku necesitamos otros datos */ 
mongoose.connect('mongodb+srv://fender2225:fender2225@cluster0.zq2ft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
})

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://fender2225:fender2225@cluster0.zq2ft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongoose.connect(new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }));
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//con esto nos aseguramos que ejs sea el engine que usamos para tomar los datos del form
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 5000)

app.use(express.urlencoded({ extended: false }))

// con el metodo find que nos provee el schema podemos pintar en pantalla todos los links en /
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

// con el metodo create le pasamos los datos del req por prop 
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

// este parametro dinamico tomara el link acortado cuando le hagamos click y 
// lo convertirá en el original en caso de existir y sino enviará un status de error
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(app.get('port'));