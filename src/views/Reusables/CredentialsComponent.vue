<template>
  <div>
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
    <ion-item>
      <ion-label position="floating">Confirm Password</ion-label>
      <ion-input
        v-model="confirm"
        type="password"
        name="credentials.confirm"
        id="password"
        autocomplete="new-password"
      />
    </ion-item>
    <p class="error">{{ errors["credentials.confirm"] }}</p>
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
export const credentialsComponentSchema = yup
  .object({
    credentials: yup.object({
      email: yup
        .string()
        .required().label("Email")
        .email(),
      password: yup
        .string().label("Password")
        .required()
        .min(8),
      confirm: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
    })
  })
  .required();

export default defineComponent({
  name: "CredentialsComponent",
  setup() {
    // define fields to be used in this form context
    const { value: email } = useField("credentials.email");
    const { value: password } = useField("credentials.password");
    const { value: confirm } = useField("credentials.confirm");

    return {
      errors: useFormErrors() as any,
      email,
      password,
      confirm,
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