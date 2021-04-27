<template>
  <div>
    <ion-item>
      <ion-label position="floating">Current Password</ion-label>
      <ion-input type="password" name="credentials.current" id="current" v-model="current" />
    </ion-item>
    <p class="error">{{ errors["credentials.current"]  }}</p>
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
import { computed, defineComponent } from "vue";
import * as yup from "yup";

import { useField, useFormErrors } from "vee-validate";
import { useStore } from "vuex";

export const changePasswordComponentSchema = yup
  .object({
    credentials: yup.object({
      current: yup
        .string()
        .required().label("current"),
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
  name: "ChangePasswordComponent",
  setup() {
    // define fields to be used in this form context
    const { value: current } = useField("credentials.current");
    const { value: password } = useField("credentials.password");
    const { value: confirm } = useField("credentials.confirm");
    const store = useStore()
    const user = computed(() => store.state.users.user)
    if(user.value) {
      current.value = user.value.current
    }
    return {
      errors: useFormErrors() as any,
      current,
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