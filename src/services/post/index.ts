import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted } from 'vue'

let eventColletion: any;

export function useEvents(category: any, Id: any) {
    eventColletion = firebase.firestore().collection(category).doc(Id)
  
    const eventData = ref<any>(undefined)
    const unsubscribe = eventColletion.onSnapshot((snapshot: any) => {
        console.log(snapshot.data())
        eventData.value = snapshot.data()
    })
    onUnmounted(unsubscribe)
  
  return { eventData }
}