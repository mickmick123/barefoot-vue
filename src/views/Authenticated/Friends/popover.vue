<template>
  <!-- List of Text Items -->
  <ion-list>
    <ion-item lines="none" @click="closeOver(1)">
      <ion-label>Send with Gift</ion-label>
    </ion-item>
    <ion-item lines="none" @click="closeOver(2)">
      <ion-label>Send a Request</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { 
  IonItem, 
  IonList, 
  IonLabel, 
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['closeOver'],
  components: { 
    IonItem, 
    IonList, 
    IonLabel, 
  }
});
</script>