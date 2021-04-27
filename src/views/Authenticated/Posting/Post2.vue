<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Event Time Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
          <event-time-details-component />
      </div>
    </ion-content>
    <ion-footer class="about-footer">
        <ion-button @click="handleSubmit">NEXT</ion-button>
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
} from "@ionic/vue";
import { useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import EventTimeDetailsComponent, {
  EventTimeDetailsComponentSchema,
} from "../../Reusables/EventTimeDetailsComponent.vue";
import moment from 'moment'
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    EventTimeDetailsComponent,
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const router = useRouter()
    const theForm = useForm({
      validationSchema: EventTimeDetailsComponentSchema.concat(
        EventTimeDetailsComponentSchema
      ),
    });
    return {
        user,
        handleSubmit: async () => {
            const resp = await theForm.validate();
            if (resp.valid) {
            // need to unwrap the references to get a plain json object
                const { eventDetails } = theForm.values;
                store.state.users.postData.startDate = moment(eventDetails.startDate).format('L')
                store.state.users.postData.startTime = moment(eventDetails.startTime).format('LT')
                store.state.users.postData.endDate = moment(eventDetails.endDate).format('L')
                store.state.users.postData.endTime = moment(eventDetails.endTime).format('LT')
                router.push({name: 'post-3'})
            }
        },
    };
  },
});
</script>
