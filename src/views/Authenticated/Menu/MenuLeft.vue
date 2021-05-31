<template>
  <ion-menu :disabled="!showMenu">
    <ion-content>
    <div class="menu-header-container">
        <ion-avatar class="menu-image-container" :class="user && user.status+'-user'">
            <ion-img :src="user && user.photoUrl" />
        </ion-avatar>
        <div class="menu-profile-container">
            <h5>{{user && user.name}}</h5>
            <p>{{computeAge(user && user.birthDate)}}, {{user && ucwords(user.gender)}}, {{user && ucwords(user.civilStatus)}}</p>
            <div class="menu-stats-container">
                <p>0 Followers</p>
                <p>0 Friends</p>
                <p>Current Balance</p>
                <p><span class="barefoot-color">0</span> EP</p>
            </div>
        </div>
    </div>
      <ion-list>
          <ion-menu-toggle>
          <ion-item class="menu-item" lines="none" @click="router.push('/profile')">
            <ion-avatar slot="start">
                <img :src="profileIcon">
            </ion-avatar>
            <ion-label>
              Profile
            </ion-label>
          </ion-item>
          <ion-item class="menu-item" lines="none" @click="router.push('/friends/friends-list')">
            <ion-avatar slot="start">
                <img :src="friendsIcon">
            </ion-avatar>
            <ion-label>
              My Friends
            </ion-label>
          </ion-item>
          <ion-item class="menu-item" lines="none" @click="router.push('/my-messages')">
            <ion-avatar slot="start">
                <img :src="messagesIcon">
            </ion-avatar>
            <ion-label>
              My Messages
            </ion-label>
          </ion-item>
          <ion-item class="menu-item" lines="none" @click="router.push('/upgrade')">
            <ion-avatar slot="start">
                <img :src="upgradeIcon">
            </ion-avatar>
            <ion-label>
              Upgrade
            </ion-label>
          </ion-item>
          <ion-item class="menu-item" lines="none" @click="router.push('/e-points')">
            <ion-avatar slot="start">
                <img :src="epointsIcon">
            </ion-avatar>
            <ion-label>
              E-points
            </ion-label>
          </ion-item>
          <ion-item class="menu-item" lines="none" @click="router.push('/settings')">
            <ion-avatar slot="start">
                <img :src="settingIcon">
            </ion-avatar>
            <ion-label>
              Settings
            </ion-label>
          </ion-item>
          <ion-item button @click="logout" lines="none">
            <ion-avatar slot="start">
                <img :src="logoutIcon">
            </ion-avatar>
            <ion-label>
              Logout
            </ion-label>
          </ion-item>
          </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import {
  IonContent,
  IonMenu,
  IonItem,
  IonList,
  IonLabel,
  IonAvatar,
  IonMenuToggle,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import moment from 'moment'
import { computed } from 'vue';
export default {
  name: "MenuLeft",
  components: {
    IonContent,
    IonMenu,
    IonItem,
    IonList,
    IonLabel,
    IonAvatar,
    IonMenuToggle,
  },
  props: {
    showMenu: Boolean,
  },
  setup() {
    const store = useStore();
    const router = useRouter()
    const user = computed(() => store.state.users.user );
    console.log(user)
    const profileIcon = computed(() => require('../../../../public/assets/images/menu/person-circle-outline.svg'))
    const friendsIcon = computed(() => require('../../../../public/assets/images/menu/people-circle-outline.svg'))
    const messagesIcon = computed(() => require('../../../../public/assets/images/menu/mail-open-outline.svg'))
    const upgradeIcon = computed(() => require('../../../../public/assets/images/menu/trending-up-outline.svg'))
    const epointsIcon = computed(() => require('../../../../public/assets/images/menu/wallet-outline.svg'))
    const settingIcon = computed(() => require('../../../../public/assets/images/menu/settings-outline.svg'))
    const logoutIcon = computed(() => require('../../../../public/assets/images/menu/log-out-outline.svg'))
    const computeAge = (age: any) => {
         return moment().diff(moment(age).format('L'), 'years');
    }
    const ucwords = (value: any) => {
        return value.charAt(0).toUpperCase() + value.slice(1)
    }
    const logout = async () => {
      const res = await store.dispatch("users/userLogout");
       if(res) {
            router.replace('/home')
        }
    };
    return {
      logout,
      user,
      computeAge,
      profileIcon,
      friendsIcon,
      messagesIcon,
      upgradeIcon,
      epointsIcon,
      settingIcon,
      logoutIcon,
      ucwords,
      router,
    };
  },
};
</script>
