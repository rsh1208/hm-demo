<template>
  <div>
    <hm-header>个人中心</hm-header>
    <div class="info">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt="" />
      </div>
      <div class="center">
        <div class="nickname">
          <i v-if="info.gender === 1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          {{ info.nickname }}
        </div>
        <div class="date">{{ info.create_date | date }}</div>
      </div>
    </div>
    <van-cell-group>
      <van-cell
        title="我的关注"
        is-link
        value="关注的用户"
        @click="$router.push('/my-follow')"
      />
      <van-cell
        title="我的跟帖"
        is-link
        value="跟帖/回复"
        @click="$router.push('/my-comment')"
      />
      <van-cell title="我的收藏" is-link value="文档/视频" />
      <van-cell title="设置" is-link @click="$router.push('/edit')" />
      <van-cell title="退出" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    let res = await this.$axios.get(`/user/${user_id}`);
    const { data, message, statusCode } = res.data;
    if (statusCode === 200) {
      this.info = data;
    } else {
      this.$toast.fail(message);
    }
  },
  methods: {
    async logout() {
      try {
        await this.$dialog.confirm({
          title: "温馨提示",
          message: "您确认要退出嘛",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        this.$toast.success("退出成功");
        this.$router.push("/login");
      } catch (error) {
        console.log("取消");
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  height: 100px;
  border-bottom: 2px solid #ccc;
  align-items: center;
  padding: 0 20px;
  display: flex;
  .left {
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .center {
    flex: 1;
    height: 50px;
    line-height: 25px;
    font-size: 14px;
    padding-left: 20px;
  }
}
</style>