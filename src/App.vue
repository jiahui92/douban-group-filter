<template>
  <div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <ElButton>管理关键词</ElButton>
    <!-- 黑名单、置顶名单 -->
    <ElButton>订阅新小组</ElButton>

    <ElTabs>
      <ElTabPane v-for="t in tabs" :key="t.id" :label="t.name" />
    </ElTabs>

    <div class="list">
      <a v-for="item in list" :key="item.link" :href="item.link" target="_blank">{{ item.title }}</a>
    </div>

  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'app',
  components: {
    // HelloWorld
  },
  data () {
    return {
      tabs: [
        { name: '11', id: 123 },
        { name: '22', id: 456 },
        { name: '33', id: 789 },
      ],
      list: [],
      importantList: [], // 置顶关键词
      blackList: [], // 黑名单列表，过滤关键词
    }
  },
  mounted () {
    axios.get('/api/discussion/getList').then((res) => {
      const list = res.data.result || [];

      const fn = val => title.indexOf(val) !== -1;
      // 重点关注
      let isImportant = importantList.some(fn);
      // 过滤
      if (!blackList.some(fn)) {
        list.push({
          isImportant,
          title,
          link: $(item).attr('href')
        });
      }

      list.sort((a, b) => a.isImportant > b.isImportant ? -1 : 1);
      this.list = res.data.result;
    })
  }
}
</script>

<style>
body {
  padding: 5rem;
}
</style>

<style lang="less" scoped>
.list {
  a {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
  }
  a:visited {
    color: grey !important;
  }
  .important {
    color: #ff5777;
  }
}
</style>
