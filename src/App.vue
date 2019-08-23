<template>
  <div>

    <div class="filter-line">
      <label>订阅新小组</label>
      <ElSelect v-bind="selectProps" :value="tabs" @change="onFilterChange('tabs', $event)" placeholder="请输入小组id" />
      <a class="extra-tip" href="https://www.douban.com/group/CDzufang/" target="_blank" title="订阅小组的id可以从pc豆瓣小组主页获取，比如从“https://www.douban.com/group/CDzufang/“中复制“CDzufang”，然后输入到左边">
        <i class="el-icon-question"></i>
      </a>
    </div>

    <div class="filter-line">
      <label>设置置顶关键词</label>
      <ElSelect v-bind="selectProps" :value="importantList" @change="onFilterChange('importantList', $event)" placeholder="请输入置顶关键词" />
    </div>

    <div class="filter-line">
      <label>设置屏蔽关键词</label>
      <ElSelect v-bind="selectProps" :value="blackList" @change="onFilterChange('blackList', $event)" placeholder="请输入屏蔽关键词" />
      <i v-if="!isLoading" class="extra-tip">共有{{ cList.length }}个搜索结果</i>
    </div>

    <div class="filter-line">
      <label>显示中介信息</label>
      <ElSwitch :value="isShowAgent" @change="onFilterChange('isShowAgent', $event)" />
    </div>

    <ElTabs v-if="tabs.length > 1" @tab-click="tabClick">
      <ElTabPane v-for="t in tabs" :key="t" :label="t" />
    </ElTabs>

    <div class="list" v-loading="isLoading">
      <div v-for="t in cList" :key="t.link">
        <a :href="t.link" :class="t.className" target="_blank">
          <i v-if="t.isAgent" class="el-icon-question" title="疑为中介（发布多个帖子 或者 豆瓣名称为“豆友xxxx”）"></i>
          {{ t.title }}
        </a>
      </div>
    </div>

    <!-- 返回顶部 -->
    <ElBacktop />

  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'app',
  components: {},
  data () {

    function getStore (field) {
      const s = localStorage.getItem(field);
      return JSON.parse(s);
    }

    let tabs = getStore('tabs') || [];
    tabs = tabs.length ? tabs : ['CDzufang'];

    return {
      selectProps: {
        multiple: true,
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        style: 'width: 15rem'
      },

      isLoading: true,
      cache: {}, // 缓存list数据
      activeTab: tabs[0] || '',
      tabs, // 兜底放一个成都租房小组
      isShowAgent: getStore('isShowAgent'), // 是否显示中介信息
      importantList: getStore('importantList') || [], // 置顶关键词
      blackList: getStore('blackList') || [], // 黑名单列表，过滤关键词
    }
  },

  computed: {
    cList () {
      let cList = [];
      const list = (this.cache[this.activeTab] || []);
      const countObj = {};

      // 发帖计数
      list.forEach(item => {
        countObj[item.authorName] = (countObj[item.authorName] || 0) + 1;
      });

      list.forEach(item => {
        const fn = val => item.title.indexOf(val) !== -1;
        // 黑名单过滤
        if (!this.blackList.some(fn)) {
          // 重点关注
          const isImportant = this.importantList.some(fn);
          const an = item.authorName;
          // 是否“疑似中介”: 发帖次数大于2 或者 名称是“豆友xxx”
          const isAgent = countObj[an] > 2 || an.indexOf(/^豆友\n+$/) !== -1;
          const className = isImportant ? 'important' : '';

          cList.push({
            ...item,
            isImportant,
            isAgent,
            className,
          });
        }
      });

      // 过滤中介信息
      if (!this.isShowAgent) {
        cList = cList.filter(t => !t.isAgent);
      }

      // 重点关注的置顶
      return cList.sort((a, b) => a.isImportant > b.isImportant ? -1 : 1);
    }
  },

  mounted () {
    this.getList();
  },

  methods: {
    // 获取列表数据
    getList () {

      const id = this.activeTab;
      if (this.cache[id]) {
        this.isLoading = false;
        this.list = this.cache[id];
        return;
      }

      this.isLoading = true;
      this.list = [];
      axios({
        url: '/api/discussion/getList',
        params: {
          id,
          maxPage: 10,
        }
      }).then((res) => {
        const data = res.data;
        if (data.success) {
          this.isLoading = false;
          this.$set(this.cache, id, data.result || []);
        } else {
          this.$message({
            center: true,
            type: 'error',
            message: data.msg,
          });
        }
      })
    },

    tabClick (tab) {
      this.activeTab = tab.label;
      this.getList();
    },

    onFilterChange (field, val) {
      this[field] = val;
      localStorage.setItem(field, JSON.stringify(val));
    }
  }
}
</script>

<style>
body {
  padding: 8vw;
}
</style>

<style lang="less" scoped>
.filter-line {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  label {
    text-align: right;
    width: 6rem;
    display: inline-block;
    margin-right: 0.5rem;
  }
  .extra-tip {
    display: inline-block;
    margin-left: 1rem;
    color: grey;
  }
}

.list {
  min-height: 50vh;
  a {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
  }
  a:visited {
    color: grey !important;
  }
  .important {
    color: #ff5777;
  }
  .el-icon-question {
    color: red;
    opacity: 0.5;
  }
}
</style>
