<template>
  <div>
    <ion-item>
        <ion-label position="floating">Choose a Country</ion-label>
        <ion-select @ionChange="getCities" v-model="selectedCountry">
            <ion-select-option
                v-for="(city, index) in cities"
                :key="index"
                :value="city"
                >{{ ucwords(city) }}</ion-select-option>
        </ion-select>
    </ion-item>
    <p class="error">{{ errors["eventDetails.selectedCountry"] }}</p>
    <div v-if="selectedCountry !== undefined">
        <ion-item>
            <ion-label position="floating">Choose a City</ion-label>
            <ion-select v-model="selectedCity">
                <ion-select-option
                    v-for="(city, index) in subCities"
                    :key="index"
                    :value="city.name"
                    >{{ ucwords(city.name) }}</ion-select-option>
            </ion-select>
        </ion-item>
        <p class="error">{{ errors["eventDetails.selectedCity"] }}</p>
        <ion-item>
            <ion-label position="floating">Event Category</ion-label>
            <ion-select v-model="category">
                <ion-select-option value="bars">Bars and Pubs</ion-select-option>
                <ion-select-option value="resto">Restaurant and Cafes</ion-select-option>
                <ion-select-option value="events">Events</ion-select-option>
            </ion-select>
        </ion-item>
        <p class="error">{{ errors["eventDetails.category"] }}</p>
        <ion-item>
            <ion-label position="floating">Event Title</ion-label>
            <ion-input name="eventDetails.title" v-model="title" />
        </ion-item>
        <p class="error">{{ errors["eventDetails.title"] }}</p>
        <ion-item>
            <ion-label position="floating">Complete Address</ion-label>
            <ion-input name="eventDetails.address" v-model="address" />
        </ion-item>
        <p class="error">{{ errors["eventDetails.address"] }}</p>
        <ion-item>
            <ion-label position="floating">Floor (N/A if none)</ion-label>
            <ion-input name="eventDetails.floor" v-model="floor" />
        </ion-item>
        <p class="error">{{ errors["eventDetails.floor"] }}</p>
        <div class="text-area-container">
         <ion-item lines="none">
            <ion-textarea
                class="about-area"
                rows="10"
                cols="30"
                name="eventDetails.description"
                v-model="description"
                placeholder="Tell us about this event"
                width="100%"
            ></ion-textarea>
        </ion-item>
        <p class="error">{{ errors["eventDetails.description"] }}</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useField, useFormErrors } from "vee-validate";
import { IonItem, IonInput, IonLabel, IonSelectOption, IonSelect, IonTextarea } from "@ionic/vue";
import * as yup from "yup";
import { useStore } from 'vuex';
import { computed, watchEffect } from '@vue/runtime-core';
export const eventDetailsComponentSchema = yup
  .object({
    eventDetails: yup.object({
      selectedCountry: yup.string().required("Country Is Required"),
      selectedCity: yup.string().required("City Is Required"),
      address: yup.string().required("Address Is Required"),
      floor: yup.string().required("Enter N/A if none"),
      description: yup.string().required("Description Is Required"),
      title: yup.string().required("Title Is Required"),
      category: yup.string().required("Title Is Required"),
    })
  })
  .required();
export default {
  name: "EventDetails",
  setup() {
    // No need to define rules for fields
    const store = useStore();
    const cities = computed(() => store.state.users.cities)
    const subCities = computed(() => store.state.users.subCities)
    const formProcess = computed(() => store.state.users.formProcess[0])
    const { value: selectedCountry } = useField("eventDetails.selectedCountry");
    const { value: selectedCity } = useField("eventDetails.selectedCity");
    const { value: address } = useField("eventDetails.address");
    const { value: floor } = useField("eventDetails.floor");
    const { value: description } = useField("eventDetails.description");
    const { value: title } = useField("eventDetails.title");
    const { value: category } = useField("eventDetails.category");
    const ucwords = (val: string) => {
          return val.toLowerCase().replace(/(?<= )[^\s]|^./g, (a: string)=>a.toUpperCase())
      }
    const getCities = async () => {
        await store.dispatch('users/getSelectedCities', {country: selectedCountry.value}).then(async () => {
           await store.dispatch('users/getCities', {country: selectedCountry.value} );
        })
      }
    watchEffect(() => {
    if (!formProcess.value){
      selectedCountry.value = undefined
      selectedCity.value = undefined
      address.value = undefined
      floor.value = undefined
      description.value = undefined
      title.value = undefined
      category.value = undefined
      store.commit('users/formProcess',{status: 'old', form: 0, value: true})
    }
  })
    return {
      selectedCity,
      selectedCountry,
      address,
      floor,
      cities,
      ucwords,
      errors: useFormErrors() as any,
      getCities,
      subCities,
      description,
      title,
      category,
    };
  },
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonTextarea,
  }
};
</script>
<style lang="css" scoped>
ion-item {
  --padding-start: 0;
}
</style>