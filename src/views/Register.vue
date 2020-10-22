<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      clearable
      @input="checkNickname"
      @clear="clearNickname"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      nickname: "",
      password: "",
      usernameErrMsg: "",
      nicknameErrMsg: "",
      passwordErrMsg: "",
    };
  },
  methods: {
    checkUsername() {
      const reg = /^1\d{3,5}$/;
      if (reg.test(this.username)) {
        this.usernameErrMsg = "";
      } else if (this.username === "") {
        this.usernameErrMsg = "";
      } else {
        this.usernameErrMsg = "用户名格式有误";
      }
    },
    clearUsername() {
      this.usernameErrMsg = "";
    },
    checkNickname() {
      const reg = /^[\u4e00-\u9fa5]{3,7}$/;
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = "";
      } else if (this.nickname === "") {
        this.nicknameErrMsg = "";
      } else {
        this.nicknameErrMsg = "昵称输入有误";
      }
    },
    clearNickname() {
      this.nicknameErrMsg = "";
    },
    checkPassword() {
      const reg = /^\d{2,12}$/;
      if (reg.test(this.password)) {
        this.passwordErrMsg = "";
      } else if (this.password === "") {
        this.passwordErrMsg = "";
      } else {
        this.passwordErrMsg = "密码格式有误";
      }
    },
    clearPassword() {
      this.passwordErrMsg = "";
    },
    async startRegister() {
      if (
        this.username !== "" &&
        this.nickname !== "" &&
        this.password !== "" &&
        this.usernameErrMsg === "" &&
        this.nicknameErrMsg === "" &&
        this.passwordErrMsg === ""
      ) {
        let res = await this.$axios.post("/register", {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        });
        const { message, statusCode } = res.data;
        if (statusCode === 200) {
          this.$toast.success(message);
          this.$router.push({
            path: "/login",
            query: {
              username: this.username,
              password: this.password,
            },
          });
        } else {
          this.$toast.fail(message);
        }
      } else {
        this.$toast.loading("校验失败");
      }
    },
  },
};
</script>

<style>
</style>