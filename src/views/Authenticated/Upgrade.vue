<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>Upgrade</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="upgrade-background ion-padding">
        <div class="upgrade-container">
          <h5>Upgrade your account now and enjoy exclusive perks and privileges made just for you!</h5>
          <span>Current Balance: <b><span>2000</span> EP</b></span>
          <div class="upgrade-item-container">
              <ion-img :src="greenstar" />
              <div class="upgrade-p-container">
                <p>Green Star accounts belon to the Popular group. You take being social to a whole new level and love making new friends!</p>
              </div>
              <div class="upgrade-item-container-botton">
                <ion-button color="secondary">GIFT TO A FRIEND</ion-button>
                <ion-button color="success">2000 EP</ion-button>
              </div>
          </div>
          <div class="upgrade-item-container">
              <ion-img :src="goldstar" />
              <div class="upgrade-p-container">
                <p>Gold Star accounts belon to the Celebrity group. There is nothing too big for you to spin in your favor!</p>
              </div>
              <div class="upgrade-item-container-botton">
                <ion-button color="secondary">GIFT TO A FRIEND</ion-button>
                <ion-button>6000 EP</ion-button>
              </div>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import router from "@/router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonImg,
  IonButton,
  menuController,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonImg,
    IonButton,
  },
  setup() {
    const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
      }
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const greenstar = computed(() => require('../../../public/assets/images/upgrade/green_star.png'))
    const goldstar = computed(() => require('../../../public/assets/images/upgrade/gold_star.png'))
    return {
      user,
      greenstar,
      goldstar,
      backToMap,
    }
  },
});
</script>
