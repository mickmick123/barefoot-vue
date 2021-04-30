<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-tabs
      @ionTabsWillChange="beforeTabChange"
      @ionTabsDidChange="afterTabChange"
    >
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="friends" href="/friends/friends-list">
          <ion-icon :icon="people"></ion-icon>
          <ion-label>Friends</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="requests" href="/friends/friends-request">
          <ion-icon :icon="personAdd"></ion-icon>
          <ion-label>Requests</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="nearby" href="/friends/friends-nearby">
          <ion-icon :icon="search"></ion-icon>
          <ion-label>Nearby</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent, menuController } from "vue";
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
} from "@ionic/vue";
import { people, search, personAdd } from "ionicons/icons";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    IonIcon,
    IonLabel,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
  },
  setup() {
      const router = useRouter()
    const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
      }
    const beforeTabChange = () => {
      // do something before tab change
    };
    const afterTabChange = () => {
      // do something after tab change
    };
    return {
      beforeTabChange,
      afterTabChange,
      backToMap,
      people,
      search,
      personAdd,
    };
  },
});
</script>
