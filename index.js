const express = require("express");
const app = express();
const ejs = require("ejs");
const { sequelize, Posts } = require("./database");

//post 전송시 필요한 모듈(미들웨어)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB 연결
sequelize.sync().then(function () {
  console.log("데이터 연결 완료");
});

// ejs를 view 엔진으로 설정
app.set("view engine", "ejs");

// 정적파일 경로 지정
app.use(express.static("public"));

// home
app.get("/", async function (req, res) {
  // db 불러오기
  const posts = await Posts.findAll();
  console.log(JSON.stringify(posts, null, 2));
  res.render("pages/index.ejs", { posts });
});

// about
app.get("/about", function (req, res) {
  res.render("pages/about.ejs");
});
//글쓰기
app.post("/create", async function (req, res) {
  // res.send("응답받음" + req.body.post);
  let post = req.body.post;
  let memo = req.body.memo;
  //테이블명.create(칼럼이름 :값)
  await Posts.create({ post: post, memo: memo });
  res.redirect("/");
});

app.post("/delete/:id", async function (req, res) {
  //get 방식을 쓸시 req.query
  console.log(req.params.id);
  await Posts.destroy({
    where: {
      id: req.params.id, //삭제할 글번호
    },
  });
});
const port = 3001;
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
