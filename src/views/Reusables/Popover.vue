<template>
  <ion-content class="ion-padding">
    Pin this flag to the event location
  </ion-content>
</template>

<script>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popover',
  components: { IonContent }
});
</script>
<style scoped>
.popover-wrapper::after{
    content: '';
    position: absolute;
    left: 42%;
    top: 100%;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #e8e8e8;
    clear: both;
}
</style>