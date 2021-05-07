<template>
  <ion-page>
    <ion-content :fullscreen="true">
     <div class="loading-container">
        <ion-img :src="logo"/>
        <ion-progress-bar :value="buffer" :buffer="buffer"></ion-progress-bar>
     </div>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import { IonContent, IonPage, IonProgressBar, IonImg } from '@ionic/vue';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonProgressBar,
    IonImg,
  },
  setup() {
    const router = useRouter();
    const store = useStore()
    const buffer = ref();
    buffer.value = 0;
    const logo = computed(() => require('../../public/assets/images/login/logo.png'));
    onBeforeMount(async () => {
       const isFromLogin = computed(() => store.state.inApp.fromLogin)
        await store.dispatch("users/doAuthCheck").then(async (user) => {
            if(user){
                 await store.dispatch('offlineWatcher/offlineListeners', user.id)
                 buffer.value = 0.25;
                //  if(isFromLogin.value) {
                //    await store.dispatch('users/fillGallery').then(() => {
                //      store.commit('inApp/isFromLogin', false)
                //    })
                //  }
                 await store.dispatch('inApp/getRequest', user.id)
                 buffer.value = 0.35;
                 await store.dispatch('users/fillGallery')
                 buffer.value = 0.50;
                 await store.dispatch('users/getCountries')
                 buffer.value = 0.70;
                 await store.dispatch('inApp/getFriends', user.id)
                //  await store.dispatch('users/getGeoJsonEvents')
                buffer.value = 0.75;
                await store.dispatch('inApp/getMyRequest', user.id)
                 buffer.value = 0.80;
                //  await store.dispatch('users/getGeoJsonResto')
                await store.dispatch('users/getCurrentEpoints')
                 buffer.value = 0.85;
                 await store.dispatch('users/getUserEvents')
                 buffer.value = 0.90;
                //  await store.dispatch('users/getGeoJsonBars')
                 buffer.value = 1;
                 setTimeout(async () => {
                    router.replace('/map');
                    store.commit('users/updatingCoords', true)
                    await store.dispatch('users/getCurrentPosition').then(async () => {
                     await store.dispatch('inApp/findPeople', {latitude: store.state.users.user.coordinates.latitude, longitude: store.state.users.user.coordinates.longitude, id: store.state.users.user.id})
                      store.commit('users/updatingCoords', false)
                    })
                  }, 500);
                 
            }else {
                buffer.value = 1;
                setTimeout(() => {
                    router.replace('/home');
                }, 500);
            }
        })
    })
    return {
      logo,
      buffer,
    }
  }
});
</script>