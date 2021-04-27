<template>
 <ion-header>
    <ion-toolbar>
      <ion-buttons slot="secondary">
        <ion-button @click="modalCLose">
            Close
        </ion-button>
    </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="image-modal-container">
    <ion-img :src="imageSrc"></ion-img>
  </ion-content>
</template>

<script lang="ts">
import { IonContent, IonImg, IonHeader, IonButtons, IonButton, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageModal',
  props: { imageSrc: String, modalCLose: Function },
  components: { IonContent, IonImg, IonHeader, IonButtons, IonButton, IonToolbar}
});
</script>
<style scoped>
    .image-modal-container {
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: row;
    }
    .image-modal {
        --backdrop-opacity: 20%;
    }
</style>