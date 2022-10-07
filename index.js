require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const initialUrl = [];
const shortUrl = [];

app.post('/api/shorturl', (req, res) => {

  let url = req.body.url;

  let getIndex = initialUrl.indexOf(url);

  if(!url.includes('https://') && !url.includes('http://')){
    return res.json({error: 'invalid url'})
  }

  if(getIndex < 0){

    initialUrl.push(url)
    shortUrl.push(shortUrl.length)

    return res.json({
      original_url: url,
      short_url: shortUrl.length - 1,
    })
  }

  return res.json({
    original_url: url,
    short_url: shortUrl[getIndex],
  })
})

app.get('/api/shorturl/:shorturl', (req, res) => {

  const shortURL = parseInt(req.params.shorturl); 
  let getIndex = shortUrl.indexOf(shortURL);

  if(getIndex < 0){
    return res.json({
      'error': 'No short URL found for the given input',
    })
  }

  res.redirect(initialUrl[getIndex]) 
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
