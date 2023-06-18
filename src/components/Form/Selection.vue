<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {computedAsync, useAsyncState} from "@vueuse/core";

const apiUrl = "http://localhost:3000";

const {state: categories, isReady: categoriesIsReady, isLoading: categoriesIsLoading} = useAsyncState(
    axios
        .get(`${apiUrl}/category/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: aliments, isReady: alimentsIsReady, isLoading: alimentsIsLoading} = useAsyncState(
    axios
        .get(`${apiUrl}/aliment/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const chosenCategories = ref([]);

const alimentsToShow = ref([]);

const getCategories = () => {
  return categories.value.map(t => {
    return {
      label: t.name,
      value: t.code
    }
  })
}

const getAliments = () => {
  if(chosenCategories.value.length === 0) {
    return [];
  }
  const res = aliments.value
      .filter(t => { return chosenCategories.value.includes(t.category.code) || chosenCategories.value.includes(t.subCategory.code) || chosenCategories.value.includes(t.subSubCategory.code) })
      .map(t => {
        return {
          label: t.name,
          value: t.code
        }
      })
  console.log(chosenCategories.value);
  console.log(res);

  return res
}

</script>

<template>
  <header>
    <h2 class="uppercase">Vos choix</h2>
    <h3 class="justify">Afin de remplir le formulaire, veuillez choisir vos dix aliments préférés.</h3>
  </header>

  <pre>{{alimentsToShow}}</pre>


  <FormKit
      type="form"
      #default="{ value }"
      :actions="false"
  >
    <FormKit
        v-if="categoriesIsReady"
        type="taglist"
        name="categoryFilter"
        label="Filtrez par catégorie"
        :options="getCategories"
        v-model="chosenCategories"
        :close-on-select="false"
        @input="alimentsToShow = getAliments()"
    />

    <FormKit
        name="aliments"
        type="transferlist"
        help="Veuillez filtrer par la catégorie que vous souhaitez avant de sélectionner vos aliments."
        source-label="Aliments"
        target-label="Vos Aliments"
        source-empty-message="Aucun aliment, chargement en cours..."
        target-empty-message="Choisissez vos aliments favoris"
        searchable
        :options="alimentsToShow"
        max="10"
        placeholder="Sélectionnez vos aliments"
    />

  </FormKit>
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