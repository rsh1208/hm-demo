<template>
  <div>
    <hm-header>编辑资料</hm-header>
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt="" />
      <van-uploader
        class="uploader"
        :before-read="beforeDead"
        :after-read="afterRead"
      />
    </div>
    <van-cell-group>
      <van-cell
        title="昵称"
        :value="info.nickname"
        is-link
        @click="showNickname"
      />
      <van-cell title="密码" value="******" is-link />
      <van-cell
        @click="showGender"
        title="性别"
        :value="info.gender === 1 ? '男' : '女'"
        is-link
      />
    </van-cell-group>
    <van-dialog
      @confirm="confirmNickname"
      v-model="isShowNickname"
      title="修改昵称"
      show-cancel-button
    >
      <van-field v-model="nickname" placeholder="请输入新昵称" />
    </van-dialog>
    <van-dialog
      @confirm="confirmGender"
      v-model="isShowGender"
      title="修改性别"
      show-cancel-button
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      isShowNickname: false,
      nickname: "",
      isShowGender: false,
      gender: 0,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      this.$axios.get(`/user/${user_id}`).then((res) => {
        const { statusCode, data, message } = res.data;
        if (statusCode === 200) {
          this.info = data;
        } else {
          this.$toast.fail(message);
        }
      });
    },
    showNickname() {
      this.isShowNickname = true;
      this.nickname = this.info.nickname;
    },
    confirmNickname() {
      if (this.nickname === this.info.nickname) {
        this.$toast("昵称已存在");
        return;
      }
      this.ml_editUser({
        nickname: this.nickname,
      });
    },
    showGender() {
      this.isShowGender = true;
      this.gender = this.info.gender;
    },
    confirmGender() {
      if (this.gender === this.info.gender) {
        return;
      }
      this.ml_editUser({
        gender: this.gender,
      });
    },
    async ml_editUser(data) {
      const user_id = localStorage.getItem("user_id");
      let res = await this.$axios.post(`/user_update/${user_id}`, data);
      this.getInfo();
      this.$toast.success(res.data.message);
    },
    async afterRead(data) {
      const formdata = new FormData();
      formdata.append("file", data.file);
      let res = await this.$axios.post("/upload", formdata);
      this.ml_editUser({
        head_img: res.data.data.url,
      });
    },
    beforeDead(data) {
      console.log(data);
      if (data.size / 1024 / 1024 > 5) {
        this.$toast.success("图片大小不能超过5M");
        return false;
      }
      if (data.type !== "image/jpeg" && data.type !== "image/png") {
        this.$toast.success("图片格式有误");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped lang="less">
.avatar {
  text-align: center;
  margin: 20px 0;
  position: relative;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
  .uploader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}
</style>