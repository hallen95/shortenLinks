const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require('./models/shortUrls');
const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))

app.get("/",   (async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find();
        console.log(shortUrls)
    res.render('index', { shortUrls: shortUrls});
    }
    catch(e){ 
        console.log(new Error(e));
    }
}));

app.post("./shortUrls",  (async(req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl })
        res.redirect("/")
    }
    catch(e){
        console.log("error:", e)
    }
}));

app.get('/:shortUrl', (async (req, res) => {
    try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
    }
    catch(e){
        console.log("error:", e)
    }
  }));

app.listen(process.env.PORT || 5000);
