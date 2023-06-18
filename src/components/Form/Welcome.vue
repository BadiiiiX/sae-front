<script setup lang="ts">
import {defineEmits} from 'vue';

const emit = defineEmits(["next"]);

const next = () => {
  emit("next");
}

</script>

<template>
  <header>
    <h1 class="uppercase center">Sondage</h1>
    <h3 class="justify">
      Dans le cadre de cette enquête, nous souhaitons recueillir les préférences culinaires de nos utilisateurs.
      <br>Votre contribution nous permettra de mieux comprendre vos goûts et de mieux vous servir. Merci d'avance !
    </h3>
  </header>

  <div class="center full-width">
    <FormKit
        type="button"
        prefix-icon="check"
        label="Commencer"
        @click="next"
    />
  </div>
</template>

<style scoped>
header {
  width: 80%;
  margin: 0 auto 6rem;
}

h3 {
  line-height: 1.5em;
}
</style>

<style>

.full-width .formkit-wrapper {
  width: 100%;
  max-width: 100%;
}

</style>