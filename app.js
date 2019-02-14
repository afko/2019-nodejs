const express = require('express');
const bodyParser = require('body-parser'); // 효자
const multer = require('multer');

// db연동
const db = require('./mysql_conn');
const mysql = db.mysql;
const conn = db.conn;

const app = express();
const port = 3500;

/* var upload = multer({
    dest: 'uploads/'
}); */

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // cb가 callback함수
        var date = new Date();
        var getMonth = (month) => {
            if (month + 1 < 10) return "0" + (month + 1);
            else return month + 1;
        }
        var folder = "uploads/book/" + String(date.getFullYear()).substr(2) + getMonth(date.getMonth()) + "/";
        if (!fs.existsSync(folder)) {
            fs.mkdir(folder, (err) => {
                if (!err) cb(null, folder);
            });
        } else {
            cb(null, folder);
        }

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
    fileFilter
});

app.locals.pretty = true;

//express 설정
// static이기 때문에 사용자가 접근 가능
app.use('/', express.static('public')); // public folder가 root 폴더가 됨.
app.use('/assets', express.static('assets')); // >> 정적인 폴더가 된다. 절대 경로로 구현
app.use('/uploads', express.static('uploads'));

//bodyparser 설정
app.use(bodyParser.urlencoded({
    extended: true
})); // urlencoded:html의 url로 들어온다. | extended: 계층 구조를 읽어들여라. 
app.use(bodyParser.json()); // extended: 계층 구조를 읽어들여라. 

// pug 경로 잡기
app.set('view engine', 'pug');
app.set('views', './views'); // 현재 app.js가 있는 폴더의 views폴더로 들어간다.
// console.log(__dirname);

// file을 불러오는 module
const fs = require('fs'); // fs는 file system의 약자. 내장 객체 이다.


// use는 method를 던져서
// set은 setter


app.get('/book', getQuery); // get(router) method로 server에 요청이 들어오면 getQuery 실행.
app.get('/book/:id', getQuery);
app.get('/book/:id/:mode', getQuery);

app.post('/book/create', upload.single('upfile'), postQuery);


function postQuery(req, res, next) {
    var tit = req.body.title;
    var content = req.body.content;
    var str = "";

    fs.readFile('./data/book.json', 'utf-8', function (err, data) {
        if (err) res.status(500).send("Internal server error");
        datas = JSON.parse(data);
        var id = datas.books[datas.books.length - 1].id + 1
        datas.books.push({
            tit,
            content,
            id
        });
        str = JSON.stringify(datas);

        var sql = " INSERT INTO books SET  title=?, content=?, filename=? ";
        var params = [tit, content, req.file.filename];

        conn.query(sql, params, (err, rows, field) => {
            if (err) {
                console.log(err);
            } else {
                console.log(rows);
            }
        });

        fs.writeFile('./data/book.json', str, (err) => {
            if (err) res.status(500).send("Internal server error");
            else {
                // redirect 방법
                // #1
                // res.send(`<script>location.href="/book/${id}"</script>`);
                // #2
                res.redirect("/book/" + id);
                // #3 express 안 쓸때
                /* res.writeHead(301, {
                    Location: '/book/' + id
                });
                res.end(); */

            }
        });
    });

}

function getQuery(req, res) {
    var params = req.params;
    var datas = null;

    fs.readFile('./data/book.json', 'utf-8', function (err, data) {
        if (err) res.status(500).send("Internal server error"); // 에러면 반응을 해라.
        datas = JSON.parse(data);
        var pugData = {
            pages: datas.books
        };

        if (typeof params.id !== "undefined") {
            if (params.id == 'new') {
                pugData.title = "신규 글 등록";
                res.render('wr', pugData);
            } else {
                pugData.title = "도서목록";
                res.render('li', pugData);
            }
        } else {
            res.send('');
        }
    });

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

});

// multer 확장자 체크
function fileFilter(req, file, cb) {
    var filename = file.originalname.split('.');
    var ext = filename[filename.length - 1];
    var allowExt = "jpg | gif | jpeg | png";
    if (allowExt.includes(ext)) cb(null, true);
    else cb(null, false);
}



// 동적 생성, 따라서 스크립트를 수정해도 서버에 올라가 있어서 now말고는 값이 바뀌지 않는다.
// public에서 수정이되면 즉시 값이 바뀜.

// RESTful node.jss
/* 
app.get('/', (req, res) => res.send('World~ World!'));// router
app.post('/', (req, res) => res.send('World~ World!'));
app.put('/', (req, res) => res.send('World~ World!'));
app.delete('/', (req, res) => res.send('World~ World!')); */


app.listen(port, () => console.log(`http://localhost:${port}`));

console.log()