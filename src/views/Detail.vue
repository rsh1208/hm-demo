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
        {{ detail.title }}
      </div>
      <div class="name">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date("YYYY-MM-DD HH:mm") }}</span>
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
    <div ref="box"></div>
    <hm-comment
      v-for="comment in commentsList"
      :key="comment.id"
      :comment="comment"
    ></hm-comment>
    <div class="footer">
      <div class="input" v-if="!isShow">
        <div class="left">
          <input type="text" @focus="handleFocus" placeholder="写跟帖" />
        </div>
        <div class="center">
          <van-icon name="chat-o" :badge="detail.comment_length"></van-icon>
        </div>
        <div class="right" @click="star">
          <van-icon
            name="star-o"
            :class="{ active: detail.has_star }"
          ></van-icon>
        </div>
      </div>
      <div class="textarea" v-else>
        <div class="left">
          <textarea
            v-model="content"
            ref="textarea"
            @blur="handleBlur"
            :placeholder="replyName ? '回复：' + replyName : '请输入内容'"
          ></textarea>
        </div>
        <div class="right">
          <div class="send" @touchstart="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {},
      },
      commentsList: {},
      isShow: false,
      replyId: "",
      replyName: "",
      content: "",
    };
  },
  created() {
    this.getDetail();
    this.getComments();
    this.$bus.$on("reply", async (replyId, replyName) => {
      this.replyId = replyId;
      this.replyName = replyName;
      this.isShow = true;
      await this.$nextTick();
      this.$refs.textarea && this.$refs.textarea.focus();
    });
  },
  beforeDestroy() {},
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
    async getComments() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`);
      this.commentsList = res.data.data;
    },
    async handleFocus() {
      this.isShow = true;
      await this.$nextTick();
      this.$refs.textarea.focus();
    },
    handleBlur() {
      this.isShow = false;
      if (!this.content) {
        this.replyId = "";
        this.replyName = "";
      }
    },
    async send() {
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      );
      const { statusCode, message } = res.data;
      if (statusCode === 200) {
        this.$toast.success(message);
        this.getComments();
        this.content = "";
        this.replyId = "";
        this.replyName = "";
        this.isShow = false;
        let element = this.$refs.box;
        element.scrollIntoView();
      }
    },
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`);
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
.comments {
  border-top: 3px solid #ccc;
  padding-bottom: 40px;
}
.footer {
  background: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    height: 40px;
    display: flex;
    .left {
      flex: 1;
      // background: red;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        height: 30px;
        width: 80%;
        border: none;
        border-radius: 15px;
        background: #ddd;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .active {
      color: #f00;
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        background: #f00;
        color: #fff;
        width: 40px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>