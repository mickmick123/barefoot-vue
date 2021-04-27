<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="gallery-container">
          <div class="images">
                <ion-img class="gallery-image" :key="photo" v-for="photo in gallery" :src="photo.webviewPath" @click="openModal(photo.webviewPath)"></ion-img>
          </div>
           
         <ion-fab class="gallery-button" @click="takePicture" >
            <ion-fab-button>
                <ion-icon :icon="camera"></ion-icon>
            </ion-fab-button>
         </ion-fab>
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
  IonFab,
  IonFabButton,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { camera } from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/usePhotoGallery';
import ImageModal from '../Reusables/ImageModal.vue'
export default defineComponent({
  emits: ["login", "createAccount"],
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
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const gallery = computed(() => store.state.users.gallery)
    const { takePhoto, photos } = usePhotoGallery();
    const takePicture = () => {
        takePhoto(user.value?.id, true).then(async (image) => {
            await store.dispatch('users/saveGallery', image)
        })
    }
    const openModal = async (imageSrc: any) => {
      const modal = await modalController
        .create({
          component: ImageModal,
          cssClass: 'image-modal',
          showBackdrop: true,
          swipeToClose: true,
          animated: true,
          componentProps: {
            imageSrc: imageSrc,
            modalCLose: () => modal.dismiss()
          },
        })
      return modal.present();
    }
    return {
        user,
        camera,
        photos,
        takePicture,
        gallery,
        openModal
    };
  },
});
</script>
