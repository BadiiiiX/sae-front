<script setup lang="ts">
import {defineEmits, nextTick, onMounted} from 'vue';
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

const emit = defineEmits(["next"]);

const next = () => {
  emit("next");
}


const showConfetti = () => {
  confetti.addConfetti()
}
onMounted(() => {
  confetti.addConfetti()
})
</script>

<template>
  <header>
    <h1 class="uppercase center" @click="showConfetti">Merci pour votre participation !</h1>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  margin: 0 auto 6rem;
  cursor: pointer;
  user-select: none;
}

h3 {
  line-height: 1.5em;
}
</style>