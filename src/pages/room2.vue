<template>
  <div class="body">
    <div class="LL">
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline></q-item-label>
            <q-item-label>CurrentLoginID : {{ CurrentLoginID }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />

        <q-item-label header>Server List</q-item-label>
        <q-item
          v-for="(server, index) in MyJoinServers"
          :key="server + index"
          clickable
          @click="OtherServerJoining(server)"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-account-multiple">
              <q-popup-proxy>
                <q-banner class="bg-brown text-white">{{ server.namespace }}</q-banner>
              </q-popup-proxy>
            </q-icon>
          </q-item-section>
          <q-item-section>{{ server.name }}</q-item-section>
          <q-item-section side>
            <q-item-label caption>server</q-item-label>
          </q-item-section>
        </q-item>

        <q-btn @click="ServerJoinButtonClicking">
          <q-icon color="black" name="mdi-magnify" />
          <q-dialog v-model="MdiMangifyButton">
            <q-card>
              <q-card-section>
                <div class="text-h6">Server Join</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input v-model="NewServerNamespace" label="Input Namespace"></q-input>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup @click="newServerJoin()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn>

        <q-btn @click="ServerCreateButtonClicking">
          <q-icon color="red" name="mdi-plus-box" />
          <q-dialog v-model="MdiPlusButton">
            <q-card>
              <q-card-section>
                <div class="text-h6">Server Create</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input v-model="NewServerName" label="Input Server Name"></q-input>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup @click="newServerCreate()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn>
        <q-dialog v-model="alert.on">
          <q-card>
            <q-card-section>
              <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-section class="q-pt-none">{{ alert.message }}</q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-list>
    </div>
    <div class="RL">
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px"></div>
      </div>
      <div class="q-pa-md">
        <q-list separator>
          <q-chat-message
            v-for="(chat, index) in ChatDatas"
            :key="chat + index"
            :name="chat.name"
            :text="[chat.message]"
            :sent="chat.name === CurrentLoginID"
            size="4"
          />
        </q-list>
      </div>
      <div class="footer">
        <q-item>
          <q-input v-model="myMessage"></q-input>
          <q-btn @click="myMessageSending">전송하기</q-btn>
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

// const ENDPOINT = "http://127.0.0.1:6013";
const ENDPOINT = "http://34.97.145.153:6013/#";
export default {
  name: "RoomIndex",
  data() {
    return {
      MdiMangifyButton: false,
      MyJoinServers: [],
      NewServerNamespace: "",
      alert: {
        on: false,
        message: " "
      },
      MdiPlusButton: false,
      NewServerName: "",
      ChatDatas: [],
      myMessage: ""
    };
  },
  async created() {
    this.MyJoinServers = await this.QueryMyJoinServer();
  },
  computed: {
    ...mapGetters("user", ["getUserinfo"]),
    CurrentLoginID() {
      return this.getUserinfo || "Anonymous";
    }
  },
  methods: {
    async QueryMyJoinServer() {
      try {
        const MyJoinServers = [];
        if (this.CurrentLoginID !== "Anonymous") {
          const res = await axios.post("/", {
            query: `query {\n  myServer(id: "${this.CurrentLoginID}"){\n    id, name, namespace,\n  }\n}`
          });
          res.data.data.myServer.map(val => MyJoinServers.push(val));
        }
        if (this.$route.query.nsp) {
          const res = await axios.post("/", {
            query: `mutation {\n  joinServer(nsp: "${this.$route.query.nsp}"){\n    id, name, namespace,\n  }\n}`
          });
          MyJoinServers.push(res.data.data.joinServer);
        }
        return MyJoinServers;
      } catch (err) {
        console.error(err);
      }
    },
    ServerJoinButtonClicking() {
      this.MdiMangifyButton = true;
    },
    async newServerJoin() {
      try {
        const res = await axios.post("/", {
          query: `mutation {\n  joinServer(nsp: "${this.NewServerNamespace}"){\n    id, name, namespace,\n  }\n}`
        });
        if (res.data.errors) {
          this.alert.message = "  Wrong namespace is typed";
          this.alert.on = true;
        } else {
          this.MyJoinServers.push(res.data.data.joinServer);
          this.NewServerNamespace = "";
        }
      } catch (error) {
        console.error("joinServer mutation error", error);
      }
    },
    ServerCreateButtonClicking() {
      this.MdiPlusButton = true;
    },
    async newServerCreate() {
      try {
        const res = await axios.post("/", {
          query: `mutation {\n  createServer(\n    owner:\"${this.getUserinfo}\",\n  \tname: \"${this.NewServerName}\"\n  ){\n    id, name, namespace,\n  } \n}`
        });
        if (res.data.errors) {
          this.alert.message = "  Server creating is faild";
          this.alert.on = true;
        } else {
          this.MyJoinServers.push(res.data.data.createServer);
          this.NewServerNamespace = "";

          this.alert.message =
            ENDPOINT + "/room?nsp=" + res.data.data.createServer.namespace;
          this.alert.on = true;
        }
      } catch (error) {
        console.error("joinServer mutation error", error);
      }
    },
    async OtherServerJoining(server) {
      if (this.socket) this.socket.close();
      this.socket = io(`http://34.97.145.153:6003/server-${server.namespace}`);
      this.ChatDatas = await this.QueryPrevChatData(server.namespace);

      this.socket.on("new message", msg => {
        this.ChatDatas.push(JSON.parse(msg));
      });
    },
    async QueryPrevChatData(namespace) {
      try {
        const res = await axios.get(
          `http://127.0.0.1:6003/room?nsp=${namespace}`
        );
        console.log(res);
        return res.data.reverse().map(val => JSON.parse(val));
      } catch (err) {
        console.error(err);
      }
    },
    myMessageSending() {
      const msg = JSON.stringify({
        name: this.getUserinfo || "Anonymous",
        message: this.myMessage
      });
      console.log(msg);
      this.socket.emit("new message", msg);
      this.myMessage = "";

      if (this.ChatDatas.length > 10) this.ChatDatas.splice(0, 1);
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
  background: rgb(145, 157, 161);
  text-align: center;
}
.RL {
  flex: 5;

  background: rgb(255, 249, 237);
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
