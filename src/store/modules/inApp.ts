import firebase from "firebase";
import * as geofire from "geofire-common";
export default {
  namespaced: true,
  state: {
    fromLogin: false,
    peopleNearby: [],
    images: [],
    searchContainer: [],
    searchPage: 'idle',
    searching: false,
    requesting:{},
    peopleRequest: [],
    myFriends:[],
    mySendRequests: [],
  },
  mutations: {
    fillSearch(state: any, payload: any) {
      state.searchContainer = payload
    },
    fillMyRequests(state: any, payload: any) {
      state.mySendRequests.push(payload)
    },
    requesting(state: any, payload: any) {
      state.requesting = payload
    },
    clearRequesting(state: any, payload: any) {
      state.requesting = {}
    },
    isFromLogin(state: any, payload: any) {
      state.fromLogin = payload;
    },
    removeFromRequest(state: any, payload: any) {
      state.peopleRequest = state.peopleRequest.filter((friend: any) => friend.id !== payload)
    },
    removeFromFriends(state: any, payload: any) {
      state.myFriends = state.myFriends.filter((friend: any) => friend.id !== payload)
    },
    pushImage(state: any, payload: any) {
      const flag = state.images.some((img: any) => img.id === payload.id).avatar
      if(!flag) {
        new Promise((resolve, reject) => {
          firebase
          .storage()
          .ref("avatar/" + payload.avatar)
          .getDownloadURL()
          .then(function(url) {
            state.images.push({avatar: url, id: payload.id})
          })
        })
      }
    },
  },
  actions: {
    async sendRequestWithGift({state, commit}: any, payload: any) {
      const currentPoints = firebase.firestore().collection("epoints").doc(payload.user.id).get();
      if((await currentPoints).exists){
        const updatedPoints = parseInt((await currentPoints).data()?.current) - payload.total;
        firebase.firestore().collection("epoints").doc(payload.user.id).set({current: updatedPoints})
        commit('users/fillEpoints', updatedPoints, {root: true})
        const friendUser = firebase.firestore().collection("users").doc(payload.user2.id).get();
        if((await friendUser).exists){
          const friendUserItems = (await friendUser).data()?.items
          if(!friendUserItems) {
            firebase.firestore().collection("users").doc(payload.user2.id).update({
              items: {
                candy: parseInt(payload.pointValues[0]),
                flower: parseInt(payload.pointValues[1]),
                booze: parseInt(payload.pointValues[2]),
                tickets: parseInt(payload.pointValues[3]),
                points: parseInt(payload.pointValues[4]),
              }
            })
          } else {
            firebase.firestore().collection("users").doc(payload.user2.id).update({
              items: {
                candy: parseInt(friendUserItems.candy) + parseInt(payload.pointValues[0]),
                flower: parseInt(friendUserItems.flower) + parseInt(payload.pointValues[1]),
                booze: parseInt(friendUserItems.booze) + parseInt(payload.pointValues[2]),
                tickets: parseInt(friendUserItems.tickets) + parseInt(payload.pointValues[3]),
                points: parseInt(friendUserItems.points) + parseInt(payload.pointValues[4]),
              }
            })
          }
          return true
        }
        return false
      }
      return false
    },
    async sendRequest({state, commit}: any, payload: any) {
      const currentUser = {
        requestor: true,
        status: 'pending',
        date: new Date(),
      }
      const user2 = {
        requestor: false,
        status: 'pending',
        date: new Date(),
      }
      commit('fillMyRequests', {id: payload.user2.id, ...currentUser}, {root:true})
      try {
        firebase
        .firestore()
        .collection("users")
        .doc(payload.user.id)
        .collection("friends")
        .doc(payload.user2.id)
        .set(currentUser).then(async()=>{
           firebase
          .firestore()
          .collection("users")
          .doc(payload.user2.id)
          .collection("friends")
          .doc(payload.user.id)
          .set(user2)
        })
      } catch (error) {
        commit("users/appError", {
          error: "Something went wrong, please submit a ticket",
        }, {root:true});
        commit('users/removeFriend', {id: payload.user2.id, ...currentUser}, {root:true})
      }
       
    },
    closeOpenSearch({state, commit}: any, payload: any) {
      if(!payload) {
        state.searching = false;
      }else {
        state.searching = true;
      }
    },
    searchingStatus({state, commit}: any, payload: any) {
      if(!payload) {
        state.searching = false;
        state.searchPage = 'idle';
        state.seachContainer = [];
      }else {
        state.searching = true;
      }
    },
    async acceptUser({commit, state}: any, payload: any) {
      await firebase.firestore().collection("users").doc(payload.user1Id).collection("friends").doc(payload.user2Id).update({status: 'accepted'})
      await firebase.firestore().collection("users").doc(payload.user2Id).collection("friends").doc(payload.user1Id).update({status: 'accepted'})
      commit('removeFromRequest', payload.user2Id)
    },
    async declineUser({commit, state}: any, payload: any) {
      await firebase.firestore().collection("users").doc(payload.user1Id).collection("friends").doc(payload.user2Id).delete()
      await firebase.firestore().collection("users").doc(payload.user2Id).collection("friends").doc(payload.user1Id).delete()
      commit('removeFromRequest', payload.user2Id)
    },
    async unfriendUser({commit, state}: any, payload: any) {
      await firebase.firestore().collection("users").doc(payload.user1Id).collection("friends").doc(payload.user2Id).delete()
      await firebase.firestore().collection("users").doc(payload.user2Id).collection("friends").doc(payload.user1Id).delete()
      commit('removeFromFriends', payload.user2Id)
    },
    async searching({commit, state}: any, payload: any) {
      console.log(payload.route)
      state.searchContainer = []
      state.searchPage = payload.route
      if(payload.route === 'friendsNearby') {
        await firebase
        .firestore().collection("users").orderBy('fullName').startAt(payload.search).endAt(payload.search+ "\uf8ff")
        .get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if(doc.id !== payload.id) {
              state.searchContainer.push({id: doc.id, ...doc.data()})
              commit('pushImage', {avatar: doc.data().avatar, id: doc.id})
            }
          })
        })
      } else if (payload.route === 'friendsList') {
        state.searchContainer = state.myFriends.filter((o: any) => {
          return o.fullName.indexOf(payload.search) !== -1
        })
      } else {
        state.searchContainer = state.peopleRequest.filter((o: any) => {
          return o.fullName.indexOf(payload.search) !== -1
        })
      }
    },
    async getRequest({ commit, state}: any, payload: any) {
        await firebase.firestore().collection("users").doc(payload).collection("friends").where("status", "==", "pending").where("requestor", "==", false).get().then((snapshot) => {
          const fr: any[] = [];
          snapshot.forEach((doc) => {
            fr.push({id: doc.id})
          })
          // commit('fillRequest', fr)
          Promise.all(fr).then((snapshots) => {
            snapshots.forEach((f: any) => {
              firebase.firestore().collection("users").doc(f.id).get().then((snap) => {
                commit('pushImage', {avatar: snap.data()?.avatar, id: snap.id})
                state.peopleRequest.push({id: snap.id, ...snap.data()})
              })
              
            })
          });
        });
    },
    async getMyRequest({ commit, state}: any, payload: any) {
      await firebase.firestore().collection("users").doc(payload).collection("friends").where("status", "==", "pending").where("requestor", "==", true).get().then((snapshot) => {
        const fr: any[] = [];
        snapshot.forEach((doc) => {
          fr.push({id: doc.id})
        })
        // commit('fillRequest', fr)
        Promise.all(fr).then((snapshots) => {
          snapshots.forEach((f: any) => {
            firebase.firestore().collection("users").doc(f.id).get().then((snap) => {
              commit('pushImage', {avatar: snap.data()?.avatar, id: snap.id})
              commit('fillMyRequests', {id: snap.id, ...snap.data()})
            })
            
          })
        });
      });
  },
    async getFriends({ commit, state}: any, payload: any) {
      await firebase.firestore().collection("users").doc(payload).collection("friends").where("status", "==", "accepted").get().then((snapshot) => {
        const fr: any[] = [];
        snapshot.forEach((doc) => {
          fr.push({id: doc.id})
        })
        // commit('fillRequest', fr)
        Promise.all(fr).then((snapshots) => {
          snapshots.forEach((f: any) => {
            firebase.firestore().collection("users").doc(f.id).get().then((snap) => {
              commit('pushImage', {avatar: snap.data()?.avatar, id: snap.id})
              state.myFriends.push({id: snap.id, ...snap.data()})
            })
            
          })
        });
      });
  },
    findPeople({ commit, state}: any, payload: any) {
        return new Promise((resolve, reject) => {
        const center = [payload.latitude, payload.longitude];
        const radiusInM = 1000 * 1000;
        
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
            const q = firebase.firestore()
            .collection("users")
            .orderBy("geohash")
            .startAt(b[0])
            .endAt(b[1]);

            promises.push(q.get());
        }

        Promise.all(promises)
            .then((snapshots) => {
            const matchingDocs = [];

            for (const snap of snapshots) {
                for (const doc of snap.docs) {
                const lat = doc.get("coordinates.latitude");
                const lng = doc.get("coordinates.longitude");

                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                  if (distanceInM <= radiusInM) {
                      if(doc.id !== payload.id) {
                        matchingDocs.push({id: doc.id, ...doc.data()});
                        commit('pushImage', {avatar: doc.data().avatar, id: doc.id})
                      }
                  }
                }
            }

            return matchingDocs;
            })
            .then((matchingDocs) => {
              state.peopleNearby.push(...matchingDocs)
            });
        })
    },
  },
  getters: {},
};
