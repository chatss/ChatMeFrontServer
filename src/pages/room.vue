<template>
  <div class="body">
    <div class="LL">
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline></q-item-label>
            <q-item-label>{{ user }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Server List</q-item-label>

        <q-item
          v-for="(server, index) in servers"
          :key="server + index"
          clickable
          @click="nspChanged(server.namespace)"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth">
              <q-popup-proxy>
                <q-banner class="bg-brown text-white">
                  {{ server.namespace }}
                </q-banner>
              </q-popup-proxy>
            </q-icon>
          </q-item-section>
          <q-item-section>{{ server.name }} </q-item-section>
          <q-item-section side>
            <q-item-label caption>server</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable="">
          <q-item-section avatar>
            <q-icon color="red" name="mdi-plus-box" />
          </q-item-section>
          <q-item-section>
            <q-popup-proxy>
              <q-banner>
                <q-input
                  v-model="newserver"
                  title="Edit the Namespace"
                  v-on:keyup.enter="newServeradd(newserver)"
                  label="type namespace"
                >
                </q-input>
              </q-banner>
            </q-popup-proxy>
            <q-dialog v-model="alert">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Alert</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  {{ alertMessage }}
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="RL">
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px"></div>
      </div>
      <div class="q-pa-md">
        <q-list separator>
          <q-chat-message
            v-for="(chat, index) in chats"
            v-bind="chat"
            :key="chat + index"
            :name="chat.name"
            :text="[chat.message]"
            :sent="chat.name === user"
            size="4"
          />
        </q-list>
      </div>
      <div class="footer">
        <q-item>
          <q-input v-model="message"></q-input>
          <q-btn @click="messageTyped">전송하기</q-btn>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
import Vue from "vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {},
  name: "ChatIndex",

  beforeCreate() {},
  async mounted() {
    this.servers = await this.actServers();
    this.chats = await this.actChats();
    if (!this.getUserinfo) await this.newServeradd(this.$route.query.nsp);
    this.socket.on("new message", msg => {
      console.log("new message in:", msg);
      console.log(this.chats);
      this.chats.push(JSON.parse(msg));
    });
  },
  async created() {
    console.log(this.$route.query);
    console.log(this.getUserinfo);
  },
  async updated() {},
  computed: {
    ...mapGetters("user", ["getUserinfo"]),
    user() {
      return this.getUserinfo || "Anonymous";
    }
  },
  data() {
    return {
      socket: io("http://127.0.0.1:6003/server-101"),
      id: "",
      pwd: "",
      servers: [{ name: "chess", nsp: "121354#fcdqd" }],
      newserver: "",
      chats: [],
      message: "",
      messages: [],
      alert: false,
      alertMessage: ""
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
        name: this.user,
        message: this.message
      });
      this.socket.emit("new message", msg);
      this.message = "";
      if (this.chats.length > 10) this.chats.splice(0, 1);
      this.chats.push(JSON.parse(msg));
    },
    async nspChanged(nsp) {
      console.log("nsp changed");
      console.log(this.socket);
      this.server = `server-${nsp}`;
      this.socket.close();
      this.socket = io(`http://127.0.0.1:6003/server-${nsp}`);
      this.chats = await this.actChats();
    },
    async newServeradd(nsp) {
      //RogJMUiCgK2ROEvohTH0nurq0dHzAr10CNbtO584Qi0=
      try {
        const res = await axios.post("/", {
          query: `mutation {\n  joinServer(nsp: "${nsp}"){\n    id, name, namespace,\n  }\n}`
        });
        console.log(res);
        const newserver = res.data.data.joinServer;
        this.servers.push(newserver);
      } catch (error) {
        console.error("joinServer mutation error", error);
        this.alertMessage = "  Wrong namespace is typed";
        this.alert = true;
      }
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
  flex: 1.5;
  height: 1000px;
  background: orange;
  text-align: center;
}
.RL {
  flex: 5;

  background: skyblue;
}
.RR {
  flex: 2;

  background: #ff0;
}
.footer {
  background: #ff0;
  float: right;
  bottom: 1;
}
</style>
