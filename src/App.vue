<script setup lang="ts">

import {ref} from "vue";
import Welcome from "./components/Form/Welcome.vue";
import Userdata from "./components/Form/Userdata.vue";
import Selection from "./components/Form/Selection.vue";

const form = ref(2);

const nextForm = () => {
  form.value++;
}

</script>

<template>

  <Welcome v-if="form === 0" @next="nextForm"/>
  <Userdata v-if="form === 1" @next="nextForm"/>
  <Selection v-if="form === 2" @next="nextForm"/>

</template>

<style scoped>
</style>