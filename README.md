# douban-group-filter
豆瓣小组增加筛选功能，方便找房

![截屏](https://github.com/jiahui92/douban-group-filter/blob/master/screenshot.jpg)

## 启动
* yarn install
* 启动前端打包服务: yarn server
* 启动node服务: node server/index.js
* http://localhost:8080/

## 部署
* git pull
* yarn build
* pm2 start ecosystem.config.js (只需要第一次部署代码时执行)

## 功能
* 小组管理（新增、删除）
* 置顶关键词管理
* 过滤关键词管理

## 待优化
* 打包优化: npm --> cdn (vue, element-ui)
* 增加“疑似中介”
* pm2

