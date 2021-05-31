<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>Messages</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="secondary-color" :fullscreen="true">
      <template v-if="messageData.length > 0">
        <div class="messages-container" v-for="(people, index) in messageData" :key="index" @click="people.private ? gotoMessages(people.members.find((e)=> e.id!==user.id).id,people.members.find((e)=> e.id!==user.id).avatar, people.chatId): gotoGroupMessages(people.chatId, people.category)">
          <div class="messages-avatar">
              <ion-avatar>
                <img v-if="people.private" :class="people.members.find((e)=> e.id!==user.id).status+'-user'" :src="people.members.find((e)=> e.id!==user.id).avatar" alt="">
                <img v-else :src="people.banner" />
            </ion-avatar>
          </div>
          <div class="messages-name-container">
            <span class="messagesName" v-if="people.private">{{ucwords(people.members.find((e)=> e.id!==user.id).fullName)}}</span>
            <span class="messagesName" v-else>{{ucwords(people.title)}}</span>
            <span class="messages-timespan"><i>{{moment(people.createdAt.toDate()+8).calendar()}}</i></span>
            <span class="messages-text">{{truncate(people.text)}}</span>
          </div>
          <div class="message-selector"></div>
        </div>
        
      </template>
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
  menuController,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useMessages } from "../../services/messages"
import moment from 'moment'
export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const user = computed(() => store.state.users.user)
    const { messageData } = useMessages()
    const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
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
    const toUpper = (val: any) => {
      return val.toUpperCase()
    }
    const truncate = (source: any) => {
        return source.length > 50 ? source.slice(0, 50 - 1) + "…" : source;
    }
    const gotoMessages = (id: any, avatar: any, chatId: any) => {
      store.dispatch('friends/getUserData', id)
      store.commit('friends/setAvatar', avatar)
      router.push('/messages/'+chatId+'/'+id)
    }
    const gotoGroupMessages = (chatId: any, category: any) => {
        router.push(`/group-messages/${category}/${chatId}`)
    }
    return {
        user,
        backToMap,
        messageData,
        ucwords,
        toUpper,
        moment,
        truncate,
        gotoMessages,
        gotoGroupMessages,
    };
  },
});
</script>
