<template>
  <q-item>
    <q-item-section>{{ message }}</q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "chatItem",
  props: ["message"],
  updated() {
    console.log(this.message);
  }
};
</script>
