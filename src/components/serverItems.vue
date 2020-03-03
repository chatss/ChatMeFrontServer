<template>
  <q-list>
    <q-item
      v-for="(server, index) in servers"
      :key="server.namespace + index"
      clickable
      @click="serverClicked(server.namespace)"
    >
      <q-img :src="urls[index]" spinner-color="white" style="height: 82px; max-width: 82px">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <strong>{{ server.name }}</strong>
          {{ server.name }}
          <em>{{ server.namespace }}</em>
        </q-tooltip>
      </q-img>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "serverItem",
  props: ["servers"],
  created() {
    console.log("serveritems");
    console.log(this.servers);
  },
  computed: {
    urls() {
      const urls = [];
      for (let i = 0; i < this.servers.length; i++) {
        urls.push("https://placeimg.com/500/300/nature?t=" + Math.random());
      }
      return urls;
    }
  },
  methods: {
    serverClicked(nsp) {
      this.$emit("nspChanged", nsp);
    }
  },
  data() {
    return {};
  }
};
</script>
