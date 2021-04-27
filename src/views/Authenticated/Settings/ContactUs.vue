<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Contact Us</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="faq-container ion-padding">
          <h5>Contact Us</h5>
          <p>Address here</p>
          <h5>Hotline</h5>
          <p>Number here</p>
          <h5>Email</h5>
          <p>Email here</p>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
  },
  setup() {
    const router = useRouter()
    return {
        router,
    };
  },
});
</script>
