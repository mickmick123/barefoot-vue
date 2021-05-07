import firebase from "firebase";

export default {
  namespaced: true,
  state: {
    event: undefined,
    status: "idle",
    loading: "idle",
  },
  mutations: {
    setEvent(state: any, payload: any) {
      state.event = payload;
    },
    eventStatus(state: any, payload: any) {
      state.status = payload;
    },
    loadingEvent(state: any, payload: any) {
      state.loading = payload;
    },
  },
  actions: {
    async getEvent({ commit }: any, payload: any) {
      return new Promise((resolve, reject) => {
        try {
          firebase
            .firestore()
            .collection("events")
            .doc(payload)
            .get()
            .then((res) => {
              if (res.exists) {
                commit("setEvent", res.data());
                resolve(res.data());
              }
            });
        } catch (error) {
          resolve(undefined);
        }
      });
    },
    async confirmAttendance({ commit, state }: any, payload: any) {
      return new Promise((resolve, reject) => {
        const eventRef =
        payload.event.category === "bars"
            ? firebase.firestore().collection("bars")
            : payload.event.category === "events"
            ? firebase.firestore().collection("events")
            : firebase.firestore().collection("resto");
        
        firebase
            .firestore()
            .collection("users")
            .doc(payload.user.id)
            .collection("events")
            .doc(payload.event.eventId).get().then((snapshot) => {
              if(snapshot.exists){
                firebase
                  .firestore()
                  .collection("users")
                  .doc(payload.user.id)
                  .collection("events")
                  .doc(payload.event.eventId)
                  .update({
                    value: "attending",
                  })
                  .then(() => {
                    const attendies = payload.event.attendies;
                    attendies.push({
                      id: payload.user.id,
                      gender: payload.user.gender,
                      name: payload.user.name,
                    });
                    return firebase.firestore().runTransaction((transaction) => {
                      // This code may get re-run multiple times if there are conflicts.
                      return transaction.get(eventRef.doc(payload.event.eventId)).then((sfDoc) => {
                          if (!sfDoc.exists) {
                              throw "Document does not exist!";
                          }
                          transaction.update(eventRef.doc(payload.event.eventId), { attendies: attendies });
                      });
                      }).then(() => {
                          commit('loadingEvent', 'load')
                          console.log("Transaction successfully committed!");
                      }).catch((error) => {
                          console.log("Transaction failed: ", error);
                      });
                  })
              } else {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(payload.user.id)
                  .collection("events")
                  .doc(payload.event.eventId)
                  .set({
                    value: "attending",
                    likes: 0,
                  })
                  .then(() => {
                    const attendies = payload.event.attendies;
                    attendies.push({
                      id: payload.user.id,
                      gender: payload.user.gender,
                      name: payload.user.name,
                    });
                    return firebase.firestore().runTransaction((transaction) => {
                      // This code may get re-run multiple times if there are conflicts.
                      return transaction.get(eventRef.doc(payload.event.eventId)).then((sfDoc) => {
                          if (!sfDoc.exists) {
                              throw "Document does not exist!";
                          }
                          transaction.update(eventRef.doc(payload.event.eventId), { attendies: attendies });
                      });
                      }).then(() => {
                          console.log("Transaction successfully committed!");
                          commit('loadingEvent', 'load')
                      }).catch((error) => {
                          console.log("Transaction failed: ", error);
                      });
                  })
              }
            })
      });
    },
    async cancelAttendance({ commit, state }: any, payload: any) {
      return new Promise((resolve, reject) => {
        const eventRef =
        payload.event.category === "bars"
            ? firebase.firestore().collection("bars")
            : payload.event.category === "events"
            ? firebase.firestore().collection("events")
            : firebase.firestore().collection("resto");

            firebase
              .firestore()
              .collection("users")
              .doc(payload.user.id)
              .collection("events")
              .doc(payload.event.eventId)
              .update({
                value: "cancelled",
              })
              .then(() => {
                const attendies = payload.event.attendies.filter(
                  (obj: { id: any }) => obj.id !== payload.user.id
                );
                state.event.attendies = attendies;
                return firebase.firestore().runTransaction((transaction) => {
                  // This code may get re-run multiple times if there are conflicts.
                  return transaction.get(eventRef.doc(payload.event.eventId)).then((sfDoc) => {
                      if (!sfDoc.exists) {
                          throw "Document does not exist!";
                      }
                      transaction.update(eventRef.doc(payload.event.eventId), { attendies: attendies });
                  });
                  }).then(() => {
                      console.log("Transaction successfully committed!");
                      commit('loadingEvent', 'load')
                  }).catch((error) => {
                      console.log("Transaction failed: ", error);
                  });
              })
              

      });
    },
    async likeEvent({ commit, state }: any, payload: any) {
      const eventRef =
      payload.event.category === "bars"
          ? firebase.firestore().collection("bars")
          : payload.event.category === "events"
          ? firebase.firestore().collection("events")
          : firebase.firestore().collection("resto");

      return new Promise((resolve, reject) => {
        firebase
        .firestore()
        .collection("users")
        .doc(payload.user.id)
        .collection("events")
        .doc(payload.event.eventId).get().then((snapshot) => {
          if(snapshot.exists){
            firebase
            .firestore()
            .collection("users")
            .doc(payload.user.id)
            .collection("events")
            .doc(payload.event.eventId)
            .update({
              like: payload.like,
            })
            .then(() => {
              const likes = payload.like
                ? payload.event.likes + 1
                : payload.event.likes - 1;
              state.event.likes = likes;

              return firebase.firestore().runTransaction((transaction) => {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(eventRef.doc(payload.event.eventId)).then((sfDoc) => {
                    if (!sfDoc.exists) {
                        throw "Document does not exist!";
                    }
                    transaction.update(eventRef.doc(payload.event.eventId), { likes: likes });
                });
                }).then(() => {
                  commit("users/updateLike", {
                    eventId: payload.event.eventId,
                    like: payload.like,
                  },
                  {root: true});
                    console.log("Transaction successfully committed!");
                }).catch((error) => {
                    console.log("Transaction failed: ", error);
                });
            });
          } else {
              firebase
                .firestore()
                .collection("users")
                .doc(payload.user.id)
                .collection("events")
                .doc(payload.event.eventId)
                .set({
                  value: "idle",
                  like: payload.like,
                })
                .then(() => {
                  const likes = payload.like
                    ? payload.event.likes + 1
                    : payload.event.likes - 1;
                  state.event.likes = likes;
  
                  return firebase.firestore().runTransaction((transaction) => {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction.get(eventRef.doc(payload.event.eventId)).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        transaction.update(eventRef.doc(payload.event.eventId), { likes: likes });
                    });
                    }).then(() => {
                        console.log("Transaction successfully committed!");
                    }).catch((error) => {
                        console.log("Transaction failed: ", error);
                    });
                });
          }
        })
        
      });
    },
  },
  getters: {},
};
