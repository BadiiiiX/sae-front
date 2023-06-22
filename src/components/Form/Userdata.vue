<script setup lang="ts">

import {defineEmits} from "vue/dist/vue";
import {ref} from "vue";
import axios from "axios";

const definedEmail = ref(null);

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

const addressExists = async (address: any) => {

  const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!address.value.match(mailRegex)) {
    return true;
  }

  let res;


  try {
    res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${address.value}`);
  } catch (err) {
    res = err.response.data.status;

    return res === 404;
  }

  return false;

}

const goNext = async () => {

  let res;

  try {
    res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${definedEmail.value}`);
  } catch (err) {
    res = err.response;
  } finally {
    console.log(res);
  }

  next();
}

//TODO Verify if email exists & save it for later

</script>

<template>

  <header>
    <h2 class="uppercase center">À Propos de vous</h2>
    <h3 class="justify">Avant de commencer le sondage, nous avons besoin de savoir qui vous êtes.
      <br> Pour certaines raisons statistique, vous ne pouvez pas participer plusieurs fois au sondage.</h3>
  </header>

  <FormKit type="form" @submit="goNext">

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
        v-model="definedEmail"
        validation="required|email|addressExists"
        validation-visbility="live"
        :validation-messages="{
          addressExists: 'Votre addresse mail est déjà enregistré dans nos services. Vous ne pouvez pas participer deux fois au sondage.'
        }"
        :validation-rules="{addressExists}"
    />

    <FormKit
        type="datepicker"
        name="date"
        format="DD/MM/YYYY"
        label="Date de naissance"
        validation="required|ageRule"
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