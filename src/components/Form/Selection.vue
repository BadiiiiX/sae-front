<script setup lang="ts">

import {nextTick, onMounted, reactive, ref, watchEffect} from "vue";
import axios from "axios";
import {computedAsync, useAsyncState} from "@vueuse/core";

const apiUrl = "http://localhost:3000";

const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const selectedSubSubCategory = ref(null);
const haveSubElements = ref(false);
const selectedAliments = ref([]);
const alimentList = ref([]);
const subCategoryHaveSubSubCategories = [];

const {state: categories, isReady: categoriesIsReady, isLoading: categoriesIsLoading} = useAsyncState(
    axios
        .get(`${apiUrl}/category/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: subCategories, isReady: subCategoriesIsReady, isLoading: subCategoriesIsLoading} = useAsyncState(
    axios
        .get(`${apiUrl}/subcategory/all`)
        .then(t => t.data),
    [],
    {immediate: true},
)

const {state: subSubCategories, isReady: subSubCategoriesIsReady, isLoading: subSubCategoriesIsLoading} = useAsyncState(
    axios
        .get(`${apiUrl}/subsubcategory/all`)
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

const getAliments = computedAsync(() => {

  selectedSubCategory.value ??= [];
  selectedSubSubCategory.value ??= [];

  const codes = [...selectedSubCategory.value, ...selectedSubSubCategory.value];

  const r = [];

  codes.filter(code => !subCategoryHaveSubSubCategories.includes(code))
      .forEach(async c => {
        const res = await axios.get(`${apiUrl}/aliment/search/${c}`);
        r.push(...res.data.map((t: any) => ({label: t.name, value: t.code})))
      })

  return r;
});

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
</script>

<template>
  <header>
    <h2 class="uppercase">Vos choix</h2>
    <h3 class="justify">Afin de remplir le formulaire, veuillez choisir vos dix aliments préférés.</h3>
  </header>

  <FormKit
      type="form"
      #default="{ value }"
      :actions="false"
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
        v-if="selectedSubCategory !== null && selectedSubCategory.length > 0 && (!haveSubElements || selectedSubSubCategory !== null && selectedSubSubCategory.length > 0)"
        type="transferlist"
        name="aliments"
        label="Choisissez vos aliments"
        :options="() => {
          console.log(getAliments)
          return getAliments;
        }"
        }
        max="10"
    />

    <pre>
      {{ selectedCategory }}
      {{ selectedSubCategory }}
      {{ selectedSubSubCategory }}
      {{ getAliments }}
    </pre>

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