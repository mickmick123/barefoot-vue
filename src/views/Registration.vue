<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Registration</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
           <personal-info-component />
           <credentials-component />
      </div>
    </ion-content>
    <ion-footer class="about-footer">
      <ion-button @click="handleCreateAccount">CREATE ACCOUNT</ion-button>
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
  IonFooter,
} from "@ionic/vue";
import { defineComponent } from "vue";
import PersonalInfoComponent, {
  personalInfoComponentSchema,
} from "./Reusables/PersonalInfoComponent.vue";
import CredentialsComponent, {
  credentialsComponentSchema,
} from "./Reusables/CredentialsComponent.vue";
import { useForm } from "vee-validate";
import store from './../store'
import { useRouter } from "vue-router";

export default defineComponent({
  emits: ["login", "createAccount"],
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    PersonalInfoComponent,
    CredentialsComponent,
    IonFooter,
  },
  setup() {
    // mapActions("user", ["createAccount"]);
    // const { createAccount } = mapActions(['createAccount']);
    const router = useRouter()
    const theForm = useForm({
      validationSchema: personalInfoComponentSchema.concat(
        credentialsComponentSchema
      ),
    });
    return {
      handleCreateAccount: async () => {
        const resp = await theForm.validate();
        if (resp.valid) {
          // need to unwrap the references to get a plain json object
          const { personalInfo, credentials } = theForm.values;
          const res = await store.dispatch('users/createAccount', {...personalInfo, ...credentials });
          if(res) {
              router.push('/')
          }
        }
      },
    };
  },
});
</script>
