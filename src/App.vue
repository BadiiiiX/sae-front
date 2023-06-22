<script setup lang="ts">

import {ref} from "vue";
import Welcome from "./components/Form/Welcome.vue";
import Userdata from "./components/Form/Userdata.vue";
import Selection from "./components/Form/Selection.vue";

const form = ref(0);

const nextForm = () => {
  form.value++;
}

</script>

<template>

  <div v-auto-animate>
    <Welcome v-if="form === 0" @next="nextForm"/>
    <Userdata v-if="form === 1" @next="nextForm"/>
    <Selection v-if="form === 2" @next="nextForm"/>
  </div>

</template>

<style scoped>
button {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin: 1rem;
}
</style>