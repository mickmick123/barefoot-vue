<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div class="flex-container">
          <div class="home-header">
            <h2>Let <span class="barefoot-color">Barefoot</span> guide you through the city</h2>
          </div>
          <div class="home-sub-content">
            <ion-img class="home-image" :src="beer" />
            <p>Find the hottest happy hour destinations in the metro</p>
          </div>
          <div class="home-sub-content">
            <ion-img class="home-image" :src="roast" />
            <p>Explore the hottest restaurants and cafes nearby</p>
          </div>
          <div class="home-sub-content">
            <ion-img class="home-image" :src="poster" />
            <p>Discover events that interest you</p>
          </div>
          <div class="home-button-container">
            <ion-button @click="gotoRegistration">LET'S GET STARTED!</ion-button>
          </div>
          <div class="home-login">
            <p>Already have an account? <span class="barefoot-color" @click="gotoLogin">Log in</span></p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonImg, IonButton } from '@ionic/vue';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonImg,
    IonButton,
  },
  setup() {
    const beer = computed(() => require('../../public/assets/images/home/beer.png'))
    const roast = computed(() => require('../../public/assets/images/home/pork_roast.png'))
    const poster = computed(() => require('../../public/assets/images/home/poster.png'))
    const router = useRouter();
    const gotoRegistration = () => {
      router.push('signup');
    }
    const gotoLogin = () => {
      router.push('login');
    }
    return {
      beer,
      roast,
      poster,
      gotoRegistration,
      gotoLogin,
    }
  }
});
</script>

<style scoped>
</style>