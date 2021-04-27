<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="setting-menu-contaniner">
          <div class="setting-menu" @click="router.push({name: 'account'})">
              <span>Account Settings</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'cities'})">
              <span>Preferred Cities</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'notifications'})">
              <span>Notification Settings</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'proximity'})">
              <span>Proximity Settings</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faqs'})">
              <span>FAQs</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'contact-us'})">
              <span>Contact Us</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
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
  IonIcon,
  menuController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useRouter } from "vue-router";
export default defineComponent({
  emits: ["login", "createAccount"],
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonIcon,
  },
  setup() {
      const router = useRouter()
      const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
      }
    return {
        arrowForwardCircleOutline,
        router,
        backToMap,
    };
  },
});
</script>
