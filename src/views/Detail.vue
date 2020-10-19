<template>
  <div>
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div class="follow" @click="unfollow" v-if="detail.has_follow">
          已关注
        </div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <div class="container">
      <div class="title line2">
        性感女歌手拉啊啦性感手拉啊啊啦性感女歌手拉啊啊啦
      </div>
      <div class="name">
        <span>新华网</span>
        <span>2019-10-10</span>
      </div>
      <div
        v-if="detail.type == 1"
        class="content"
        v-html="detail.content"
      ></div>
      <video v-else :src="detail.content" controls></video>
      <div class="bottom">
        <div class="like" @click="like" :class="{ active: detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{ detail.like_length }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`);
      this.detail = res.data.data;
    },
    async unfollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`);
      this.$toast.success(res.data.message);
      this.getDetail();
    },
    async follow() {
      let token = localStorage.getItem("token");
      if (!token) {
        this.$toast("请先登录");
        this.$router.push({
          name: "login",
          params: {
            back: true,
          },
        });
        return;
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`);
      const { message, statusCode } = res.data;
      if (statusCode === 200) {
        this.$toast.success(message);
        this.getDetail();
      }
    },
    async like() {
      let token = localStorage.getItem("token");
      if (!token) {
        this.$toast("请先登录");
        this.$router.push({
          name: "login",
          params: {
            back: true,
          },
        });
        return;
      }
      let res = await this.$axios.get(`/post_like/${this.detail.id}`);
      this.$toast.success(res.data.message);
      this.getDetail();
    },
  },
};
</script>

<style scoped lang="less">
.header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    i {
      font-size: 50px;
    }
  }
  .right {
    width: 80px;
    .follow {
      border: 1px solid #666;
      width: 60px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      border-radius: 12px;
    }
  }
}
.container {
  padding: 10px;
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 70px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 20px;
    }
  }
  .content {
    margin-top: 20px;
  }
}
/deep/ img {
  width: 100%;
}
video {
  width: 100%;
  margin-top: 10px;
}
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  .like {
    height: 30px;
    width: 80px;
    border: 1px solid #000;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    i {
      margin: 0 5px;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}
</style>