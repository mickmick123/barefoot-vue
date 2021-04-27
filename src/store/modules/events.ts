import firebase from "firebase";

export default {
  namespaced: true,
  state: {
    event: undefined,
    status: 'idle'
  },
  mutations: {
    setEvent (state: any, payload: any) {
        state.event = payload
    },
    eventStatus  (state: any, payload: any) {
        state.status = payload
    }
  },
  actions: {
    async getEvent({ commit }: any, payload: any) {
        return new Promise((resolve, reject) => {
            try {
               firebase
                  .firestore()
                  .collection("events")
                  .doc(payload)
                  .get().then((res) => {
                    if(res.exists){
                        commit('setEvent', res.data())
                        resolve(res.data())
                    }
                  })
                  
              } catch (error) {
                resolve(undefined)
              }
        })
      
    },
    async confirmAttendance({ commit, state }: any, payload: any) {
        return new Promise((resolve, reject) => {
            try {
              firebase
                .firestore()
                .collection("users")
                .doc(payload.user.id)
                .collection("events").doc(payload.event.eventId)
                .set({
                  value: 'attending',
                })
                .then(() => {
                    const attendies = payload.event.attendies
                    attendies.push({id: payload.user.id,
                        gender: payload.user.gender,
                        name: payload.user.name})
                    state.event.attendies = attendies
                    firebase
                        .firestore()
                        .collection("events")
                        .doc(payload.event.eventId)
                        .update({
                            attendies: attendies
                        })
                        .then(() => {
                            resolve(true)
                        });  
                });  
              } catch (error) {
                resolve(false)
              }
        })
    },
    async cancelAttendance({ commit, state }: any, payload: any) {
        return new Promise((resolve, reject) => {
            try {
              firebase
                .firestore()
                .collection("users")
                .doc(payload.user.id)
                .collection("events").doc(payload.event.eventId)
                .set({
                  value: 'cancelled',
                })
                .then(() => {
                    const attendies = payload.event.attendies.filter((obj: { id: any }) => obj.id !== payload.user.id)
                    state.event.attendies = attendies
                    console.log(attendies)
                    firebase
                        .firestore()
                        .collection("events")
                        .doc(payload.event.eventId)
                        .update({
                            attendies: attendies
                        })
                        .then(() => {
                            resolve(true)
                        });  
                });  
              } catch (error) {
                resolve(false)
              }
        })
    },
    async likeEvent({ commit, state }: any, payload: any) {
        return new Promise((resolve, reject) => {
            try {
              firebase
                .firestore()
                .collection("users")
                .doc(payload.user.id)
                .collection("events").doc(payload.event.eventId)
                .update({
                  like: payload.like,
                })
                .then(() => {
                    const likes = payload.like ? payload.event.likes + 1 : payload.event.likes - 1
                    state.event.likes = likes
                    firebase
                        .firestore()
                        .collection("events")
                        .doc(payload.event.eventId)
                        .update({
                            likes: likes
                        })
                        .then(() => {
                            resolve(true)
                        });  
                });  
              } catch (error) {
                try {
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(payload.user.id)
                      .collection("events").doc(payload.event.eventId)
                      .set({
                        value: 'idle',
                        like: payload.like,
                      })
                      .then(() => {
                        const likes = payload.like ? payload.event.likes + 1 : payload.event.likes - 1
                        state.event.likes = likes
                          firebase
                              .firestore()
                              .collection("events")
                              .doc(payload.event.eventId)
                              .update({
                                  likes: likes
                              })
                              .then(() => {         
                                  resolve(true)
                              });  
                      });  
                    } catch (error) {
                      resolve(false)
                    }
              }
        })
    }
  },
  getters: {},
};
