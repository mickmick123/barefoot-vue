<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="secondary-color">
      <template
        v-if="searchContainer.length > 0 && searchPage === 'friendsNearby'"
      >
        <div
          class="nearby-people"
          v-for="(people, index) in searchContainer"
          :key="index"
        >
          <ion-avatar class="nearbyAvatar">
            <img
              :class="people.status + '-user'"
              :src="
                peopleImages &&
                peopleImages.length > 0 &&
                peopleImages.find((img) => img.id === people.id) &&
                peopleImages.find((img) => img.id === people.id).avatar
              "
              alt=""
            />
          </ion-avatar>
          <div class="nearby-name-container">
            <span class="nearbyName">{{ ucwords(people.fullName) }}</span>
            <div
              class="status-container"
              :class="'color-' + people.status"
              v-show="people.status !== 'normal'"
            >
              <ion-icon :src="star"></ion-icon>
              <span class="nearbyStatus">{{ toUpper(people.status) }}</span>
              <ion-icon :src="star"></ion-icon>
            </div>
          </div>
          <div class="nearby-button-container">
            <ion-button
              color="light"
              @click="
                openPopover({
                  photoUrl:
                    peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar,
                  ...people,
                })
              "
               v-if="
                (myFriendsList.length === 0 ||
                (myFriendsList.length > 0 &&
                  !myFriendsList.some((friend) => friend.id === people.id))) &&
                (myFriendsRequests.length === 0 ||
                (myFriendsRequests.length > 0 &&
                  !myFriendsRequests.some((friend) => friend.id === people.id))) && 
                (mySendRequests.length === 0 ||
                (mySendRequests.length > 0 &&
                  !mySendRequests.some((friend) => friend.id === people.id)))
              "
              >Add</ion-button
            >
            <ion-button
              color="light"
              v-if="myFriendsList.some((friend) => friend.id === people.id)"
              @click="
                gotoMessages(
                  people.id,
                  peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar
                )
              "
              :disabled="disableChat"
              >chat</ion-button
            >
            <ion-button
              @click="
                gotoProfile(
                  people.id,
                  peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar
                )
              "
              >Visit</ion-button
            >
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="nearby-people"
          v-for="(people, index) in peopleNearby"
          :key="index"
        >
          <ion-avatar class="nearbyAvatar">
            <img
              :class="people.status + '-user'"
              :src="
                peopleImages &&
                peopleImages.length > 0 &&
                peopleImages.find((img) => img.id === people.id) &&
                peopleImages.find((img) => img.id === people.id).avatar
              "
              alt=""
            />
          </ion-avatar>
          <div class="nearby-name-container">
            <span class="nearbyName">{{ ucwords(people.fullName) }}</span>
            <div
              class="status-container"
              :class="'color-' + people.status"
              v-show="people.status !== 'normal'"
            >
              <ion-icon :src="star"></ion-icon>
              <span class="nearbyStatus">{{ toUpper(people.status) }}</span>
              <ion-icon :src="star"></ion-icon>
            </div>
          </div>
          <div class="nearby-button-container">
            <ion-button
              color="light"
              @click="
                openPopover({
                  photoUrl:
                    peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar,
                  ...people,
                })
              "
              v-if="
                (myFriendsList.length === 0 ||
                (myFriendsList.length > 0 &&
                  !myFriendsList.some((friend) => friend.id === people.id))) &&
                (myFriendsRequests.length === 0 ||
                (myFriendsRequests.length > 0 &&
                  !myFriendsRequests.some((friend) => friend.id === people.id))) && 
                (mySendRequests.length === 0 ||
                (mySendRequests.length > 0 &&
                  !mySendRequests.some((friend) => friend.id === people.id)))
              "
              >Add</ion-button
            >
            <ion-button
              color="light"
              v-if="myFriendsList.some((friend) => friend.id === people.id)"
              @click="
                gotoMessages(
                  people.id,
                  peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar
                )
              "
              :disabled="disableChat"
              >chat</ion-button
            >
            <ion-button
              @click="
                gotoProfile(
                  people.id,
                  peopleImages &&
                    peopleImages.length > 0 &&
                    peopleImages.find((img) => img.id === people.id) &&
                    peopleImages.find((img) => img.id === people.id).avatar
                )
              "
              >Visit</ion-button
            >
          </div>
        </div>
      </template>
      <template v-if="peopleNearby.length === 0">
        <div class="friend-empty">
          <h3>Searching for a friend</h3>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { star } from "ionicons/icons";
import { computed, defineComponent, ref } from "vue";
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
import Popover from "./popover.vue";
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
    const router = useRouter();
    const store = useStore();
    const peopleNearby = computed(() => store.state.inApp.peopleNearby);
    const peopleImages = computed(() => store.state.inApp.images);
    const searchContainer = computed(() => store.state.inApp.searchContainer);
    const searchPage = computed(() => store.state.inApp.searchPage);
    const user = computed(() => store.state.users.user);
    const myFriendsList = computed(() => store.state.inApp.myFriends);
    const myFriendsRequests = computed(() => store.state.inApp.peopleRequest);
    const mySendRequests = computed(() => store.state.inApp.mySendRequests);
    const disableChat = ref(false);
    const gotoAddFriend = (id: any, avatar: any) => {
      store.dispatch("friends/getUserData", id);
      store.commit("friends/setAvatar", avatar);
      router.push({ name: "friendsPlus" });
    };
    const gotoProfile = (id: any, avatar: any) => {
      store.dispatch("friends/getUserData", id);
      store.commit("friends/setAvatar", avatar);
      store.dispatch("friends/fillFriendGallery", id);
      router.push({ name: "friendsProfile" });
    };
    const gotoMessages = (id: any, avatar: any) => {
      disableChat.value = true;
      store.dispatch("friends/getUserData", id);
      store.commit("friends/setAvatar", avatar);
      const chatId = user.value.id < id ? user.value.id + '_' + id : id + '_' + user.value.id;
      disableChat.value = false;
      router.push('/messages/'+chatId)
    };
    const backToMap = () => {
      router.push("/map");
      menuController.enable(true, "first");
      menuController.open("first");
    };
    const toUpper = (val: any) => {
      return val.toUpperCase();
    };
    const openPopover = async (ev: any) => {
      const popover = await popoverController.create({
        component: Popover,
        event: ev,
        translucent: true,
        componentProps: {
          closeOver: async (val: any) => {
            if (val === 1) {
              gotoAddFriend(ev.id, ev.photoUrl);
            } else {
              await store
                .dispatch("inApp/sendRequest", { user2: ev, user: user.value })
                .then((res) => {
                  console.log(res);
                });
            }
            popover.dismiss();
          },
        },
      });
      await popover.present();

      const { role } = await popover.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    };
    const ucwords = (value: any) => {
      try {
        return value.replace(
          /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
          function (s: string) {
            return s.toUpperCase();
          }
        );
      } catch (error) {
        return null;
      }
    };
    return {
      backToMap,
      peopleNearby,
      peopleImages,
      toUpper,
      star,
      searchPage,
      searchContainer,
      openPopover,
      router,
      ucwords,
      myFriendsList,
      gotoProfile,
      gotoMessages,
      disableChat,
      myFriendsRequests,
      mySendRequests,
    };
  },
});
</script>
