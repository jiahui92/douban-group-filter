<template>
  <div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <ElButton>管理关键词</ElButton>
    <!-- 黑名单、置顶名单 -->
    <ElButton>订阅新小组</ElButton>

    <ElTabs>
      <ElTabPane label="11" />
      <ElTabPane label="22" />
      <ElTabPane label="33" />
    </ElTabs>

    <div class="list">
      <a v-for="item in list" :key="item.title" :href="item.link" target="_blank">{{ item.title }}</a>
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
      list: [
        { title: 'xxxxx1', link: 'https://www.douban.com/group/CDzufang/' },
        { title: 'xxxxx2', link: 'https://www.douban.com/group/CDzufang/' },
        { title: 'xxxxx3', link: 'https://www.douban.com/group/CDzufang/' },
      ]
    }
  },
  mounted () {
    axios.get('https://api.douban.com/v2/target/560075/discussions').then((res) => {
      console.log(res);
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
    margin-bottom: 5px;
    font-size: 14px;
    display: block;
  }
  a:visited {
    color: grey !important;
  }
  .important {
    color: #ff5777;
  }
}
</style>
