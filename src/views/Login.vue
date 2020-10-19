<template>
  <div>
    <hm-header>登录</hm-header>
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
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />
    <hm-button @click.native="startLogin">登录</hm-button>
    <div class="link">
      如果没有账号,请点击<router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "", // 用户名
      password: "", // 密码
      usernameErrMsg: "",
      passwordErrMsg: "",
    };
  },
  created() {
    const { password, username } = this.$route.query;
    if ((password, username)) {
      this.username = username;
      this.password = password;
    }
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
    clearUsername() {
      this.usernameErrMsg = "";
    },
    clearPassword() {
      this.passwordErrMsg = "";
    },
    async startLogin() {
      try {
        await this.$dialog.confirm({
          title: "提示",
          message: "登录吗?",
        });

        console.log("确定");

        let res = await this.$axios.post("/login", {
          username: this.username,
          password: this.password,
        });

        console.log("登录结果", res);
        const { statusCode, message, data } = res.data;

        // 1. 保存token + 用户id
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.id);

        // 2. 提示
        this.$toast.success(message);

        // 3. 跳转
        if (this.$route.params.back) {
          // 3.1 登录完返回   /detail ==> /login
          this.$router.back();
        } else {
          // 3.2 登录去/user  直接访问的/login => /user
          this.$router.push("/user");
        }
      } catch (error) {
        console.log("取消");
      }
    },
    async startLogin1() {
      if (
        this.username !== "" &&
        this.password !== "" &&
        this.usernameErrMsg === "" &&
        this.passwordErrMsg === ""
      ) {
        let res = await this.$axios.post("/login", {
          username: this.username,
          password: this.password,
        });
        const { statusCode, message, data } = res.data;
        if (statusCode === 200) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user.id);
          this.$toast.success(message);
          this.$router.push("/user");
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
.link {
  text-align: right;
  padding-right: 20px;
  font-size: 14px;
}
</style>