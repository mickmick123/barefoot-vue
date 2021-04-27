<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Update Password</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
        <change-password-component />
    </ion-content>
    <ion-footer class="about-footer">
        <ion-button @click="handleUpdatePassword">UPDATE</ion-button>
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
import ChangePasswordComponent, {
  changePasswordComponentSchema,
} from "../../Reusables/ChangePasswordComponent.vue";


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    ChangePasswordComponent,
    IonButton,
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const theForm = useForm({
      validationSchema: changePasswordComponentSchema,
    });
    return {
        router,
        handleUpdatePassword: async () => {
        const resp = await theForm.validate();
        if (resp.valid) {
          const { credentials } = theForm.values;
          await store.dispatch('users/updatePassword', {...credentials });
        }
      },
    };
  },
});
</script>
