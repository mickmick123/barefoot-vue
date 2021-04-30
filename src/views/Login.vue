<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div class="flex-container">
             <ion-img class="login-logo" :src="logo" />
             <login-component />
            <div class="login-forgot-container">
                <p class="barefoot-color">Forgot Password?</p>
            </div>
            <div class="login-button-container">
                <ion-button @click="handleLogin">LOG IN</ion-button>
                <ion-button>CONTINUE WITH FACEBOOK</ion-button>
            </div>
            <div class="login-signup-container">
                <p>Not a member yet? <span class="barefoot-color" @click="gotoRegistration">Sign up</span></p>
            </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import LoginComponent, {
  loginComponentSchema,
} from "./Reusables/LoginComponent.vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  emits: ["login", "createAccount"],
  components: {
    IonContent,
    IonPage,
    LoginComponent,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const gotoRegistration = () => {
      router.push('signup');
    }
    const logo = computed(() => require('../../public/assets/images/login/logo.png'))
    const theForm = useForm({
      validationSchema: loginComponentSchema
    });
    return {
      logo,
      gotoRegistration,
      handleLogin: async () => {
        const resp = await theForm.validate();
        if (resp.valid) {
          // need to unwrap the references to get a plain json object
          const { credentials } = theForm.values;
          const res = await store.dispatch('users/userLogin', {...credentials });
          if(res) {
              store.commit('inApp/isFromLogin', true)
              router.push('/')
          }
        }
      },
    };
  },
});
</script>
