<template>
  <div class="body">
    <div class="LL">
      <serverHeader></serverHeader>
      <serverItems
        :servers="servers"
        v-on:nspChanged="nspChanged"
      ></serverItems>
      <serverPlus
        @click.native="serveradd"
        v-on:serveradd="serveradd"
      ></serverPlus>
    </div>
    <div class="LR">LR</div>
    <div class="RL">
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px"></div>
      </div>
      <div class="q-pa-md" style="max-width: 350px">
        <q-list separator>
          <q-chat-message
            v-for="(chat, index) in chats"
            :key="chat + index"
            :name="chat.name"
            :text="[chat.message]"
            sent="chat.name===this.getUserinfo"
          />
        </q-list>
        <q-item>
          <q-input v-model="message"></q-input>
          <q-btn @click="messageTyped">전송하기</q-btn>
        </q-item>
      </div>
    </div>
    <div class="RR">RR</div>
  </div>
</template>

<script>
import axios from "axios";
import serverHeader from "../components/serverHeader";
import serverItems from "../components/serverItems";
import serverPlus from "../components/serverPlus";
import chatMessage from "../components/chatMessage";
import io from "socket.io-client";
import Vue from "vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { messageAA } from "../types/index";

export default {
  components: {
    serverHeader,
    serverItems,
    serverPlus,
    chatMessage
  },
  name: "ChatIndex",

  beforeCreate() {},
  created() {},
  async mounted() {
    this.servers = await this.actServers();
    this.chats = await this.actChats();
    console.log(this.socket);
    this.socket.on("new message", msg => {
      console.log("new message in:", msg);
      console.log(this.chats);
      this.chats.push(JSON.parse(msg));
    });
  },
  async updated() {},
  computed: {
    ...mapGetters("user", ["getUserinfo"])
  },
  data() {
    return {
      socket: io("http://127.0.0.1:6003/server-101"),
      id: "",
      pwd: "",
      servers: [],

      server: "server-101",
      chats: [],
      message: "",
      messages: []
    };
  },
  methods: {
    async actServers() {
      try {
        const res = await axios.post("/", {
          query: `query {\n  myServer(id: "${this.getUserinfo}"){\n    id, name, namespace,\n  }\n}`
        });
        return res.data.data.myServer;
      } catch (err) {
        console.error(err);
      }
    },
    async actChats() {
      try {
        const res = await axios.get(
          `http://127.0.0.1:6003/room?nsp=/${this.server}`
        );
        return res.data.reverse().map(val => JSON.parse(val));
      } catch (err) {
        console.error(err);
      }
    },
    messageTyped(data) {
      const msg = JSON.stringify({
        name: this.getUserinfo,
        message: this.message
      });
      this.socket.emit("new message", msg);
      this.message = "";
    },
    async nspChanged(nsp) {
      console.log("nsp changed");
      console.log(this.socket);
      this.server = `server-${nsp}`;
      this.socket.close();
      this.socket = io(`http://127.0.0.1:6003/server-${nsp}`);
      this.chats = await this.actChats();
    },
    async serveradd(nsp) {
      this.servers = await this.actServers();
    }
  }
};
</script>
<style scoped>
.body {
  display: flex;
}
@media (max-width: 600px) {
  .body {
    display: block;
  }
}
.LL {
  flex: 1;
  height: 1000px;
  background: orange;
  text-align: center;
}
.LR {
  flex: 3;

  background: green;
}
.RL {
  flex: 5;

  background: skyblue;
}
.RR {
  flex: 2;

  background: #ff0;
}
</style>
