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
      <div>
        <q-input
          rounded
          class="id"
          outlined
          placeholder="name을 입력해주세요"
          color="white"
          label="name"
          v-model="name"
        />
        <q-input
          rounded
          outlined
          class="password"
          placeholder="email을 입력해주세요"
          color="white"
          label="email"
          v-model="email"
        />
      </div>
      <p>
        <q-btn
          class="register"
          type="submit"
          text-color="black"
          label="register"
          color="blue"
          @click="registerActions"
        ></q-btn>
      </p>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">{{ alertMessage }}</q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <p>
        <q-btn class="find" size="12px" type="submit" flat label="제작자"></q-btn>
        <q-btn class="find" size="12px" type="submit" flat label="개인정보처리방침"></q-btn>
        <q-btn class="find" size="12px" type="submit" flat label="이용약관"></q-btn>
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
      name: "",
      email: "",
      success: false,
      alert: false,
      alertMessage: ""
    };
  },
  methods: {
    ...mapActions("user", ["actlogin"]),
    async loginActions() {
      const islogin = await this.actlogin({
        id: this.id,
        password: this.password
      });
      if (islogin) this.$router.push("chat");
      else {
        //*todo pop alert
      }
    },
    async registerActions() {
      try {
        const res = await axios.post("/", {
          query: `mutation {\n  register(\n  \tid: "${this.id}"\n    password: "${this.password}"\n    name: "${this.name}"\n    email: "${this.email}"\n  )\n}`
        });
        this.success = res.data.data.register;
        if (this.success) this.alertMessage = "register success!";
        else this.alertMessage = "register fail";
        this.alert = true;
      } catch (err) {
        console.error(err);
        this.alertMessage = "register success!";
      }
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
