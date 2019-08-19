const axios = require('axios');
const cheerio = require('cheerio');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const { handleApiReturn } = require('./util.js');

const getDiscussionList = (id = 'CDzufang', maxPage = 10) => {
  return new Promise((resolve, reject) => {
    let timer = null;
    let page = 0;
    const list = [];
    const doubanUrl = `http://www.douban.com/group/${id}/discussion?start=`; // 西湖区租房

    timer = setInterval(() => {

      if (page == maxPage) {
        clearInterval(timer);
        resolve(list);
        return;
      }

      console.log(`${page + 1} / ${maxPage}`);
      
      // 抓包
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

          // 返回的信息
          list.push({
            title: $title.attr('title'),
            link: $title.attr('href'),
            authorName: $author.html(), // 方便后续识别中介
            authorLink: $author.attr('href')
          });
        });
      }).catch(e => {
        clearInterval(timer);
        console.error(e.message);
        reject(e);
      });

      page++;

    }, 300);
  })
}

router.get('/api/discussion/getList', async (ctx) => {
  const q = ctx.query;
  await getDiscussionList(q.id, q.maxPage).then((list) => {
    handleApiReturn(ctx, list);
  }).catch((err) => {
    handleApiReturn(ctx, [], err.message);
  })
})

app.use(router.routes());

app.listen(3333);
