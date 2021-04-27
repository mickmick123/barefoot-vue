<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Event Banner</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
          <ion-img :src="currentImage === undefined ? defaultImage : currentImage.webviewPath"/>
          <ion-fab class="event-camera" @click="takePicture" >
            <ion-fab-button>
                <ion-icon :icon="camera"></ion-icon>
            </ion-fab-button>
         </ion-fab>
      </div>
    </ion-content>
    <ion-footer class="about-footer">
        <ion-button @click="handleSubmit">Post Now</ion-button>
    </ion-footer>
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
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
} from "@ionic/vue";
import { useForm } from "vee-validate";
import { computed, defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { camera } from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonImg,
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const formProcess = computed(() => store.state.users.formProcess[2])
    const router = useRouter()
    const defaultImage = computed(() =>
      require("../../../../public/assets/images/events/default-image.jpg")
    );
    const currentImage = computed(() => store.state.users.postData.img)
    const { takePhoto } = usePhotoGallery();
    const takePicture = () => {
        takePhoto(user.value?.id, true).then(async (image) => {
            store.state.users.postData.img = {filepath: image.filepath, webviewPath: image.webviewPath}
        })
    }
    const handleSubmit = async () => {
      if(currentImage.value === undefined) {
          store.commit('users/appError', 'Banner must be selected!')
      }else {
        await store.dispatch('users/savePost').then((res) => {
         console.log(res)
           if (res) {
               router.push('/map')
           }
       })
      }
       
    }
    watchEffect(() => {
      if (!formProcess.value){
        store.state.users.postData.img = undefined
        store.commit('users/formProcess',{status: 'old', form: 2, value: true})
      }
    })
    return {
        user,
        camera,
        defaultImage,
        currentImage,
        takePicture,
        handleSubmit,
    };
  },
});
</script>
