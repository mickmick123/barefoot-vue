<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Notification Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
     <div class="notification-container">
         <ion-list>
             <div class="notification-item-container" v-for="(notif, index) in notification" :key="index">
                 <ion-item lines="none">
                    <ion-label>{{notif.header}}</ion-label>
                    <ion-toggle
                        @ionChange="handleChange(notif.isChecked = $event.target.checked)"
                        :value="notif.value"
                        :checked="notif.isChecked"
                        color="primary">
                    </ion-toggle>
                </ion-item>
                <ion-note class="barefoot-color">{{notif.subHeader}}</ion-note>
             </div>
       </ion-list>
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
  IonItem,
  IonLabel,
  IonToggle,
  IonNote,
} from "@ionic/vue";

import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonItem,
    IonLabel,
    IonToggle,
    IonNote,
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const user = computed(() => store.state.users.user)
      const notification = ref()
      
      onMounted(() => {
          if(user.value.notifications) {
              notification.value = user.value.notifications
          } else {
             notification.value = [
                {
                    header: 'New Messages',
                    subHeader: 'Get notified by receiving new messages',
                    value: 'new_messages',
                    isChecked: true,
                },
                {
                    header: 'Gift Receipt',
                    subHeader: 'Get notified by receiving new gifts',
                    value: 'gift_receipt',
                    isChecked: true,
                },
                {
                    header: 'New Friend',
                    subHeader: 'Get notified by having new friends',
                    value: 'new_friend',
                    isChecked: true,
                },
                {
                    header: 'New Bars',
                    subHeader: 'Get notified if there are new bars nearby',
                    value: 'new_bars',
                    isChecked: true,
                },
                {
                    header: 'New Restaurants',
                    subHeader: 'Get notified if there are new restaurants nearby',
                    value: 'new_restaurants',
                    isChecked: true,
                },
                {
                    header: 'New Events',
                    subHeader: 'Get notified if there are new events nearby',
                    value: 'new_events',
                    isChecked: true,
                }
            ]
          }
      })
      const handleChange = async (event: any) => {
          await store.dispatch("users/updateNotifications", notification.value);
      }
    return {
        router,
        notification,
        handleChange,
    };
  },
});
</script>
