<template>
  <div class="login-input">
    <ion-item>
      <ion-label position="floating">Email</ion-label>
      <ion-input type="text" name="credentials.email" id="email" v-model="email" />
    </ion-item>
    <p class="error">{{ errors["credentials.email"]  }}</p>
    <ion-item>
      <ion-label position="floating">Password</ion-label>
      <ion-input
        v-model="password"
        type="password"
        name="credentials.password"
        id="password"
        autocomplete="new-password"
      />
    </ion-item>
    <p class="error">{{ errors["credentials.password"] }}</p>
  </div>
</template>

<script lang="ts">
import {
  IonItem,
  IonInput,
  IonLabel
} from "@ionic/vue";
import { defineComponent } from "vue";
import * as yup from "yup";

import { useField, useFormErrors } from "vee-validate";

export const loginComponentSchema = yup
  .object({
    credentials: yup.object({
      email: yup
        .string()
        .required().label("Email")
        .email(),
      password: yup
        .string().label("Password")
        .required()
    })
  })
  .required();

export default defineComponent({
  name: "LoginComponent",
  setup() {
    // define fields to be used in this form context
    const { value: email } = useField("credentials.email");
    const { value: password } = useField("credentials.password");

    return {
      errors: useFormErrors() as any,
      email,
      password
    };
  },
  components: {
    IonItem,
    IonInput,
    IonLabel
  }
});
</script>

<style lang="css" scoped>
ion-item {
  --padding-start: 0
}
</style>