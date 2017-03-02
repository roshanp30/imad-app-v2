var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
var Pool =require('pg').Pool;

var config={
  user:'roshanp30',
  database:'roshanp30',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD,
  
};
app.use(morgan('combined'));

var articles={
        'article-one':{
        title:"Article one|Roshan Patil",
        heading:"Article one",
        date:"19 Feb 2017",
        content:` <p>This is content of my first article.Yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    </p>
                    <p>This is content of my first article.Yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    </p>
                    <p>This is content of my first article.Yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    </p>`
    },
    'article-two':{
            title:"Article two|Roshan Patil",
        heading:"Article two",
        date:"20 Feb 2017",
        content:` <p>This is content of my second article.Yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    </p>`
    },
     'article-three':{
            title:"Article three|Roshan Patil",
        heading:"Article three",
        date:"21 Feb 2017",
        content:` <p>This is content of my third article.Yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    </p>`
    }
};
function createTemplate (data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    var htmlTemplate=
    `<html>
        <head>
            <title>${title}</title>
            <meta name="viewport" content="width-device-width,initial-scale-1"/>
             <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>${heading}</h3>
                <div>${date}</div>
                <div>
                   ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}




var pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/test-db',function (req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err,toString());
        }
        else{
            res.send(JSON.stringify(result));
        }
    });
    
});
app.get('/:articleName',function(req,res)
{
 var articleName = req.params.articleName;
 pool.query("SELECT * FROM artice where title= '"+req.params.articeName+"'",function(err,result){
     if(err){
            res.status(500).send(err,toString());
        }
        else{
            if(result.row.length===0)
                res.status(404).send('Article not found');
                else
                {
                    var articleData=result.row[0];
                    res.send(createTemplate(articleData));
                }
        }
 });
 //res.send(createTemplate(articleData));
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
