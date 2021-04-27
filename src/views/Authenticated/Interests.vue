<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Interests</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <div class="interests-container">
          <h5>Pick nine (9) interests that best describe who you are.</h5>
          <ion-list>
            <ion-item v-for="(entry, index) in user.interests" :key="index">
              <ion-label>{{ entry.val }}</ion-label>
              <ion-checkbox
                slot="end"
                :checked="entry.isChecked"
                color="primary"
                @update:modelValue="handleChange((entry.isChecked = $event))"
                :modelValue="entry.isChecked"
                :disabled="counter.length !== 9 ? false : counter.length === 9 ? !entry.isChecked : entry.isChecked"
              >
              </ion-checkbox>
            </ion-item>
          </ion-list>
        </div>
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
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonCheckbox,
    IonItem,
    IonLabel,
    IonList,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const counter = ref([]);
    const handleChange = async (event: any) => {
      await store.dispatch("users/updateInterests", user.value.interests);
      counter.value = await user.value.interests.filter((val: any) => {
        return val.isChecked === true;
      });
    };
    return {
      user,
      handleChange,
      counter,
    }
  },
});
</script>
