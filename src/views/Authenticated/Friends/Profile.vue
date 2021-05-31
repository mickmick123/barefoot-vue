<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="secondary" collapse="true" v-show="isFriend">
          <ion-button @click="openPopover">
            <ion-icon slot="icon-only" :icon="ellipsisVerticalOutline" ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="darker-color">
        <template v-if="userData">
            <div class="profile-top-container ion-padding">
                <div class="profile-icons">
                    <div class="profile-icon" @click="gotoSendGift(userData.id, avatar)">
                        <ion-icon :src="giftOutline"></ion-icon>
                    </div>
                </div>
                <ion-avatar class="plus-avatar profile-avatar">
                <img
                    :class="userData && userData.status + '-user'"
                    :src="avatar"
                    alt=""
                />
                </ion-avatar>
                <div class="profile-icons">
                    <div class="profile-icon" @click="gotoMessages(userData.id, avatar)">
                        <ion-icon :src="mailOutline"></ion-icon>
                    </div>
                </div>
            </div>
            <div class="profile-name-container">
                <h5>{{ucwords(userData.fullName)}}</h5>
                <div
                    :class="'font-' + userData.status"
                    class="profile-avatar-status"
                    v-if="userData.status !== 'normal'"
                >
                    <div class="profile-plus-star"><ion-icon :src="star"></ion-icon></div>
                    <span class="profile-status">{{ userData.status.toUpperCase() }}</span>
                    <div class="profile-plus-star"><ion-icon :src="star"></ion-icon></div>
                </div>
            </div>
            <div class="friend-profile-gallery">
                <template v-if="gallery.length === 0">
                    <h5>No Image in Gallery</h5>
                </template>
                <template v-else>
                    <div class="friends-photo" v-for="(photo, index) in gallery" :key="index" :style="`background-image: url(${photo.webviewPath})`"></div>
                </template>
            </div>
            <div class="body-items">
                <div class="body-header">
                    <h5>About Me</h5>
                </div>
                <div class="body-content">
                    <template v-if="userData.aboutMe === ''">
                        <h5>Nothing to tell about myself</h5>
                    </template>
                    <template v-else>
                        <p>{{userData.aboutMe}}</p>
                    </template>
                </div>
            </div>
            <div class="body-items">
                <div class="body-header">
                    <h5>Interests</h5>
                </div>
                <div class="body-content">
                    <template v-if="interests.length === 0">
                        <h5>Im trying to find one</h5>
                    </template>
                    <template v-else>
                        <ion-chip v-for="(interest, index) in interests" :key="index" color="secondary">
                            <ion-label>{{interest.val}}</ion-label>
                        </ion-chip>
                    </template>
                </div>
            </div>
            <div class="body-items">
                <div class="body-header">
                    <h5>Received Gifts</h5>
                </div>
                <div class="body-content">
                    <template v-if="userData && !userData.items">
                        <h5>No gifts received</h5>
                    </template>
                    <template v-else>
                        <div class="friend-gift-items">
                            <p><ion-icon :src="candy"></ion-icon> Candy</p>
                            <p>x{{userData.items.candy}}</p>
                        </div>
                        <div class="friend-gift-items">
                            <p><ion-icon :src="flower"></ion-icon> Flower</p>
                            <p>x{{userData.items.flower}}</p>
                        </div>
                        <div class="friend-gift-items">
                            <p><ion-icon :src="booze"></ion-icon> Booze</p>
                            <p>x{{userData.items.booze}}</p>
                        </div>
                        <div class="friend-gift-items">
                            <p><ion-icon :src="tickets"></ion-icon> Tickets</p>
                            <p>x{{userData.items.tickets}}</p>
                        </div>
                        <div class="friend-gift-items">
                            <p><ion-icon :src="points"></ion-icon> Points</p>
                            <p>x{{userData.items.points}}</p>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watchEffect } from "vue";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonChip,
  popoverController,
} from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { star, giftOutline, mailOutline, ellipsisVerticalOutline } from "ionicons/icons";
import Popover from './UnFriend.vue'
export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonChip,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const userData = computed(() => store.state.friends.userData);
    const gallery = computed(() => store.state.friends.gallery);
    const avatar = computed(() => store.state.friends.avatar);
    const epoints = computed(() => store.state.users.epoints);
    const myFriendsList = computed(() => store.state.inApp.myFriends)
    const isFriend = ref(false)
    const interests = ref([])
    watchEffect(() => {
        if(userData.value && userData.value.interests) {
            interests.value = userData.value.interests.filter((val: any) => {
                return val.isChecked === true;
            });
        }
        if((myFriendsList.value && myFriendsList.value.length > 0) && userData.value){
            isFriend.value = myFriendsList.value.some((friend: any) => friend.id === userData.value.id)
        }
        
    })
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
    const openPopover = async(ev: any) => {
      const popover = await popoverController
        .create({
          component: Popover,
          event: ev,
          translucent: true,
          componentProps: {
          closeOver: async (val: any) => {
            if(val===1) {
                store.dispatch('inApp/unfriendUser', {user1Id: user.value.id, user2Id: userData.value.id})
            }
            popover.dismiss();
          },
        },
        })
      await popover.present();

      const { role } = await popover.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
    const gotoSendGift = (id: any, avatar: any) => {
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      router.push({name: 'friendsSendGifts'})
    }
    const gotoMessages = (id: any, avatar: any) => {
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      const chatId = user.value.id < id ? user.value.id + '_' + id : id + '_' + user.value.id;
      router.push('/messages/'+chatId+'/'+id)
    }
    return {
      userData,
      avatar,
      star,
      ucwords,
      candy,
      flower,
      booze,
      tickets,
      points,
      epoints,
      giftOutline,
      mailOutline,
      gallery,
      interests,
      isFriend,
      ellipsisVerticalOutline,
      openPopover,
      gotoSendGift,
      gotoMessages,
    };
  },
});
</script>
