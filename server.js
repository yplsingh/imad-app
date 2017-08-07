var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

var config = {
    user: 'pannayadav',
    database: 'pannayadav',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var pool = new Pool(config);

var articles = {
   'article-one' : {
      title: 'Article One | Panna Yadav',
      heading: 'Article One',
      date: 'Aug 5, 2017',
      content:`<p>
        This is the content of my first article. This is the content of my first article.
        This is the content of my first article. This is the content of my first article.
        This is the content of my first article. This is the content of my first article.
      </p>
      <p>
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
        </p>
        <p>
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
          This is the content of my first article. This is the content of my first article.
        </p>`
      },
      'article-two' : {
         title: 'Article Two | Panna Yadav',
         heading: 'Article Two',
         date: 'Aug 10, 2017',
         content:`<p>
           This is the content of my second article. This is the content of my second article.
         </p>
         `
       },
       'article-three' : {
          title: 'Article Three | Panna Yadav',
          heading: 'Article Three',
          date: 'Aug 15, 2017',
          content:`<p>
            This is the content of my third article. This is the content of my third article.
          </p>
          `
          }
};

function createTemplate(data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate = `
                  <html>
                    <head>
                      <title>${title}</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <link href="/ui/style.css" rel="stylesheet" />
                    </head>
                    <body>
                      <div class="container">
                        <div>
                        <a href="/">Home</a>
                        </div>
                        <hr/>
                        <h3> ${heading} </h3>
                        <div>
                            ${date}
                        </div>
                        <div>
                          ${content}
                        </div>
                      </div>
                    </body>
                  </html>
                  `;
      return htmlTemplate;
}


app.get('/test-db', function(req, res){
    pool.query('SELECT * FROM USER', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.row));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/panna.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'panna.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
