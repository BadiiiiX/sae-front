<script setup lang="ts">

import {ref} from "vue";
import Welcome from "./components/Form/Welcome.vue";
import Userdata from "./components/Form/Userdata.vue";
import Selection from "./components/Form/Selection.vue";
import End from "./components/End.vue";

const formStep = ref(0);

const formData = ref( {user: {}, aliments: []});

const nextForm = () => {
  formStep.value++;
}

</script>

<template>
  <div v-auto-animate>
    <Welcome v-if="formStep === 0" @next="nextForm"/>
    <Userdata v-if="formStep === 1" @next="nextForm" :form-data="formData"/>
    <Selection v-if="formStep === 2" @next="nextForm" :form-data="formData"/>
    <End v-if="formStep === 3"/>
  </div>
</template>

<style scoped>
button {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin: 1rem;
}
</style>