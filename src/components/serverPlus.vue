<template>
  <div>
    <p>
      <q-img class="plus" src="statics/icons/plus.svg">
        <q-popup-proxy>
          <q-banner>
            <q-input
              class="name"
              rounded
              outlined
              placeholder="서버이름을 입력해주세요"
              color="white"
              label="name"
              v-model="name"
            />
            <q-btn
              class="create"
              type="submit"
              text-color="black"
              label="create"
              color="blue"
              @click="serveradd"
            />

            <q-btn
              class="join"
              type="submit"
              text-color="black"
              label="join"
              color="blue"
              @click="serverjoin"
            />
          </q-banner>
        </q-popup-proxy>
      </q-img>
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      name: "",
      nsp: ""
    };
  },
  computed: {
    ...mapGetters("user", ["getUserinfo"])
  },
  methods: {
    async serveradd() {
      console.log(this.name, this.getUserinfo);
      const res = await axios.post("/", {
        query: `mutation {\n  createServer(\n    name: \"${this.name}\",\n    owner:\"${this.getUserinfo}\"\n  )\n}`
      });
      this.$emit("serveradd");
    },
    async serverjoin() {
      console.log(this.name, this.getUserinfo);
      const res = await axios.post("/", {
        query: `mutation {\n  joinServer(\n    nsp: "${this.nsp}"\n  ){\n    id, namespace\n  }\n}`
      });
      this.$emit("serveradd");
    }
  }
};
</script>

<style scoped>
.plus {
  width: "92px";
}
</style>
