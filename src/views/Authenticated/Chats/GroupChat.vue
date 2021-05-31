<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <div class="top-header">
          <ion-avatar v-if="eventData" > <img :src="eventData.banner" alt=""></ion-avatar>
          <div class="top-header-inner">
            <ion-title v-if="eventData">{{eventData && eventData.title}}</ion-title>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding darker-color" :scroll-events="true">
    <template v-if="messages && messages.length > 0">
        <div class="group-chat-container" v-for="(msg, index) in messages" :key="index">
            <div class="group-chat-box" :class="user.id === msg.id ? 'group-me':'group-him'">
                <div class="group-avatar">
                 <ion-avatar v-if="members" :class="members && members.find((e)=> e.id === msg.id).status+'-user'"> <img :src="members.find((e)=> e.id === msg.id).avatar" alt=""></ion-avatar>
                </div>
                <div class="group-content">
                    <span>{{msg && msg.createdAt && moment(msg.createdAt.toDate()+8).calendar()}}</span>
                    <p>{{msg.text}}</p>
                </div>
            </div>
        </div>
        <div id="bottom" style="padding:3px"></div>
    </template>
    </ion-content>
    <ion-footer>
        <div class="chat-input">
            <ion-textarea v-model="newMessage"></ion-textarea>
            <span @click="sendChat"><ion-icon :icon="sendSharp"></ion-icon></span>
        </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, ref, watchEffect, watch, onUpdated } from "vue";
import { useChat } from '../../../services/chat/index'
import { useReceiver } from '../../../services/receiver/index'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonAvatar,
} from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { sendSharp } from "ionicons/icons";
import moment from 'moment';
import { useGroup } from "../../../services/group-chat"
export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonTextarea,
  },
  setup() {
      const route = useRoute()
      const store = useStore()
      const { category, id } = route.params
      const { eventData, sendMessage, messages, members } = useGroup(category, id)
      const user = computed(() => store.state.users.user);
      const newMessage = ref('');
      const sendChat = () => {
          if(newMessage.value !== '') {
            sendMessage(newMessage.value)
            newMessage.value = ''
          }
      }
    const scrollToBottom = (behavior) => {
      try {
        document.getElementById('bottom').scrollIntoView({
          behavior: behavior,
          block: 'center'
        });
      } catch (error) {
        console.log('error on scroll')
      }
    }
    onUpdated(() => {
      try {
        scrollToBottom('auto')
      } catch (error) {
        console.log('error on scroll')
      }
    })
    watch(
      messages,
      () => {
        nextTick(() => {
          scrollToBottom('smooth')
        })
      },
      members,
      { deep: true }
    )
    return {
      sendSharp,
      moment,
      eventData,
      sendMessage,
      newMessage,
      sendChat,
      messages,
      members,
      user,
    };
  },
});
</script>
