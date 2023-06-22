<script setup lang="ts">

import {defineEmits, ref, watchEffect} from "vue";
import axios from "axios";
import {asyncComputed, computedAsync, useAsyncState} from "@vueuse/core";

const emit = defineEmits(["next"]);

const next = () => {
  emit("next");
}

const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const selectedSubSubCategory = ref(null);
const haveSubElements = ref(false);
const selectedAliments = ref([]);
const subCategoryHaveSubSubCategories = [];

const props = defineProps(['formData'])

const {state: aliments, isReady: alimentsIsReady, isLoading: alimentsIsLoading} = useAsyncState(
    axios
        .get(`${import.meta.env.VITE_API_URL}/aliment/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: categories, isReady: categoriesIsReady, isLoading: categoriesIsLoading} = useAsyncState(
    axios
        .get(`${import.meta.env.VITE_API_URL}/category/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: subCategories, isReady: subCategoriesIsReady, isLoading: subCategoriesIsLoading} = useAsyncState(
    axios
        .get(`${import.meta.env.VITE_API_URL}/subcategory/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: subSubCategories, isReady: subSubCategoriesIsReady, isLoading: subSubCategoriesIsLoading} = useAsyncState(
    axios
        .get(`${import.meta.env.VITE_API_URL}/subsubcategory/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const getCategories = computedAsync(() => categories.value.map((t: any) => ({label: t.name, value: t.code})));

const getSubCategories = computedAsync(() => subCategories.value
    .filter((t: any) => {
      if (Array.isArray(selectedCategory.value)) {
        return (selectedCategory.value as any[]).includes(t.code.slice(0, 2))
      }

      return []
    })
    .map((t: any) => ({label: t.name, value: t.code})));

const getSubSubCategories = computedAsync(() => subSubCategories.value
    .filter((t: any) => {
      if (Array.isArray(selectedSubCategory.value)) {
        if ((selectedSubCategory.value as any[]).includes(t.code.slice(0, 4))) {
          subCategoryHaveSubSubCategories.push(t.code.slice(0, 4))
        }
        return (selectedSubCategory.value as any[]).includes(t.code.slice(0, 4))
      }

      return []
    })
    .map((t: any) => ({label: t.name, value: t.code})));

const alimentListToShow = asyncComputed(async () => {
  const codes = [...(selectedSubCategory.value ?? []), ...(selectedSubSubCategory.value ?? [])]
      .filter(code => !subCategoryHaveSubSubCategories.includes(code));

  const setCodes = new Set();
  const toReturn = [];

  for (const code of codes) {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/aliment/search/${code}`);
    res.data.forEach((t: any) => {
      if (!setCodes.has(t.code)) {
        setCodes.add(t.code);
        toReturn.push({label: t.name, value: t.code})
      }
    })
  }

  return toReturn;
})

const loadAliment = async (code, cachedOption) => {
  if (cachedOption.hasLoaded) return cachedOption

  const aliment = aliments.value.find((t: any) => t.code === code)
  if (aliment) {
    return {
      name: aliment.name,
      label: aliment.name,
      value: aliment.code,
      hasLoaded: true,
    }
  }
}

const resetIfEmpty = (v: string[], _node: any) => {
  if (v === null || v.length === 0) {
    selectedSubCategory.value = null;
    selectedSubSubCategory.value = null;
  }
}

watchEffect(() => {
  selectedSubCategory.value;

  if (getSubSubCategories.value === undefined) {
    haveSubElements.value = false
    return;
  }

  haveSubElements.value = getSubSubCategories.value.length > 0
})

const sendForm = () => {
  props.formData.aliments = selectedAliments.value;

  const user = JSON.parse(JSON.stringify(props.formData.user));

  let userId = 0;

  axios
      .post(`${import.meta.env.VITE_API_URL}/user/create`, user)
      .then((res) => {
        userId = res.data.id
      })
      .then(() => {
        for (const aliment of selectedAliments.value) {
          axios.post(`${import.meta.env.VITE_API_URL}/survey/create`, {
            userId,
            alimentCode: aliment,
          })
        }
      }).then(() => {

        next();

  })
}

</script>

<template>
  <header>
    <h2 class="uppercase center">Vos choix</h2>
    <h3 class="justify">Afin de remplir le formulaire, veuillez choisir vos dix aliments préférés.</h3>
  </header>

  <FormKit
      type="form"
      :actions="false"
      @submit="sendForm"
  >
    <FormKit
        v-if="categoriesIsReady"
        v-model="selectedCategory"
        type="taglist"
        name="categoryFilter"
        label="Filtrez par catégorie"
        :options="getCategories"
        @input="resetIfEmpty"
    />

    <FormKit
        v-if="subCategoriesIsReady && selectedCategory !== null && selectedCategory.length > 0"
        type="taglist"
        name="subCategoryFilter"
        label="Filtrez par sous-catégorie"
        :options="getSubCategories"
        v-model="selectedSubCategory"
        @input="resetIfEmpty"
    />

    <FormKit
        v-if="subSubCategoriesIsReady && selectedSubCategory !== null && selectedSubCategory.length > 0 && haveSubElements"
        type="taglist"
        v-model="selectedSubSubCategory"
        name="subSubCategoryFilter"
        label="Filtrez par sous-sous-catégorie"
        :options="getSubSubCategories"

    />
    <FormKit
        v-if="selectedAliments.length > 0 || (selectedSubCategory !== null && selectedSubCategory.length > 0 && (!haveSubElements || selectedSubSubCategory !== null && selectedSubSubCategory.length > 0))"
        name="aliments"
        type="transferlist"
        label="Choisissez vos aliments favoris"
        source-label="Aliments disponible"
        target-label="Aliments selectionnés"
        target-empty-message="Aucun aliment selectionné"
        :options="alimentListToShow"
        v-model="selectedAliments"
        :option-loader="loadAliment"
        max="10"
    />

    <div class="center full-width">
      <FormKit
          v-if="selectedAliments.length > 0 || (selectedSubCategory !== null && selectedSubCategory.length > 0 && (!haveSubElements || selectedSubSubCategory !== null && selectedSubSubCategory.length > 0))"
          type="submit"
          :prefix-icon="selectedAliments.length < 10 ? 'close' : 'check'"
          :label="selectedAliments.length < 10 ? `Il vous reste ${10 - selectedAliments.length} aliments à choisir` : 'Envoyer !'"
          :disabled="selectedAliments.length < 10"
      />
    </div>

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