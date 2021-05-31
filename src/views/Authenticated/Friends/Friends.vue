<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="!searching">
        <ion-buttons slot="start" collapse="true">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="secondary" collapse="true">
          <ion-button @click="searchHandler">
            <ion-icon slot="icon-only" :icon="search" ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Friends</ion-title>
      </ion-toolbar>
      <ion-toolbar v-else>
        <ion-searchbar ref="searchBar" v-model="searchbar" @ionBlur="searchHandler" @ionChange="handleSearch" debounce="500" animated show-cancel-button="focus"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-tabs
      @ionTabsWillChange="beforeTabChange"
      @ionTabsDidChange="afterTabChange"
    >
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="friends" href="/friends/friends-list" @click="resetSearch">
          <ion-icon :icon="people"></ion-icon>
          <ion-label>Friends</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="requests" href="/friends/friends-request" @click="resetSearch">
          <ion-icon :icon="personAdd"></ion-icon>
          <ion-label>Requests</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="nearby" href="/friends/friends-nearby" @click="resetSearch">
          <ion-icon :icon="search"></ion-icon>
          <ion-label>Nearby</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  menuController,
  IonButtons,
  IonButton,
  IonSearchbar,
} from "@ionic/vue";
import { people, search, personAdd } from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { friendsHandler } from '../../../services/friends'
export default defineComponent({
  components: {
    IonIcon,
    IonLabel,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonSearchbar,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const user = computed(() => store.state.users.user)
    const { friendSearch } = friendsHandler()
    const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
    }
    const searchbar = ref();
    const searching = computed(() => store.state.inApp.searching)

    const beforeTabChange = () => {
      // do something before tab change
    };
    const afterTabChange = () => {
      // do something after tab change
    };
    const searchHandler = () => {
      store.dispatch('inApp/closeOpenSearch',searching.value ? false: true)
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
    const handleSearch = async () => {
      // await store.dispatch('inApp/searching', {search: searchbar.value.toLowerCase(), route: route.name, id: user.value.id})
      friendSearch(searchbar.value.toLowerCase(), route.name)
    }
    const resetSearch = async () => {
       searchbar.value = ''
       store.commit('inApp/fillSearch', [])
       store.dispatch('inApp/searchingStatus', false)
    }
    return {
      beforeTabChange,
      afterTabChange,
      backToMap,
      people,
      search,
      personAdd,
      searching,
      searchHandler,
      searchbar,
      handleSearch,
      resetSearch,
    };
  },
});
</script>
