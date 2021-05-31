<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Add Friend PLUS!</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="plus-top-container" v-if="userData">
        <div class="plus-avatar-container">
          <ion-avatar class="plus-avatar">
            <img
              :class="userData && userData.status + '-user'"
              :src="avatar"
              alt=""
            />
          </ion-avatar>
          <div
            class="plus-avatar-status"
            :class="'color-' + userData.status"
            v-if="userData.status !== 'normal'"
          >
            <div class="plus-star"><ion-icon :src="star"></ion-icon></div>
            <span>{{ toUpper(userData.status) }}</span>
            <div class="plus-star"><ion-icon :src="star"></ion-icon></div>
          </div>
        </div>
        <div class="plus-avatar-information">
          <h5>{{ ucwords(userData.fullName) }}</h5>
          <span>{{ ucwords(userData.civilStatus) }}</span>
          <span>0 Friends</span>
          <span>0 Followers</span>
          <p>A friend request will be sent together with the gifts.</p>
        </div>
      </div>
      <div class="plus-points-container">
        <h3>Current E-Points</h3>
        <h3>
          <span>{{ epoints }}</span> EP
        </h3>
      </div>
      <div class="plus-gift-items">
        <p><ion-icon :src="candy"></ion-icon>Candy</p>
        <p>( 10 EP )</p>
        <ion-input
          class="number-input"
          type="number"
          v-model="pointValues[0]"
          clear-on-edit
          placeholder="0"
        ></ion-input>
      </div>
      <div class="plus-gift-items">
        <p><ion-icon :src="flower"></ion-icon>Flower</p>
        <p>( 50 EP )</p>
        <ion-input
          class="number-input"
          type="number"
          v-model="pointValues[1]"
          clear-on-edit
        ></ion-input>
      </div>
      <div class="plus-gift-items">
        <p><ion-icon :src="booze"></ion-icon>Booze</p>
        <p>( 100 EP )</p>
        <ion-input
          class="number-input"
          type="number"
          v-model="pointValues[2]"
          clear-on-edit
        ></ion-input>
      </div>
      <div class="plus-gift-items">
        <p><ion-icon :src="tickets"></ion-icon>Tickets</p>
        <p>( 500 EP )</p>
        <ion-input
          class="number-input"
          type="number"
          v-model="pointValues[3]"
          clear-on-edit
        ></ion-input>
      </div>
      <div class="plus-gift-items">
        <p><ion-icon :src="points"></ion-icon>Points</p>
        <p>( 1000 EP )</p>
        <ion-input
          class="number-input"
          type="number"
          v-model="pointValues[4]"
          clear-on-edit
        ></ion-input>
      </div>
    </ion-content>
    <ion-footer class="about-footer">
      <ion-button @click="submitGifts">DONE!</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonAvatar,
  IonInput,
  IonFooter,
  IonButton,
  alertController,
} from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { star } from "ionicons/icons";

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonAvatar,
    IonInput,
    IonFooter,
    IonButton,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const userData = computed(() => store.state.friends.userData);
    const avatar = computed(() => store.state.friends.avatar);
    const epoints = computed(() => store.state.users.epoints);
    const candy = computed(() =>
      require("../../../../public/assets/images/profile/candy.svg")
    );
    const flower = computed(() =>
      require("../../../../public/assets/images/profile/flower.svg")
    );
    const booze = computed(() =>
      require("../../../../public/assets/images/profile/booze.svg")
    );
    const tickets = computed(() =>
      require("../../../../public/assets/images/profile/tickets.svg")
    );
    const points = computed(() =>
      require("../../../../public/assets/images/profile/points.svg")
    );
    const pointValues = ref([0, 0, 0, 0, 0]);
    const submitGifts = async (pointCategory: any) => {
      const multiplier1 = pointValues.value[0] * 10;
      const multiplier2 = pointValues.value[1] * 50;
      const multiplier3 = pointValues.value[2] * 100;
      const multiplier4 = pointValues.value[3] * 500;
      const multiplier5 = pointValues.value[4] * 1000;
      const total = multiplier1 + multiplier2 + multiplier3 + multiplier4 + multiplier5;
      if(total>epoints.value){
        const alert = await alertController
          .create({
            header: 'Alert',
            subHeader: 'Failed to Send',
            message: 'You have insufficient points, make sure that your inputs will not exceed your current points',
            buttons: ['OK'],
          });
        await alert.present();
      }else {
        const alert = await alertController
        .create({
          header: 'Confirm!',
          message: `You will consume a total of ${total} EP, press Okay to continue.`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Okay',
              handler: async () => {
                
                await store.dispatch("inApp/sendRequestWithGift", {total: total, epoints: epoints.value, pointValues: pointValues.value, user: user.value, user2: userData.value}).then(async (res) => {
                  if(res) {
                    await store.dispatch('inApp/sendRequest', {user: user.value, user2: userData.value}).then(() => {
                       store.commit("users/successMessage", "Your request has been sent with priority.");
                       router.go(-1)
                    })
                  }
                })
                
              },
            },
          ],
        });
      return alert.present();
      }
    };
    const ucwords = (value: any) => {
      try {
        return value.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
          function(s: string){
            return s.toUpperCase();
        });
      } catch (error) {
        return null;
      }
    };
    const toUpper = (val: any) => {
      return val.toUpperCase();
    };
    onMounted(async () => {
      // await store.dispatch('friends/getUserData', id)
    });
    return {
      userData,
      avatar,
      toUpper,
      star,
      ucwords,
      candy,
      flower,
      booze,
      tickets,
      points,
      epoints,
      submitGifts,
      pointValues,
    };
  },
});
</script>
