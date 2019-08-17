const axios = require('axios');
const cheerio = require('cheerio');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const iconv = require('iconv-lite');

let result = [];
const list = [];
const arr = [];
// const doubanUrl = 'http://www.douban.com/group/145219/discussion?start='; // 杭州租房中介免入
const doubanUrl = 'http://www.douban.com/group/560075/discussion?start='; // 西湖区租房

let timer = null;
let page = 0;
let maxPage = 10;

timer = setInterval(() => {

  if (page === maxPage) {
    clearInterval(timer);
    return;
  }

  console.log(`${page + 1} / ${maxPage}`);

  axios.request({
      url: doubanUrl + page * 25,
      headers: {
        'Host': 'www.douban.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
      }
  }).then(res => {

    const $ = cheerio.load(res.data, {decodeEntities: false});
    const domList = $('table.olt tr:not(.th)') || []; // 获取table每一行
    domList.each((i, item) => {
      const arr = $(item).find('a');
      const $title = $(arr[0]);
      const $author = $(arr[1]);
      list.push({
        title: $title.html(),
        link: $title.attr('href'),
        authorName: $author.html(), // 方便后续识别中介
        authorLink: $author.attr('href')
      });
    });
  });

  page++;

}, 1000);

router.get('/api/discussion/getList', ctx => {
  ctx.body = list;
})

app.use(router.routes());

app.listen(3000);
