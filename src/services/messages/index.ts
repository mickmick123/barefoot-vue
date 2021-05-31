import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex';

let messagesCollection: any;
let chatCollection: any;

export function useMessages() {
    const store = useStore();
    const user = computed(() => store.state.users.user)
    messagesCollection = firebase.firestore().collection('chatRooms')
    .where("userIds", "array-contains", user.value.id)
    chatCollection = firebase.firestore().collection('chatRooms')

    const messageData = ref<any>([])
    const unsubscribe = messagesCollection.onSnapshot((snapshot: any) => {
        const promises = snapshot.docs.map((doc: any) => {
            return chatCollection.doc(doc.id).collection('messages').orderBy('createdAt', 'desc').limit(1).get().then((res: any) => {
                const response = res.docs
                .map((doc2: any) => ({ chatId:doc.id ,...doc.data(), ...doc2.data() }))
                return {...response[0]}
            })
        })
        Promise.all(promises)
        .then(results => {
            messageData.value = results
        })
        .catch(e => {
            console.error(e);
        })
    })
    onUnmounted(unsubscribe)
  
  return { messageData }
}