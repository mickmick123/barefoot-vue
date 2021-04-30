<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">Speakers Tabs</ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, menuController } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
   setup() {
    const router = useRouter()
    const backToMap = () => {
      router.push("/map");
      menuController.enable(true, "first");
      menuController.open("first");
    };
    return {
      backToMap,
    };
  },
});
</script>
