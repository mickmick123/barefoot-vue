<template>
  <div>
    <ion-item>
      <ion-label position="floating">First Name</ion-label>
      <ion-input name="personalInfo.first" v-model="firstName" />
    </ion-item>
    <p class="error">{{ errors["personalInfo.firstName"] }}</p>

    <ion-item>
      <ion-label position="floating">Last Name</ion-label>
      <ion-input name="personalInfo.last" v-model="lastName" type="text" />
    </ion-item>
    <p class="error">{{ errors["personalInfo.lastName"] }}</p>

    <ion-item>
      <ion-label position="floating">Gender Preference</ion-label>
      <ion-select name="personalInfo.gender" v-model="gender">
          <ion-select-option value='male'>Male</ion-select-option>
          <ion-select-option value='female'>Female</ion-select-option>
          <ion-select-option value='gay'>Gay</ion-select-option>
          <ion-select-option value='lesbian'>Lesbian</ion-select-option>
          <ion-select-option value='bisexual'>Bisexual</ion-select-option>
          <ion-select-option value='transgender'>Transgender</ion-select-option>
          <ion-select-option value='lgbtq'>LGBTQ+</ion-select-option>
      </ion-select>
    </ion-item>
    <p class="error">{{ errors["personalInfo.gender"] }}</p>

    <ion-item>
      <ion-label position="floating">Civil Status</ion-label>
      <ion-select name="personalInfo.civilStatus" v-model="civilStatus">
          <ion-select-option value='single'>Single</ion-select-option>
          <ion-select-option value='married'>Married</ion-select-option>
          <ion-select-option value='widowed'>Widowed</ion-select-option>
          <ion-select-option value='divorced'>Divorced</ion-select-option>
      </ion-select>
    </ion-item>
    <p class="error">{{ errors["personalInfo.civilStatus"] }}</p>

    <ion-item>
      <ion-label position="floating">Birth Date</ion-label>
      <ion-datetime
        name="personalInfo.birthDate"
        v-model="birthDate"
        display-format="MM/DD/YYYY"
      />
    </ion-item>
    <p class="error">{{ errors["personalInfo.birthDate"] }}</p>
  </div>
</template>

<script lang="ts">
import { useField, useFormErrors } from "vee-validate";
import { IonItem, IonInput, IonLabel, IonDatetime, IonSelectOption, IonSelect } from "@ionic/vue";
import * as yup from "yup";
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
export const personalInfoComponentSchema = yup
  .object({
    personalInfo: yup.object({
      firstName: yup.string().required("First Name Is Required"),
      lastName: yup.string().required("Last Name Is Required"),
      gender: yup.string().required("Gender Is Required"),
      civilStatus: yup.string().required("Civil Status Is Required"),
      birthDate: yup.string().required("birthDate Is Required")
    })
  })
  .required();
export default {
  name: "PersonalInfo",
  setup() {
    // No need to define rules for fields
    const { value: firstName } = useField("personalInfo.firstName");
    const { value: lastName } = useField("personalInfo.lastName");
    const { value: gender } = useField("personalInfo.gender");
    const { value: civilStatus } = useField("personalInfo.civilStatus");
    const { value: birthDate } = useField("personalInfo.birthDate");
    const store = useStore()
    const user = computed(() => store.state.users.user)
    console.log(user.value)
    if(user.value) {
      firstName.value = user.value.firstName;
      lastName.value = user.value.lastName;
      gender.value = user.value.gender;
      civilStatus.value = user.value.civilStatus;
      birthDate.value = user.value.birthDate;
    }
    return {
      lastName,
      firstName,
      gender,
      birthDate,
      civilStatus,
      errors: useFormErrors() as any
    };
  },
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonDatetime,
    IonSelectOption,
    IonSelect,
  }
};
</script>
<style lang="css" scoped>
ion-item {
  --padding-start: 0;
}
</style>