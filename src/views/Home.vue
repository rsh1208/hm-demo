<template>
  <div>
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/user')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <van-sticky z-index="999"
      ><div class="container" @click="$router.push('/tabsedit')">
        <i class="iconfont iconjiantou1"> </i></div
    ></van-sticky>
    <van-tabs v-model="active" sticky>
      <van-tab :title="item.name" v-for="item in list" :key="item.id">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
          ><van-list
            v-model="loading"
            @load="onLoad"
            :immediate-check="false"
            :finished="finished"
            finished-text="我可是有底线的"
            ><hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for="(post, index) in postList"
              :key="index"
              :post="post"
            ></hm-post></van-list
        ></van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      list: [],
      postList: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 5,
      isLoading: true,
    };
  },
  created() {
    this.getTabsList();
  },
  watch: {
    active(newVal) {
      this.postList = [];
      this.pageIndex = 1;
      this.loading = true;
      this.finished = false;
      this.getPostList(this.list[newVal].id);
    },
  },
  methods: {
    async getTabsList() {
      let res = await this.$axios.get("/category");
      this.list = res.data.data;
      this.getPostList(this.list[this.active].id);
    },
    async getPostList(id) {
      let res = await this.$axios.get("/post", {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      });
      this.postList = [...this.postList, ...res.data.data];
      this.loading = false;
      if (res.data.data.length < this.pageSize) {
        this.finished = true;
      }
      this.isLoading = false;
    },
    onLoad() {
      console.log("触底了");
      this.pageIndex++;
      this.getPostList(this.list[this.active].id);
    },
    onRefresh() {
      console.log("下拉刷新");
      this.postList = [];
      this.pageIndex = 1;
      this.loading = true;
      this.finished = false;
      this.getPostList(this.list[this.active].id);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-tabs__nav {
  background-color: #ccc;
  margin-right: 40px;
}
.container {
  width: 40.5px;
  height: 44px;
  background-color: #ccc;
  line-height: 44px;
  text-align: center;
  color: #000;
  position: absolute;
  right: 0;
  z-index: 999;
}
.header {
  height: 40px;
  background: #f00;
  display: flex;
  text-align: center;
  color: #fff;
  align-items: center;
  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 26px;
  }
  .iconsearch {
    margin-right: 10px;
  }
  .center {
    flex: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
  }
}
</style>
