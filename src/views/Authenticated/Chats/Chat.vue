<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <div class="top-header">
          <ion-avatar v-if="userData" :class="userData && userData.status+'-user'"> <img :src="userData.photoUrl" alt=""></ion-avatar>
          <div class="top-header-inner">
            <ion-title v-if="userData">{{ucwords(userData.fullName)}}</ion-title>
            <span v-if="userData && userData.userStatus">{{userData.userStatus.online ? 'Now' : moment(userData.userStatus.lastSeen.toDate()+8).calendar()}}</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding darker-color" id="chatContent" :scroll-events="true">
    <template v-if="messages && messages.length > 0">
        <div v-for="chat, index in messages" :key="index" class="chat-body" :class="chat.id === user.id ? 'chat-sender': 'chat-receiver'">
            <div class="chat-box">
                <div class="chat-container" >
                    <div class="chat-header">
                        <span>{{ucwords(chat.fullName)}} <i>{{chat.createdAt && moment(chat.createdAt.toDate()+8).calendar()}}</i></span>
                    </div>
                    <div class="chat-content">
                        <p>{{chat.text}}</p>
                    </div>
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
export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonTextarea,
    IonAvatar,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const newMessage = ref('');
    const { id, receiverId } = route.params;
    const { userData } = useReceiver(receiverId)
    const { messages, sendMessage } = useChat(id, userData);
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
    watch(
      messages,
      () => {
        nextTick(() => {
          scrollToBottom('smooth')
        })
      },
      { deep: true }
    )
    onUpdated(() => {
      try {
        scrollToBottom('auto')
      } catch (error) {
        console.log('error on scroll')
      }
    })
    const ucwords = (value) => {
      try {
        return value.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
          function(s){
            return s.toUpperCase();
        });
      } catch (error) {
        return null;
      }
    };
    const sendChat = () => {
        sendMessage(newMessage.value)
        // if(chatId.value === undefined) {
        //     store.dispatch('chats/firstMessage', {message: newMessage.value, sender: user.value, receiver: userData.value})
        // } else {
        //     store.dispatch('chats/sendMessage', {message: newMessage.value, sender: user.value, receiver: userData.value})
        // }
        newMessage.value = ''
    }
    return {
      userData,
      ucwords,
      sendSharp,
      newMessage,
      sendChat,
      messages,
      user,
      moment,
      sendMessage,
      scrollToBottom,
    };
  },
});
</script>
