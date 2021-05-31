import firebase from "firebase";
import * as geofire from "geofire-common";
export default {
  namespaced: true,
  state: {
    userData: null,
    avatar: null,
    gallery: [],
  },
  mutations: {
      setUserData(state: any, payload: any) {
          state.userData = payload
      },
      setAvatar(state: any, payload: any) {
        state.avatar = payload
    }
  },
  actions: {
      async getUserData({state, commit}: any, payload: any) {
        commit('setUserData', null)
        commit('users/setLoading', true, {root:true})
         await firebase.firestore().collection("users").doc(payload).get().then((snapshot) => {
             commit('setUserData',{id: snapshot.id, ...snapshot.data()})
             commit('users/setLoading', false, {root:true})
         })
      },
      async fillFriendGallery({ state, commit }: any, payload: any) {
        state.gallery = [];
        await firebase
          .firestore()
          .collection("users")
          .doc(payload)
          .collection("gallery")
          .get()
          .then((snapshot) => {
            snapshot.docs.map(async (doc) => {
              await firebase
                .storage()
                .ref(`gallery/${doc.data().fileName}`)
                .getDownloadURL()
                .then((url) => {
                  state.gallery.push({
                    filepath: doc.data().fileName,
                    webviewPath: url,
                  });
                });
            });
          });
      },
  },
  getters: {},
};
