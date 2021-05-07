<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="secondary-color">
      <template v-if="searchContainer.length > 0 && searchPage ==='friendsRequest'">
        <div class="nearby-people" v-for="(people, index) in searchContainer" :key="index" >
          <ion-avatar class="nearbyAvatar" >
            <img :class="people.status+'-user'" :src="peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar" alt="">
          </ion-avatar>
          <div class="nearby-name-container">
            <span class="nearbyName">{{ucwords(people.fullName)}}</span>
            <div class="status-container" :class="'color-'+people.status" v-show="people.status !== 'normal'">
                <ion-icon :src="star"></ion-icon>
                <span class="nearbyStatus">{{toUpper(people.status)}}</span>
                <ion-icon :src="star"></ion-icon>
            </div>
          </div>
          <div class="nearby-button-container">
            <ion-button color="light" @click="acceptance(1, people.id)">Confirm</ion-button>
            <ion-button color="dark" @click="acceptance(2, people.id)">Decline</ion-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="nearby-people" v-for="(people, index) in peopleRequest" :key="index" >
          <ion-avatar class="nearbyAvatar" >
            <img :class="people.status+'-user'" :src="peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar" alt="">
          </ion-avatar>
          <div class="nearby-name-container">
            <span class="nearbyName">{{ucwords(people.fullName)}}</span>
            <div class="status-container" :class="'color-'+people.status" v-show="people.status !== 'normal'">
                <ion-icon :src="star"></ion-icon>
                <span class="nearbyStatus">{{toUpper(people.status)}}</span>
                <ion-icon :src="star"></ion-icon>
            </div>
          </div>
          <div class="nearby-button-container">
            <ion-button color="light" @click="acceptance(1, people.id)">Confirm</ion-button>
            <ion-button color="dark" @click="acceptance(2, people.id)">Decline</ion-button>
          </div>
        </div>
      </template>
      <template v-if="peopleRequest.length === 0">
        <div class="friend-empty">
          <h3>You dont have a friend request</h3>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { star } from 'ionicons/icons';
import { computed, defineComponent, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  menuController,
  IonIcon,
  IonAvatar,
  IonButton,
  popoverController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Popover from './popover.vue'
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonAvatar,
    IonButton,
  },
   setup() {
    const router = useRouter()
    const store = useStore()
    const peopleRequest = computed(() => store.state.inApp.peopleRequest)
    const peopleImages = computed(() => store.state.inApp.images)
    const searchContainer = computed(() => store.state.inApp.searchContainer)
    const searchPage = computed(() => store.state.inApp.searchPage)
    const user = computed(() => store.state.users.user)
    const myFriendsList = computed(() => store.state.friends.myFriends)
    const gotoAddFriend = (id: any, avatar: any) => {
      console.log(avatar)
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      router.push({name: 'friendsPlus'})
    }
    const backToMap = () => {
      router.push("/map");
      menuController.enable(true, "first");
      menuController.open("first");
    };
    const toUpper = (val: any) => {
      return val.toUpperCase()
    }
     const openPopover = async(ev: any) => {
      const popover = await popoverController
        .create({
          component: Popover,
          event: ev,
          translucent: true,
          componentProps: {
          closeOver: async (val: any) => {
            if(val===1) {
              gotoAddFriend(ev.id, ev.photoUrl)
            } else {
              await store.dispatch('inApp/sendRequest', {user2: ev, user: user.value}).then((res) => {
                console.log(res)
              })
            }
            popover.dismiss();
          },
        },
        })
      await popover.present();

      const { role } = await popover.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
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
    const acceptance = (key: any, id: any) => {
      if(key==1) {
        store.dispatch('inApp/acceptUser', {user1Id: user.value.id, user2Id: id})
      } else {
        store.dispatch('inApp/declineUser', {user1Id: user.value.id, user2Id: id})
      }
      
    }
    return {
      backToMap,
      peopleRequest,
      peopleImages,
      toUpper,
      star,
      searchPage,
      searchContainer,
      openPopover,
      myFriendsList,
      router,
      ucwords,
      acceptance,
    };
  },
});
</script>
