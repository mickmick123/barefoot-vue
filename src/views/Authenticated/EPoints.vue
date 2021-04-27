<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>E-Points</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="epoints-background ion-padding">
        <div class="epoints-container">
          <h5>Upgrade your account now and enjoy exclusive perks and privileges made just for you!</h5>
          <span>Current Balance: <b><span>2000</span> EP</b></span>
          <div class="epoints-item-container">
              <h5>TOP-UP</h5>
              <ion-img :src="topup" />
              <div class="epoints-p-container">
                <p>More EP's means more fun! You can acquire e-points by topping up now!</p>
              </div>
              <div class="epoints-item-container-botton">
                <ion-button color="secondary">TOP-UP</ion-button>
              </div>
          </div>
          <div class="epoints-item-container">
              <h5>WITHDRAW</h5>
              <ion-img :src="withdraw" />
              <div class="epoints-p-container">
                <p>Turn your EP's into real cash!</p>
              </div>
              <div class="epoints-item-container-botton">
                <ion-button color="secondary">VIA BANK</ion-button>
                <ion-button>VIA REMITTANCE</ion-button>
              </div>
          </div>
          <div class="epoints-learn-more">
              Learn more about Top-Up and Withdraw
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
    const withdraw = computed(() => require('../../../public/assets/images/epoints/withdraw.png'))
    const topup = computed(() => require('../../../public/assets/images/epoints/topup.png'))
    return {
      user,
      withdraw,
      topup,
      backToMap,
    }
  },
});
</script>
