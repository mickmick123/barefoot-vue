<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>FAQs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="setting-menu-contaniner">
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'What is Barefoot App?', content: '<some content here>' }})">
              <span>What is Barefoot App?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'How do I add friend?', content: '<some content here>' }})">
              <span>How do I add friend?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'How do I change my password?', content: '<some content here>' }})">
              <span>How do I change my password?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'How to adjust Proximity scan?', content: '<some content here>' }})">
              <span>How to adjust Proximity scan?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'What are E-Points (EP)?', content: '<some content here>' }})">
              <span>What are E-Points (EP)?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'Where can I purchase Top-up cards?', content: '<some content here>' }})">
              <span>Where can I purchase Top-up cards?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'How do I activate my account?', content: '<some content here>' }})">
              <span>How do I activate my account?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'What is Add friend PLUS?', content: '<some content here>' }})">
              <span>What is Add friend PLUS?</span>
              <ion-icon :icon="arrowForwardCircleOutline"></ion-icon>
          </div>
          <div class="setting-menu" @click="router.push({name: 'faq-content', params: { header: 'What is the Hotness Meter for?', content: '<some content here>' }})">
              <span>What is the Hotness Meter for?</span>
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
    return {
        arrowForwardCircleOutline,
        router,
    };
  },
});
</script>
