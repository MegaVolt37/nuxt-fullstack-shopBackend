<template>
  <div>
    <h1>Posts</h1>
    <input type="text" v-model="Text" />
    <button @click="send">send</button>
  </div>
</template>
<script>
export default defineNuxtComponent({
  data() {
    return {
      is: "",
    };
  },
  computed: {
    Text: {
      get() {
        return this.is;
      },
      set(value) {
        this.is = value;
      },
    },
  },
  methods: {
    send() {
      this.$emit("send", this.is);
    },
  },
});
</script>
<style>
</style>