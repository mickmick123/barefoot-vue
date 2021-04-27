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
      <div class="faq-container ion-padding">
          <h5>{{header}}</h5>
          <p>{{content}}</p>
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
import { useRoute, useRouter } from "vue-router";
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
    const route = useRoute()
    const { header, content } = route.params;
    return {
        router,
        header,
        content,
    };
  },
});
</script>
