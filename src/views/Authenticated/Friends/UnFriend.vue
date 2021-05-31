<template>
  <!-- List of Text Items -->
  <ion-list>
    <ion-item lines="none" @click="closeOver(1)">
      <ion-label>Unfriend</ion-label>
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