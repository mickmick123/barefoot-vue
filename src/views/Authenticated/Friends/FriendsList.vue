<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="secondary-color">
      <template v-if="searchContainer && searchContainer.length > 0">
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
            <ion-button color="light" @click="gotoMessages(people.id, peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar)" :disabled="disableChat">Chat</ion-button>
            <ion-button @click="gotoProfile(people.id, peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar)">visit</ion-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="nearby-people" v-for="(people, index) in friendsList" :key="index" >
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
            <ion-button color="light" @click="gotoMessages(people.id, peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar)" :disabled="disableChat">Chat</ion-button>
            <ion-button @click="gotoProfile(people.id, peopleImages && peopleImages.length > 0 && peopleImages.find(img => img.id === people.id) && peopleImages.find(img => img.id === people.id).avatar)">visit</ion-button>
          </div>
        </div>
      </template>
      <template v-if="friendsList.length === 0">
        <div class="friend-empty">
          <h3>Go on and find new friends</h3>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { star } from 'ionicons/icons';
import { computed, defineComponent, nextTick, onMounted, ref, watch } from "vue";
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
import { friendsHandler } from '../../../services/friends'
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
    const myFriendsList = computed(() => store.state.inApp.myFriends)
    const peopleImages = computed(() => store.state.inApp.images)
    const searchContainer = computed(() => store.state.inApp.searchContainer)
    const searchPage = computed(() => store.state.inApp.searchPage)
    const user = computed(() => store.state.users.user)
    const myFriends = computed(() => store.state.friends.myFriends)
    const disableChat = ref(false)
    const { friendsList } = friendsHandler();
    watch(
      friendsList,
      () => {
        nextTick(() => {
            console.log('searching')
        //  bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )
    const gotoProfile = (id: any, avatar: any) => {
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      store.dispatch('friends/fillFriendGallery', id)
      router.push({name: 'friendsProfile'})
    }
    const gotoMessages = (id: any, avatar: any) => {
      disableChat.value = true;
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      const chatId = user.value.id < id ? user.value.id + '_' + id : id + '_' + user.value.id;
      disableChat.value = false;
      router.push('/messages/'+chatId+'/'+id)
    }
    const backToMap = () => {
      router.push("/map");
      menuController.enable(true, "first");
      menuController.open("first");
    };
    const toUpper = (val: any) => {
      return val.toUpperCase()
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
      myFriendsList,
      peopleImages,
      toUpper,
      star,
      searchPage,
      searchContainer,
      myFriends,
      router,
      ucwords,
      acceptance,
      gotoProfile,
      gotoMessages,
      disableChat,
      friendsList,
    };
  },
});
</script>
