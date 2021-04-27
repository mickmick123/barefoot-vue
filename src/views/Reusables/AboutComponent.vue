<template>
  <div class="about-container">
    <h5>We'd like to know more about you! Tell us something about yourself.</h5>
    <ion-item lines="none">
      <ion-textarea
        maxlength="400"
        class="about-area"
        rows="10"
        cols="30"
        name="personalInfo.aboutMe"
        v-model="aboutMe"
        placeholder="Tell us about yourself"
        width="100%"
      ></ion-textarea>
    </ion-item>
    <div class="about-error-container">
      <p class="error" style="visibility:hidden">{{ errors["personalInfo.aboutMe"] }}</p>
      <p>{{aboutMe ? aboutMe.length : '0'}} / 400 Characters</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useField, useFormErrors } from "vee-validate";
import { IonItem, IonTextarea } from "@ionic/vue";
import * as yup from "yup";
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
export const aboutComponentSchema = yup
  .object({
    personalInfo: yup.object({
      aboutMe: yup
        .string()
        .required("This field is Required")
        .max(400),
    }),
  })
  .required();
export default {
  name: "PersonalInfo",
  setup() {
    // No need to define rules for fields
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const { value: aboutMe } = useField("personalInfo.aboutMe");
    aboutMe.value = user.value.aboutMe
    return {
      aboutMe,
      errors: useFormErrors() as any,
    };
  },
  components: {
    IonItem,
    IonTextarea
  },
};
</script>
<style lang="css" scoped>
ion-item {
  --padding-start: 0;
}
</style>
