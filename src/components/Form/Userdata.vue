<script setup lang="ts">

import {defineEmits} from "vue/dist/vue";

const emit = defineEmits(["next"]);

const next = () => {
  emit("next");
}

const calcAge = (birthdate: Date): number => {
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthdate.getFullYear();
  if (currentDate.getMonth() < birthdate.getMonth() || (currentDate.getMonth() === birthdate.getMonth() && currentDate.getDate() < birthdate.getDate())) {
    age--;
  }

  return age
}

const ageRule = (birthDate: any) => {
  return calcAge(new Date(birthDate.value)) >= 12
}

//TODO Verify if email exists & save it for later

</script>

<template>

  <h2 class="uppercase">À Propos de vous</h2>

  <FormKit type="form" @submit="next">

    <FormKit
        type="text"
        label="Entrez votre prénom"
        help="Veuillez entrer votre prénom"
        validation="required"
        validation-visbility="live"/>

    <FormKit
        type="text"
        label="Entrez votre nom"
        help="Veuillez entrer votre nom"
        validation="required"
        validation-visbility="live"/>

    <FormKit
        type="email"
        label="Entrez votre adresse email"
        help="Veuillez entrer votre addresse email"
        validation="required|email"
        validation-visbility="live"
    />

    <FormKit
        type="datepicker"
        name="date"
        format="DD/MM/YYYY"
        label="Date de naissance"
        validation="ageRule"
        :validation-messages="{
          ageRule: 'Vous devez avoir au moins 12 ans pour participer au sondage'
        }"
        :validation-rules="{ageRule}"
        help="Veuillez entrer votre date de naissance"
        overlay
    />

  </FormKit>

</template>

<style scoped>
h2 {
  margin-bottom: 8rem;
}
</style>