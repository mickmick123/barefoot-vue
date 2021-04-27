<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Event Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
          <event-details-component />
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
import { computed, defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import EventDetailsComponent, {
  eventDetailsComponentSchema,
} from "../../Reusables/EventDetailsComponent.vue";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    EventDetailsComponent,
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const router = useRouter()
    const theForm = useForm({
      validationSchema: eventDetailsComponentSchema.concat(
        eventDetailsComponentSchema
      ),
    });
    return {
        user,
        handleSubmit: async () => {
            const resp = await theForm.validate();
            if (resp.valid) {
            // need to unwrap the references to get a plain json object
                const { eventDetails } = theForm.values;
                store.state.users.postData.title = eventDetails.title
                store.state.users.postData.description = eventDetails.description
                store.state.users.postData.country = eventDetails.selectedCountry
                store.state.users.postData.address = eventDetails.address
                store.state.users.postData.floor = eventDetails.floor
                store.state.users.postData.city = eventDetails.selectedCity
                store.state.users.postData.category = eventDetails.category
                router.push({name: 'post-2'})
            }
        },
    };
  },
});
</script>
