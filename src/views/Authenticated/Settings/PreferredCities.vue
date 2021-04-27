<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Preffered Cities</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
        <div class="ion-padding cities-container">
          <div class="fix-container">
            <h5>Which cities do you prefer to have alerts? <span class="barefoot-color">Choose three (3)</span></h5>
            <div class="cities-checkbox-container">
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
          </div>
          <div class="sub-cities-container">
              <ion-list>
                <ion-item v-for="entry, index in subCities" :key="index" lines="none">
                  <ion-label>{{ucwords(entry.name)}}</ion-label>
                  <ion-checkbox
                    slot="end"
                    @update:modelValue="saveCity(entry.isChecked = $event, entry.name)"
                    :modelValue="entry.isChecked"
                    :disabled="!isSaving ? counter.length !== 3 ? false : counter.length === 3 ? !entry.isChecked : entry.isChecked : true">
                  </ion-checkbox>
                </ion-item>
              </ion-list>
          </div>
            </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonCheckbox,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  emits: ["login", "createAccount"],
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCheckbox,
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const cities = computed(() => store.state.users.cities)
      
      const selectedCountry = ref()
      const subCities = computed(() => store.state.users.subCities)
      const selectedCities = computed(() => store.state.users.selectedCities)
      const counter = ref()
      const isSaving = ref(false)
      counter.value = selectedCities.value
      const ucwords = (val: string) => {
          return val.toLowerCase().replace(/(?<= )[^\s]|^./g, (a: string)=>a.toUpperCase())
      }
      const getCities = async () => {
        await store.dispatch('users/getSelectedCities', {country: selectedCountry.value}).then(async () => {
           await store.dispatch('users/getCities', {country: selectedCountry.value} );
        })
      }
      const saveCity = async (event: any, city: any) => {
        isSaving.value = true
        await store.dispatch('users/addCity', {value: event, city: city, country: selectedCountry.value})
          counter.value = await subCities.value.filter((val: any) => {
            return val.isChecked === true;
          });
        isSaving.value = false
      }
    return {
        router,
        cities,
        ucwords,
        selectedCountry,
        getCities,
        subCities,
        saveCity,
        selectedCities,
        counter,
        isSaving,
    };
  },
});
</script>
