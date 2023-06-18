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

  <header>
    <h2 class="uppercase center">À Propos de vous</h2>
    <h3 class="justify">Avant de commencer le sondage, nous avons besoin de savoir qui vous êtes.
      <br> Pour certaines raisons statistique, vous ne pouvez pas participer plusieurs fois au sondage.</h3>
  </header>

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
header {
  width: 80%;
  margin: 0 auto 6rem;
}

h3 {
  line-height: 1.5em;
}
</style>