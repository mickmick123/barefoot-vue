<template>
  <menu-left contentId="main-content" menu-id="first" :showMenu="isAuth"/>
  <ion-app id="main-content">
    <ion-router-outlet />
  </ion-app>
   <ion-loading
   :is-open="loading"
    cssClass="barefoot-loading"
  >
  </ion-loading>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, toastController, IonLoading } from "@ionic/vue";
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useStore } from 'vuex';
import MenuLeft from '@/views/Authenticated/Menu/MenuLeft.vue'
import { useRouter } from "vue-router";
import  fcm  from './services/fcm';
import { Plugins } from '@capacitor/core';
const { App, BackgroundTask } = Plugins;
const { SplashScreen } = Plugins;
export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuLeft,
    IonLoading
  },
  setup() {
    const store = useStore();
    const isAuth = computed(() => store.state.users.isAuthenticated)
    const loading = computed(() => store.state.users.loading)
    const router = useRouter()
    const unsubscribe = ref();
    onMounted(() => {
      App.addListener('appStateChange', async (state) => {
        
        if (!state.isActive) {
  
          const taskId = BackgroundTask.beforeExit(async () => {

            await store.dispatch('users/updateLoginEvent', false)
            BackgroundTask.finish({
              taskId
            });
          });
        } else {
          await store.dispatch('users/updateLoginEvent', true)
        }
      })
    })
    onBeforeMount(async () => {
      fcm.pushInit()
      unsubscribe.value = store.subscribe(async (mutation: any, state: any) => {
        
        if (mutation.type === "users/userLogoutSuccess") {
          unsubscribe.value()
        }
        if (mutation.type === "users/postingStatus") {
          if(mutation.payload === "posted") {
            store.commit("users/postingStatus", "idle")
            store.commit("users/refreshData", "refresh")
            router.push('/map')
          }
        }
        if (mutation.type === "users/authError") {
          const toast =
            mutation.payload &&
            mutation.payload.err &&
            mutation.payload.err.message &&
            mutation.payload.err.message !== "" &&
            mutation.payload.err.message !== null &&
            (await toastController.create({
              message: mutation.payload.err.message,
              duration: 2000,
              color: "warning",
              position: 'top',
            }));

          return toast ? toast.present() : null;
        }

        if (mutation.type === "users/appError") {
          const toast =
            mutation.payload &&
            mutation.payload.err &&
            mutation.payload.err.message &&
            mutation.payload.err.message !== "" &&
            mutation.payload.err.message !== null &&
            (await toastController.create({
              message: mutation.payload.err.message,
              duration: 2000,
              color: "warning",
              position: 'top',
            }));

          return toast ? toast.present() : null;
        }
        if (mutation.type === "users/successMessage") {
          const toast =
            mutation.payload && mutation.payload !== '' &&
            mutation.payload !== null &&
            (await toastController.create({
              message: mutation.payload,
              duration: 2000,
              color: "success",
              position: 'top',
            }));
          return toast ? toast.present() : null;
        }
        if (mutation.type === "users/toast") {
          const toast =
            mutation.payload && mutation.payload !== '' &&
            mutation.payload !== null &&
            (await toastController.create({
              message: mutation.payload,
              duration: 2000,
              color: "light",
              position: 'bottom',
            }));
          return toast ? toast.present() : null;
        }
      });
      router.push('/');
    });
    return {
      loading,
      isAuth
    };
  },
});
</script>
