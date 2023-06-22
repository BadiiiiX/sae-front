<script setup lang="ts">

import {defineEmits} from "vue/dist/vue";
import {ref} from "vue";
import axios from "axios";

const AGE_LIMIT = 10;

const enteredFirstName = ref("");
const enteredLastName = ref("");
const enteredMail = ref("");
const enteredBirthDate = ref("");

const props = defineProps(['formData'])
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
  return calcAge(new Date(birthDate.value)) >= AGE_LIMIT
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
    res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${enteredMail.value}`);
  } catch (err) {
    res = err.response;
  }

  props.formData.user = {
    firstName: enteredFirstName.value,
    lastName: enteredLastName.value,
    email: enteredMail.value,
    birthDate: enteredBirthDate.value.split('T')[0],
  }

  next();
}

</script>

<template>

  <header>
    <h2 class="uppercase center">À Propos de vous</h2>
    <h3 class="justify">Avant de commencer le sondage, nous avons besoin de savoir qui vous êtes.
      <br> Pour certaines raisons statistiques, vous ne pouvez pas participer plusieurs fois au sondage.</h3>
  </header>

  <FormKit
      type="form"
      :actions="false"
      @submit="goNext"
  >

    <FormKit
        type="text"
        label="Entrez votre prénom"
        v-model="enteredFirstName"
        validation="required"
        validation-visbility="live"/>

    <FormKit
        v-if="enteredFirstName !== ''"
        type="text"
        label="Entrez votre nom"
        v-model="enteredLastName"
        validation="required"
        validation-visbility="live"/>

    <FormKit
        type="email"
        v-if="enteredLastName !== ''"
        label="Entrez votre adresse email"
        v-model="enteredMail"
        validation="required|email|addressExists"
        validation-visbility="live"
        :validation-messages="{
          addressExists: 'Votre addresse mail est déjà enregistré dans nos services. Vous ne pouvez pas participer deux fois au sondage.'
        }"
        :validation-rules="{addressExists}"
    />

    <FormKit
        type="datepicker"
        v-if="enteredMail !== ''"
        name="date"
        format="DD/MM/YYYY"
        label="Date de naissance"
        v-model="enteredBirthDate"
        validation="required|ageRule"
        :validation-messages="{
          ageRule: `Vous devez avoir au moins ${AGE_LIMIT} ans pour participer au sondage`
        }"
        :validation-rules="{ageRule}"
        overlay
    />

    <div class="center full-width">
      <FormKit
          v-if="enteredBirthDate !== ''"
          type="submit"
          prefix-icon="check"
          label="Suivant"
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