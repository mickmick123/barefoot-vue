import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted } from 'vue'

let messagesCollection: any;

export function useReceiver(Id: any) {
    messagesCollection = firebase.firestore().collection('users').doc(Id)
  
    const userData = ref()
    const unsubscribe = messagesCollection.onSnapshot((snapshot: any) => {
        firebase
          .storage()
          .ref("avatar/" +  snapshot.data().avatar)
          .getDownloadURL()
          .then(function(url) {
            userData.value = {photoUrl: url, id: snapshot.id, ...snapshot.data()}
          })
    })
    onUnmounted(unsubscribe)
  
  return { userData }
}