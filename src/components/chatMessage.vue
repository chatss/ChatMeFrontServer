<template>
  <q-list>
    <q-chat-message :text="text" sent />
  </q-list>
</template>

<script>
export default {
  name: "chatItem",
  props: ["text"],
  updated() {
    console.log(this.message);
  }
};
</script>
