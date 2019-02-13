const express = require('express');
const bodyParser = require('body-parser'); // 효자

const app = express();
const port = 3500;

app.locals.pretty = true;

//express 설정
app.use('/', express.static('public')); // public folder가 root 폴더가 됨.
app.use('/assets', express.static('assets')); // >> 정적인 폴더가 된다.

//bodyparser 설정
app.use(bodyParser.urlencoded({
    extended: true
})); // urlencoded:html의 url로 들어온다. | extended: 계층 구조를 읽어들여라. 
app.use(bodyParser.json()); // extended: 계층 구조를 읽어들여라. 

// pug 경로 잡기
app.set('view engine', 'pug');
app.set('views', './views'); // 현재 app.js가 있는 폴더의 views폴더로 들어간다.
// console.log(__dirname);


// use는 method를 던져서
// set은 setter


app.get('/book', getQuery);
app.get('/book/:id', getQuery);
app.get('/book/:id/:mode', getQuery);

function getQuery(req, res) {
    var params = req.params;
    var pageTits = ["MAIN", "PAGE1", "PAGE2", "PAGE3"];
    if (typeof params.id !== "undefined") {
        if (params.id == 'new') {
            res.render('wr', {
                title: "글쓰기"
            });
        } else {
            res.render('nav', {
                title: "도서목록",
                pages: [
                    {id:0, tit:"홍길동전"},
                    {id:1, tit:"구운몽"},
                    {id:2, tit:"태백산맥"},
                    {id:3, tit:"토끼와거북이"}
                ]
            });
        }
    } else {
        res.send();
    }
};


/* 
app.get('/page', (req, res) => {
    
    var id = req.query.id;
    var pageTits = ["MAIN", "PAGE1", "PAGE2", "PAGE3"];
    var html = `
    <head>
    <title>${pageTits[id]}</title>
    </head>

    <ul>
        <li style = "padding:1rem; list-style:none; float: left; width:20%"><a href="/page?id=0">Main</a></li>
        <li style = "padding:1rem; list-style:none; float: left; width:20%"><a href="/page?id=1">Page1</a></li>
        <li style = "padding:1rem; list-style:none; float: left; width:20%"><a href="/page?id=2">Page2</a></li>
        <li style = "padding:1rem; list-style:none; float: left; width:20%"><a href="/page?id=3">Page3</a></li>

        <li style="clear:both; list-style:none;"></li>
    </ul>
    <div style="text-align:center">
        <h1>${pageTits[id]}</h1>
    </div>
    `;

    res.send(html);

});
*/

/* // 접근을 동적으로 생성. 변수개념이라고 생각하면 된다.
app.get("/book/science", (req, res) => {
    var html = `<h1>과학카테고리입니다!!</h1>`;
    res.send(html);
}); */

app.get("/info", (req, res) => {
    var now = new Date();
    var html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Information</title>
    </head>
    <body>
        <h1>Info page!!</h1>
        <h2>${now}</h2>
    </body>
    </html>
    `;
    res.send(html); // 응답을 보내라

}); // 동적 생성, 따라서 스크립트를 수정해도 서버에 올라가 있어서 now말고는 값이 바뀌지 않는다.
// public에서 수정이되면 즉시 값이 바뀜.

// RESTful node.jss
/* 
app.get('/', (req, res) => res.send('World~ World!'));// router
app.post('/', (req, res) => res.send('World~ World!'));
app.put('/', (req, res) => res.send('World~ World!'));
app.delete('/', (req, res) => res.send('World~ World!')); */

app.listen(port, () => console.log(`http://localhost:${port}`));