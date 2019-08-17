<template>
  <div>

    <div class="filter-line">
      <label>订阅新小组</label>
      <ElSelect v-bind="selectProps" :value="tabs" @change="onFilterChange('tabs', $event)" placeholder="请输入小组id" />
    </div>

    <div class="filter-line">
      <label>设置置顶关键词</label>
      <ElSelect v-bind="selectProps" :value="importantList" @change="onFilterChange('importantList', $event)" placeholder="请输入置顶关键词" />
    </div>

    <div class="filter-line">
      <label>设置屏蔽关键词</label>
      <ElSelect v-bind="selectProps" :value="blackList" @change="onFilterChange('blackList', $event)" placeholder="请输入屏蔽关键词" />
      <i class="extra-tip">共有{{ cList.length }}个搜索结果</i>
    </div>

    <ElTabs v-if="tabs.length > 1">
      <ElTabPane v-for="t in tabs" :key="t" :label="t" />
    </ElTabs>

    <div class="list" v-loading="isLoading">
      <div v-for="item in cList" :key="item.link">
        <a :href="item.link" :class="item.className" target="_blank">{{ item.title }}</a>
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
      return s ? JSON.parse(s) : [];
    }

    return {
      selectProps: {
        multiple: true,
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true
      },

      isLoading: true,
      list: [],
      tabs: getStore('tabs'),
      importantList: getStore('importantList'), // 置顶关键词
      blackList: getStore('blackList'), // 黑名单列表，过滤关键词
    }
  },
  computed: {
    cList () {
      const list = [];

      this.list.forEach(item => {
        const fn = val => item.title.indexOf(val) !== -1;
        // 黑名单过滤
        if (!this.blackList.some(fn)) {
          // 重点关注
          const isImportant = this.importantList.some(fn);
          list.push({
            ...item,
            isImportant,
            className: isImportant ? 'important' : '',
          });
        }
      });

      // 重点关注的置顶
      return list.sort((a, b) => a.isImportant > b.isImportant ? -1 : 1);
    }
  },
  mounted () {
    axios.get(`/api/discussion/getList?id=CDzufang&maxPage=11`).then((res) => {
      const data = res.data;
      if (data.success) {
        this.isLoading = false;
        this.list = data.result || [];
      } else {
        this.$message({
          center: true,
          type: 'error',
          message: data.msg,
        });
      }
    })
  },
  methods: {
    onFilterChange (field, val) {
      this[field] = val;
      localStorage.setItem(field, JSON.stringify(val));
    }
  }
}
</script>

<style>
body {
  padding: 5rem;
}
</style>

<style lang="less" scoped>
.filter-line {
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  label {
    text-align: right;
    width: 6rem;
    display: inline-block;
    margin-right: 0.5rem;
  }
  .extra-tip {
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
  }
  a:visited {
    color: grey !important;
  }
  .important {
    color: #ff5777;
  }
}
</style>
