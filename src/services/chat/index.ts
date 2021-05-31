import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
let messagesCollection: any;
let eventMembersCollection: any;
const members = ref<any>([])

export function useChat(chatId: any, receiverData: any) {
   const store = useStore()
   const user = computed(() => store.state.users.user)
    messagesCollection = firebase.firestore().collection('chatRooms').doc(chatId).collection('messages')
    eventMembersCollection = firebase.firestore().collection('chatRooms').doc(chatId)

    const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
    const messages = ref([])
    const unsubscribe = messagesQuery.onSnapshot((snapshot: any) => {
        messages.value = snapshot.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() }))
        .reverse()
    })
    
    const unsubscribeMembers = eventMembersCollection.onSnapshot((snapshot: any) => {
      if(snapshot.exist) {
        members.value = snapshot.data().members
        if(user.value.photoUrl !== members.value.find((e: any)=> e.id === user.value.id).avatar){
          for (const i in members.value) {
              if (members.value[i].id == user.value.id) {
                  members.value[i].avatar = user.value.photoUrl;
                  eventMembersCollection.update({
                      members: members.value
                  })
                 break; //Stop this loop, we found it!
              }
          }
      }
      }
      else {
        members.value = undefined
      }
    })
  const sendMessage = (text: any) => {
    if(!members.value) {
      eventMembersCollection.set({
        members: [
        {
          id: receiverData.value.id,
          avatar: receiverData.value.photoUrl,
          status: receiverData.value.status,
          fullName: receiverData.value.fullName,
        },
        {
          id: user.value.id,
          avatar: user.value.photoUrl,
          status: user.value.status,
          fullName: user.value.fullName,
        }
      ],
      userIds:[receiverData.value.id, user.value.id],
      private: true,
      })
    }
    messagesCollection.add({
        fullName: user.value.fullName,
        id: user.value.id,
        userPhotoURL: user.value.photoUrl,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  onUnmounted(unsubscribe)
  onUnmounted(unsubscribeMembers)
  return { messages, sendMessage }
}