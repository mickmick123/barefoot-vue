<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>About Me</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
          <about-component />
      </div>
    </ion-content>
    <ion-footer class="about-footer">
        <ion-button @click="handleSubmit">UPDATE</ion-button>
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
import { useStore } from "vuex";
import AboutComponent, {
  aboutComponentSchema,
} from "../Reusables/AboutComponent.vue";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    AboutComponent,
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const theForm = useForm({
      validationSchema: aboutComponentSchema.concat(
        aboutComponentSchema
      ),
    });
    return {
        user,
        handleSubmit: async () => {
            const resp = await theForm.validate();
            if (resp.valid) {
            // need to unwrap the references to get a plain json object
                const { personalInfo } = theForm.values;
                await store.dispatch('users/updateAbout', {...user.value, ...personalInfo });
            }
        },
    };
  },
});
</script>
