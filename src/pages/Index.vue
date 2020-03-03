<template>
  <div class="body">
    <div class="logo">
      <q-img
        src="https://cdn.quasar.dev/img/image-src.png"
        srcset="https://cdn.quasar.dev/img/image-1x.png 400w, https://cdn.quasar.dev/img/image-2x.png 800w, https://cdn.quasar.dev/img/image-3x.png 1200w, https://cdn.quasar.dev/img/image-4x.png 1600w"
        sizes="(max-width: 400px) 400w,
              (min-width: 400px) and (max-width: 800px) 800w,
              (min-width: 800px) and (max-width: 1200px) 1200w,
              (min-width: 1200px) 1600w"
        style="height: 280px; max-width: 300px"
      ></q-img>
    </div>
    <div class="title">
      <p>chatme</p>
    </div>
    <div class="description"></div>
    <div class="form">
      <q-input
        class="id"
        rounded
        outlined
        placeholder="id를 입력해주세요"
        bg-color="rgb(141, 152, 211)"
        color="white"
        label="id"
        v-model="id"
      />
      <q-input
        class="password"
        rounded
        outlined
        placeholder="password를 입력해주세요"
        type="password"
        color="white"
        label="pwd"
        v-model="password"
      />
      <p>
        <q-btn
          class="login"
          type="submit"
          text-color="black"
          label="login"
          color="white"
          @click="loginActions"
        >
        </q-btn>
      </p>
      <p>
        <q-btn
          class="find"
          size="12px"
          type="submit"
          flat
          rounded
          label="아이디 찾기"
        ></q-btn>
        <q-btn
          class="find"
          size="12px"
          type="submit"
          flat
          rounded
          label="비밀번호 찾기"
        ></q-btn>
      </p>

      <p>
        <q-btn
          class="find"
          size="12px"
          type="submit"
          flat
          label="제작자"
        ></q-btn>
        <q-btn
          class="find"
          size="12px"
          type="submit"
          flat
          label="개인정보처리방침"
        ></q-btn>
        <q-btn
          class="find"
          size="12px"
          type="submit"
          flat
          label="이용약관"
        ></q-btn>
      </p>
      <p>
        <q-btn
          class="register"
          type="submit"
          text-color="black"
          label="register"
          color="blue"
          @click="registerActions"
        >
        </q-btn>
      </p>
    </div>
    <div class="others"></div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "PageIndex",

  data() {
    return {
      id: "",
      password: "",
      doregister: false
    };
  },
  methods: {
    ...mapActions("user", ["actlogin"]),
    async loginActions() {
      const islogin = await this.actlogin({
        id: this.id,
        password: this.password
      });
      if (islogin) this.$router.push("room");
      else {
        //*todo pop alert
      }
    },
    async registerActions() {
      this.$router.push("register");
    }
  }
};
</script>

<style scoped>
.body {
  text-align: center;
  vertical-align: middle;
  background-color: #7986ca;
}
.form {
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
}
.id {
  float: left;
  width: 240px;
  min-width: 100px;
  background-color: rgb(141, 152, 211);
}
.password {
  float: right;
  width: 240px;
  min-width: 100px;
  background-color: rgb(141, 152, 211);
}
.login {
  margin-top: 10px;
  width: 250px;
}
.find {
  text-decoration-line: underline;
  color: rgba(255, 255, 255, 0.726);
  /* color: rgba(0, 0, 255, 0.753); */
}
.register {
  width: 250px;
}
</style>
