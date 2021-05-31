import firebase from "firebase";
import * as geofire from "geofire-common";
export default {
  namespaced: true,
  state: {
    id: undefined,
    messages: [],
    receiver: undefined,
  },
  mutations: {
      setChatId(state: any, payload: any){
          state.id = payload;
      },
      fillMessages(state: any, payload: any){
        state.messages.push(payload)
      },
      setReceiver(state: any, payload: any){
          state.receiver = payload;
      }
  },
  actions: {
    //   firstMessage({state, commit}: any, payload: any) {
    //       firebase.firestore().collection("chatRooms").add({
    //           members:[payload.sender.id, payload.receiver.id]
    //       }).then((snapshot) => {
    //           firebase.firestore().collection("chatRooms").doc(snapshot.id).collection('messages').add({
    //             fullName: payload.sender.fullName,
    //             id: payload.sender.id,
    //             userPhotoURL: payload.sender.photoUrl,
    //             text: payload.message,
    //             createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //           })
    //           commit('setChatId', snapshot.id)
    //       })
    //   },
    //   sendMessage({state, commit}: any, payload: any) {
    //     firebase.firestore().collection("chatRooms").doc(state.id).collection('messages').add({
    //         fullName: payload.sender.fullName,
    //         id: payload.sender.id,
    //         userPhotoURL: payload.sender.photoUrl,
    //         text: payload.message,
    //         createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //       })
    //   },
      async getCurrentChatId({state, commit}: any, payload: any) {
        commit('users/setLoading', true, {root: true})
        const chatId = payload.id1 < payload.id2 ? payload.id1+'_'+payload.id2 : payload.id2+'_'+payload.id1
        const query = firebase.firestore().collection("chatRooms").doc(chatId).get().then(async (snapshot) => {
            if(snapshot.exists){
                commit('setChatId', snapshot.id)
                commit('setReceiver', payload.id2) 
            } else {
              await firebase.firestore().collection("chatRooms").doc(chatId).set({
                members:[payload.id1, payload.id2]
            }).then((snapshot) => {
                commit('setChatId', chatId)
                commit('setReceiver', payload.id2)
            })
            }
            commit('users/setLoading', false, {root: true})
            return true
        })
      },
    //   async loadMessages({state, commit}: any, payload: any) {
    //     await firebase.firestore().collection("chatRooms").doc(state.id).collection("messages").orderBy("createdAt").get().then((snapshots) => {
    //         snapshots.forEach((doc) => {
    //             commit('fillMessages', doc.data())
    //         })
    //     })
    //   }
  },
  getters: {
    getChatId: (state: { id: any }) => {
        return state.id;
    },
  },
};
