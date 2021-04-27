<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Account Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
        <personal-info-component />
        <ion-button color="secondary" expand="block" @click="router.push({name: 'change-password'})">Change Password</ion-button>
    </ion-content>
    <ion-footer class="about-footer">
        <ion-button @click="handleUpdateAccount">UPDATE</ion-button>
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
  IonButton,
} from "@ionic/vue";
import { useForm } from "vee-validate";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import PersonalInfoComponent, {
  personalInfoComponentSchema,
} from "../../Reusables/PersonalInfoComponent.vue";


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    PersonalInfoComponent,
    IonButton,
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const theForm = useForm({
      validationSchema: personalInfoComponentSchema,
    });
    return {
        router,
        handleUpdateAccount: async () => {
        const resp = await theForm.validate();
        if (resp.valid) {
          const { personalInfo } = theForm.values;
          await store.dispatch('users/updateAccount', {...personalInfo });
        }
      },
    };
  },
});
</script>
