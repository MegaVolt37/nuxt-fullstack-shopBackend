<template>
  <div>
    <post @send="send" />
    <div v-for="post in hello" :key="post">
      <p>{{ post.id }}</p>
      <span>{{ post.text }}</span>
    </div>
  </div>
</template>
<script>
export default defineNuxtComponent({
  computed: {
    M() {
      console.log(this.hello);
      return this.hello;
    },
  },
  methods: {
    send(value) {
      console.log(value);
      $fetch("/api/posts", {
        method: "POST",
        body: { text: value },
      }).then(() => {
        // this.hello = await $fetch("http://localhost:5000/api/posts");
      });
    },
  },
  async asyncData() {
    return { hello: await $fetch("http://localhost:5000/api/posts") };
  },
});
</script>
