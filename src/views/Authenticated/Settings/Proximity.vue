<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Proximity Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
        <div class="proximity-container">
            <span>Bars</span>
            <span>{{proximity.bar}} KM</span>
            <ion-item lines="none">
                <ion-range @ionBlur="handleChange" v-model="proximity.bar" min="5" max="100" color="primary"></ion-range>
            </ion-item>
        </div>
        <div class="proximity-container">
            <span>Restaurant and Cafes</span>
            <span>{{proximity.resto}} KM</span>
            <ion-item lines="none">
                <ion-range @ionBlur="handleChange" v-model="proximity.resto" min="5" max="100" color="primary"></ion-range>
            </ion-item>
        </div>
        <div class="proximity-container">
            <span>Events</span>
            <span>{{proximity.event}} KM</span>
            <ion-item lines="none">
                <ion-range @ionBlur="handleChange" v-model="proximity.event" min="5" max="100" color="primary"></ion-range>
            </ion-item>
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
  IonItem,
  IonRange,
} from "@ionic/vue";

import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonItem,
    IonRange,
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const proximity = computed(() => store.state.users.user.proximity)
      const handleChange = async () => {
          await store.dispatch("users/updateProximity", proximity.value);
      }
    return {
        router,
        proximity,
        handleChange,
    };
  },
});
</script>
