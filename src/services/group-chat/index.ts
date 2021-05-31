import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
let eventCollection: any;
let eventChatCollection: any;
let eventMembersCollection: any;
const members = ref<any>([])
const userIds = ref<any>([])
export function useGroup(category: any, eventId: any) {
  if(category && eventId) {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    eventCollection = firebase.firestore().collection(category).doc(eventId)
    eventChatCollection = firebase.firestore().collection('chatRooms').doc(eventId).collection('messages')
    eventMembersCollection = firebase.firestore().collection('chatRooms').doc(eventId)


    const eventData = ref()
    const unsubscribe = eventCollection.onSnapshot((snapshot: any) => {
        eventData.value = snapshot.data()
    })
    
    const unsubscribeMembers = eventMembersCollection.onSnapshot((snapshot: any) => {
        try {
            members.value = snapshot.data().members
            userIds.value = snapshot.data().userIds
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
        } catch (error) {
            members.value = undefined
            userIds.value = undefined
        }
       
    })

    const messages = ref([])
    const messagesQuery = eventChatCollection.orderBy('createdAt', 'desc').limit(100)
    const unsubscribeMessages = messagesQuery.onSnapshot((snapshot: any) => {
        messages.value = snapshot.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() })).reverse()
    })
    

    const sendMessage = (text: any) => {
        eventChatCollection.add({
            fullName: user.value.fullName,
            id: user.value.id,
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            if(members.value) {
                if(!members.value.some((e: any) => e.id === user.value.id)) {
                    members.value.push(
                        {
                            id: user.value.id,
                            avatar: user.value.photoUrl,
                            status: user.value.status
                        }
                    )
                    userIds.value.push(user.value.id)
                    eventMembersCollection.update({
                        members: members.value,
                        userIds: userIds.value,
                    })
                }
            }else {
                eventMembersCollection.set({
                    members: [{
                        id: user.value.id,
                        avatar: user.value.photoUrl,
                        status: user.value.status
                    }],
                    userIds:[user.value.id],
                    private: false,
                    banner: eventData.value.banner,
                    title: eventData.value.title,
                    category: eventData.value.category,
                })
            }
        })
      }
      onUnmounted(unsubscribe)
      onUnmounted(unsubscribeMembers)
      onUnmounted(unsubscribeMessages)
    return { eventData, sendMessage, messages, members }
  } else {
      return null
  }
   
}