import { loadingController } from "@ionic/vue";
import firebase from "firebase/app";
import { Plugins } from "@capacitor/core";
import * as geofire from "geofire-common";
import * as localNotif from '@/composables/localNotification';
const { triggerNotification } = new localNotif.LocalNotification
const { Geolocation } = Plugins;
import moment from 'moment';
export default {
  namespaced: true,
  state: {
    events: [],
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    authChecked: false,
    successMessage: "",
    toast: "",
    gallery: [],
    coordinates: [],
    cities: [],
    subCities: [],
    selectedCities: [],
    updatingCoords: false,
    postData: {
      lat: null,
      lng: null,
      title: null,
      description: null,
      img: undefined,
      floor: null,
      address: null,
      country: null,
      city: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      category: "",
    },
    eventJson: {
      type: "FeatureCollection",
      features: [],
    },
    restoJson: {
      type: "FeatureCollection",
      features: [],
    },
    barsJson: {
      type: "FeatureCollection",
      features: [],
    },
    posting: "idle",
    refreshData: "idle",
    formProcess: [false, false, false],
    epoints: 0,
  },
  mutations: {
    fillEpoints(state: any, payload: any) {
      state.epoints = payload;
    },
    changeEventStatus(state: any, payload: any) {
      switch (payload) {
        case "resto":
          state.user.mapSettings.resto = state.user.mapSettings.resto
            ? false
            : true;
          break;
        case "bar":
          state.user.mapSettings.bar = state.user.mapSettings.bar
            ? false
            : true;
          break;
        default:
          state.user.mapSettings.event = state.user.mapSettings.event
            ? false
            : true;
          break;
      }
    },
    async removeFriend(state: any, payload: any){
      state.myFriends.filter((friend: any)=> { return friend.id !== payload.id});
    },
    async formProcess(state: any, payload: any) {
      if (payload.status === "new") {
        state.formProcess = [false, false, false];
      } else {
        state.formProcess[payload.form] = payload.value;
      }
    },
    async postingStatus(state: any, payload: any) {
      state.posting = payload;
    },
    async refreshData(state: any, payload: any) {
      state.refreshData = payload;
    },
    async setLoading(state: { loading: any }, payload: any) {
      state.loading = payload;
    },
    async updatingCoords(state: { updatingCoords: any }, payload: any) {
      state.updatingCoords = payload;
    },
    authChecked(state: { authChecked: any }, payload: { authChecked: any }) {
      state.authChecked = payload.authChecked;
    },

    authError(state: { error: any; user: null }, payload: any) {
      state.error = payload;
      state.user = null;
    },
    successMessage(state: any, payload: any) {
      state.successMessage = payload;
    },
    toast(state: any, payload: any) {
      state.toast = payload;
    },
    appError(state: any, payload: any) {
      state.error = payload;
    },
    // USER LOGIN
    userLogin(state: any, payload: any) {
      console.log(payload);
    },

    userLoginRequest(
      state: { isAuthenticated: boolean; loading: boolean; error: null },
      payload: any
    ) {
      state.isAuthenticated = false;
      state.loading = true;
      state.error = null;
    },

    userLoginSuccess(
      state: {
        isAuthenticated: boolean;
        loading: boolean;
        error: null;
        user: any;
      },
      payload: { user: any }
    ) {
      console.log(payload);

      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.user = payload.user;
    },

    // USER LOGOUT
    userLogout(state: any, payload: any) {
      console.log(payload);
    },

    userLogoutRequest(
      state: { isAuthenticated: boolean; loading: boolean; error: null },
      payload: any
    ) {
      state.isAuthenticated = true;
      state.loading = true;
      state.error = null;
    },

    userLogoutSuccess(
      state: {
        isAuthenticated: boolean;
        loading: boolean;
        error: null;
        user: null;
      },
      payload: any
    ) {
      console.log(payload);

      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.user = null;
    },

    // USER CREATE ACCOUNT
    createAccount(state: any, payload: any) {
      console.log(payload);
    },

    addCountry(state: any, payload: any) {
      if (!state.cities.includes(payload)) {
        state.cities.push(payload);
      }
    },
    addEvent(state: any, payload: any) {
      state.events.push(payload);
    },
    updateLike(state: any, payload: any) {
      const objIndex = state.events.findIndex(
        (obj: any) => obj.id == payload.eventId
      );
      state.events[objIndex].like = payload.like;
    },
    subCity(state: any, payload: any) {
      if (!state.subCities.some((e: any) => e.name === payload.name)) {
        state.subCities.push({
          name: payload.name,
          isChecked: state.selectedCities.some(
            (o: any) => o.name === payload.name
          ),
        });
      }
    },

    createAccountRequest(state: {
      isAuthenticated: boolean;
      loading: boolean;
      error: null;
    }) {
      state.isAuthenticated = false;
      state.loading = true;
      state.error = null;
    },

    createAccountSuccess(
      state: {
        isAuthenticated: boolean;
        loading: boolean;
        error: null;
        user: null;
      },
      payload: any
    ) {
      console.log(payload);
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.user = payload;
    },
  },
  actions: {
    async getCurrentEpoints({commit, state}: any) {
      firebase.firestore().collection("epoints").doc(state.user.id).get().then((snapshot) => {
        if(snapshot.exists)
          commit('fillEpoints', snapshot.data()?.current)
      })
    },
    async savePost({ commit, state }: any) {
      triggerNotification('Barefoot', 'Your post is in Queue, you will be notified once its done', 1000, 0)
      commit("postingStatus", "on process");
      commit("successMessage", "");
      const eventId = state.user.id + "_" + new Date().getTime();
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(
        `gallery/events/${state.postData.img.filepath}`
      );
      const eventRef =
        state.postData.category === "events"
          ? firebase.firestore().collection("events")
          : state.postData.category === "bars"
          ? firebase.firestore().collection("bars")
          : firebase.firestore().collection("resto");
      imageRef
        .putString(
          state.postData.img.webviewPath,
          firebase.storage.StringFormat.DATA_URL
        )
        .then(async () => {
          await firebase
            .storage()
            .ref(`gallery/events/${state.postData.img.filepath}`)
            .getDownloadURL()
            .then(async (url) => {
              const image = url;
              const postData = {
                type: "Feature",
                properties: {
                  eventId: eventId,
                  dbh: 5,
                  description: `<div class="map-event-container">
                  <img src="${image}" />
                  <h5>${state.postData.title}</h5>
                  <p>${
                    state.postData.description.length > 150
                      ? state.postData.description.substring(0, 150 - 3) + "..."
                      : state.postData.description
                  }</p>
                  <div class="date-container">
                  <h5>Event Schedule</h5>
                  <p>Start: ${state.postData.startDate} ${
                    state.postData.startTime
                  }<p>
                  <p>End: ${state.postData.endDate} ${state.postData.endTime}<p>
                  </div>
                </div>`,
                },
                geometry: {
                  type: "Point",
                  coordinates: [
                    state.postData.lng.toFixed(6),
                    state.postData.lat.toFixed(6),
                  ],
                },
              };

              try {
                await eventRef
                  .doc(eventId)
                  .set({
                    author: state.user.id,
                    name: state.user.name,
                    eventId: eventId,
                    category: state.postData.category,
                    address: state.postData.address,
                    description: state.postData.description,
                    title: state.postData.title,
                    startDate: state.postData.startDate,
                    endDate: state.postData.endDate,
                    startTime: state.postData.startTime,
                    endTime: state.postData.endTime,
                    banner: image,
                    coordinates: {
                      latitude: parseFloat(state.postData.lat.toFixed(6)),
                      longitude: parseFloat(state.postData.lng.toFixed(6)),
                    },
                    geohash: geofire.geohashForLocation(
                      [
                        parseFloat(state.postData.lat.toFixed(6)),
                        parseFloat(state.postData.lng.toFixed(6)),
                      ],
                      6
                    ),
                    likes: 0,
                    attendies: [],
                    guests: 0,
                    html: JSON.stringify({ ...postData }),
                  })
                  .then(() => {
                    commit("successMessage", "Event has been posted.");
                    commit("postingStatus", "posted");
                    triggerNotification('Barefoot', 'Your post has been successfully approved', 1000, 0)
                    return true;
                  });
              } catch (err) {
                commit("postingStatus", "idle");
                commit("appError", { err });
                triggerNotification('Barefoot', 'Your post has been denied', 1000, 0)
              }
            });
        });
    },
    async doAuthCheck({ commit }: any, payload: any) {
      try {
        return new Promise((resolve, reject) => {
          try {
            firebase.auth().onAuthStateChanged(async (user) => {
              commit("authChecked", {
                authChecked: true,
              });
              if (user) {
                const res = await firebase
                  .firestore()
                  .collection("users")
                  .doc(user.uid)
                  .get();
                const userData = res.data();
                if (user.photoURL === null || user.displayName === null) {
                  await firebase
                    .storage()
                    .ref("avatar/" + userData?.avatar)
                    .getDownloadURL()
                    .then(function(url) {
                      user.updateProfile({
                        photoURL: url,
                        displayName:
                          userData?.firstName.charAt(0).toUpperCase() +
                          userData?.firstName.slice(1) +
                          " " +
                          userData?.lastName.charAt(0).toUpperCase() +
                          userData?.lastName.slice(1),
                      });
                    });
                }
                const newUser = {
                  id: user.uid,
                  name: user.displayName,
                  email: user.email,
                  photoUrl: user.photoURL,
                  ...userData,
                };

                commit("userLoginSuccess", {
                  user: { ...newUser },
                });
                resolve(newUser);
              } else {
                commit("authError", null);
                commit("authChecked", {
                  authChecked: true,
                });
                resolve(null);
              }
            });
          } catch (error) {
            alert(error);
          }
        });
      } catch (cc) {
        console.log(cc);
        commit("authError", cc);
      }
    },
    async getCurrentPosition({ state }: any) {
      if(state.user){
        Geolocation.watchPosition({enableHighAccuracy: true, timeout: 1000}, async (position, err) => {
          console.log(position)
          try {
            const hash = geofire.geohashForLocation(
              [position.coords.latitude, position.coords.longitude],
              6
            );
            const newCoords = {
              accuracy: position.coords.accuracy,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            state.user.coordinates = newCoords;
            await firebase
              .firestore()
              .collection("users")
              .doc(state.user.id)
              .update({
                coordinates: newCoords,
                geohash: hash,
              })
          } catch (error) {
            try {
              const newCoords = {
                accuracy: position.coords.accuracy,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              await firebase
                .firestore()
                .collection("users")
                .doc(state.user.id)
                .set({
                  coordinates: newCoords,
                })
            } catch (error) {
              console.log('error from coordinate')
            }
          
          }
        });
      }
    },
    async getCountries({ commit }: any) {
      const countries = await firebase
        .firestore()
        .collection("cities")
        .get();

      countries.forEach((doc) => {
        commit("addCountry", doc.id);
      });
    },
    async getUserEvents({ commit, state }: any) {
      const events = await firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("events")
        .get();

      events.forEach((doc) => {
        commit("addEvent", { id: doc.id, ...doc.data() });
      });
    },
    async getSelectedCities({ commit, state }: any, payload: any) {
      try {
        const selectedCities = await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("country")
          .doc(payload.country)
          .collection("cities")
          .get();
        selectedCities.forEach((doc) => {
          state.selectedCities.push(doc.data());
        });
      } catch (err) {
        commit("appError", { err });
        return false;
      }
    },
    async getCities({ commit, state }: any, payload: any) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection("cities")
          .doc(payload.country)
          .collection("cities")
          .orderBy("name")
          .get();

        snapshot.forEach((doc) => {
          // console.log(payload.selectedCities.some((o: any) => o.name === doc.data().name))
          commit("subCity", { ...doc.data() });
        });
      } catch (err) {
        commit("appError", { err });
        return false;
      }
    },
    /**
     *
     * @param {*} param0
     * @param {*} payload
     */
    async userLogout({ commit }: any, payload: any) {
      commit("setLoading", true);
      commit("authError", {
        error: null,
      });

      // start the request...
      commit("userLogoutRequest", payload);

      // MAKE API CALL
      try {
        await firebase.auth().signOut();
        // when successful...
        commit("userLogoutSuccess", payload);
        return true;
      } catch (err) {
        console.log(err);
        commit("authError", { err });
        return false;
      }
    },

    /**
     *
     * @param {*} param0
     * @param {*} payload
     */
    async userLogin({ commit }: any, payload: any) {
      commit("setLoading", true);
      commit("authError", {
        error: null,
      });

      // start the request...
      commit("userLoginRequest", payload);

      // MAKE API CALL
      try {
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password);
        const res = await firebase
          .firestore()
          .collection("users")
          .doc(user.user?.uid)
          .get();
        const userData = res.data();

        const newUser = {
          id: user.user?.uid,
          name: user.user?.displayName,
          email: user.user?.email,
          photoUrl: user.user?.photoURL,
          ...userData,
        };
        commit("userLoginSuccess", { user: newUser });

        return true;
      } catch (err) {
        commit("authError", { err });
        commit("setLoading", false);
        return false;
      }
    },
    async updateAccount({ commit, state }: any, payload: any) {
      commit("setLoading", true);
      commit("appError", {
        error: null,
      });
      commit("successMessage", "");
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .update({
            ...payload,
          })
          .then(() => {
            const name =
              payload?.firstName.charAt(0).toUpperCase() +
              payload?.firstName.slice(1) +
              " " +
              payload?.lastName.charAt(0).toUpperCase() +
              payload?.lastName.slice(1);
            state.user.name = name;
            if (
              payload.firstName !== state.user.firstName ||
              payload.lastName !== state.user.lastName
            ) {
              const user = firebase.auth().currentUser;
              user?.updateProfile({
                displayName: name,
              });
            }
          });
        state.user.firstname = payload.firstname;
        state.user.lastName = payload.lastName;
        state.user.gender = payload.gender;
        state.user.civilStatus = payload.civilStatus;
        state.user.birthDate = payload.birthDate;
        commit("setLoading", false);
        commit("successMessage", "Your profile has been updated");
        return true;
      } catch (err) {
        commit("setLoading", false);
        commit("appError", { err });
        return false;
      }
    },
    async updateNotifications({ commit, state }: any, payload: any) {
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .update({
            notifications: payload,
          });
        state.user.notifications = payload;
        return true;
      } catch (err) {
        commit("appError", { err });
        return false;
      }
    },
    async changeEventStatus({ state }: any) {
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .update({
            mapSettings: {
              resto: state.user.mapSettings.resto,
              event: state.user.mapSettings.event,
              bar: state.user.mapSettings.bar,
            },
          });
        return true;
      } catch (err) {
        return false;
      }
    },
    async updateProximity({ commit, state }: any, payload: any) {
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .update({
            proximity: payload,
          });
        state.user.proximity = payload;
        return true;
      } catch (err) {
        commit("appError", { err });
        return false;
      }
    },
    async updateAbout({ commit, state }: any, payload: any) {
      commit("setLoading", true);
      commit("appError", {
        error: null,
      });
      commit("successMessage", "");
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(payload.id)
          .update({
            aboutMe: payload.aboutMe,
          });
        state.user.aboutMe = payload.aboutMe;
        commit("setLoading", false);
        commit("successMessage", "Your profile has been updated");
        return true;
      } catch (err) {
        commit("setLoading", false);
        commit("appError", { err });
        return false;
      }
    },
    async updatePassword({ commit, state }: any, payload: any) {
      const user = firebase.auth().currentUser;
      if (user) {
        commit("setLoading", true);
        commit("appError", {
          error: null,
        });
        commit("successMessage", "");
        try {
          const res = await user.reauthenticateAndRetrieveDataWithCredential(
            firebase.auth.EmailAuthProvider.credential(
              state.user.email,
              payload.current
            )
          );
          if (res.user) {
            try {
              await user.updatePassword(payload.password);
              commit("setLoading", false);
              commit("successMessage", "Your password has been updated");
            } catch (err) {
              commit("setLoading", false);
              commit("appError", { err });
            }
          }
        } catch (err) {
          commit("setLoading", false);
          commit("appError", { err });
        }
      }
    },
    async updateInterests({ commit, state }: any, payload: any) {
      commit("appError", {
        error: null,
      });
      // state.user.interests = payload.interests;
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .update({
            interests: payload,
          });
        return true;
      } catch (err) {
        commit("appError", { err });
        return false;
      }
    },
    async addCity({ state, commit }: any, payload: any) {
      if (payload.value) {
        return await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("country")
          .doc(payload.country)
          .collection("cities")
          .doc()
          .set({
            name: payload.city,
          });
      } else {
        const res = await firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("country")
          .doc(payload.country)
          .collection("cities")
          .where("name", "==", payload.city);

        res.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
        });
      }
    },
    async saveGallery({ state, commit }: any, payload: any) {
      commit(
        "toast",
        "Your Image is being uploaded, We'll notify you once its done"
      );
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`gallery/${payload.filepath}`);
      return imageRef
        .putString(payload.webviewPath, firebase.storage.StringFormat.DATA_URL)
        .then(async () => {
          return await firebase
            .firestore()
            .collection("users")
            .doc(state.user.id)
            .collection("gallery")
            .doc()
            .set({
              fileName: payload.filepath,
            })
            .then(() => {
              state.gallery.push({
                filepath: payload.filepath,
                webviewPath: payload.webviewPath,
              });
              commit("toast", "New Image has been added to your gallery");
            });
        });
    },
    async fillGallery({ state, commit }: any) {
      await firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
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
    async getGeoJsonEvents({ state }: any, payload: any) {
      const center = [payload.latitude, payload.longitude];
      const radiusInM = state.user.proximity.event * 1000;
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = firebase
          .firestore()
          .collection("events")
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

              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = geofire.distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                if (doc.exists) matchingDocs.push(JSON.parse(doc.data()?.html));
              }
            }
          }

          return matchingDocs;
        })
        .then((matchingDocs) => {
          // Process the matching documents
          // [START_EXCLUDE]
          state.eventJson.features = [];
          state.eventJson.features.push(...matchingDocs);
          // [END_EXCLUDE]
        });
    },

    async getGeoJsonResto({ state }: any, payload: any) {
      const center = [payload.latitude, payload.longitude];
      const radiusInM = state.user.proximity.resto * 1000;
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = firebase
          .firestore()
          .collection("resto")
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

              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = geofire.distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                if (doc.exists) matchingDocs.push(JSON.parse(doc.data()?.html));
              }
            }
          }

          return matchingDocs;
        })
        .then((matchingDocs) => {
          // Process the matching documents
          // [START_EXCLUDE]
          state.restoJson.features = [];
          state.restoJson.features.push(...matchingDocs);
          // [END_EXCLUDE]
        });
    },
    async getGeoJsonBars({ state }: any, payload: any) {
      const center = [payload.latitude, payload.longitude];
      const radiusInM = state.user.proximity.bar * 1000;
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = firebase
          .firestore()
          .collection("bars")
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

              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = geofire.distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                if (doc.exists) matchingDocs.push(JSON.parse(doc.data()?.html));
              }
            }
          }

          return matchingDocs;
        })
        .then((matchingDocs) => {
          // Process the matching documents
          // [START_EXCLUDE]
          state.barsJson.features = [];
          state.barsJson.features.push(...matchingDocs);
          // [END_EXCLUDE]
        });
    },
    async saveAvatar({ state, commit }: any, payload: any) {
      commit(
        "toast",
        "Your Avatar is being uploaded, We'll notify you once its done"
      );
      try {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`avatar/${payload.filepath}`);
        return imageRef
          .putString(
            payload.webviewPath,
            firebase.storage.StringFormat.DATA_URL
          )
          .then(async (snapshot) => {
            await firebase
              .storage()
              .ref(`avatar/${payload.filepath}`)
              .getDownloadURL()
              .then(function(url) {
                const user = firebase.auth().currentUser;
                user
                  ?.updateProfile({
                    photoURL: url,
                  })
                  .then(async () => {
                    await firebase
                      .firestore()
                      .collection("users")
                      .doc(state.user.id)
                      .update({
                        avatar: payload.filepath,
                      })
                      .then(() => {
                        state.user.photoUrl = payload.webviewPath;
                        commit(
                          "toast",
                          "Your Avatar has been successfully uploaded"
                        );
                      });
                  });
              });
          });
      } catch (err) {
        commit("appError", { err });
      }
    },
    /**
     *
     * @param {*} param0
     * @param {*} payload
     */
    socialMediaLogin({ commit }: any, payload: any) {
      commit("setLoading", true);
      commit("authError", {
        error: null,
      });

      // start the request...
      commit("userLoginRequest", payload);

      const provider = new firebase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        display: "popup",
      });

      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result: any) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = result.credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
          commit("userLoginSuccess", { ...user, accessToken: token });
          return true;
        })
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          // ...
          console.log(error);
          commit("authError", { err: error });
          return false;
        });

      // MAKE API CALL
      //   return firebase
      //     .auth()
      //     .signInWithPopup()
      //     .signInWithEmailAndPassword(payload.email, payload.password)
      //     .then((user: any) => {
      //       // when successful...
      //       commit("userLoginSuccess", payload);
      //       return true;
      //     })
      //     .catch((err: any) => {
      //       console.log(err);
      //       commit("authError", { err });
      //       return false;
      //     });
    },
    /**
     *
     * @param {*} param0
     * @param {*} payload
     */
    createAccount({ commit }: any, payload: any) {
      commit("setLoading", true);
      commit("authError", {
        error: null,
      });
      try {
        // start the request...
        commit("createAccountRequest", payload);
        console.log(payload);
        // MAKE API CALL
        return firebase
          .auth()
          .createUserWithEmailAndPassword(payload?.email, payload.password)
          .then(async (user) => {
            await firebase
              .storage()
              .ref("avatar/default.png")
              .getDownloadURL()
              .then(function(url) {
                user.user?.updateProfile({
                  photoURL: url,
                  displayName:
                    payload.firstName.charAt(0).toUpperCase() +
                    payload.firstName.slice(1) +
                    " " +
                    payload.lastName.charAt(0).toUpperCase() +
                    payload.lastName.slice(1),
                });
              });
            const userInfo = {
              firstName: payload.firstName.toLowerCase(),
              lastName: payload.lastName.toLowerCase(),
              fullName: payload.firstName.toLowerCase() + ' ' + payload.lastName.toLowerCase(),
              gender: payload.gender,
              civilStatus: payload.civilStatus,
              birthDate: payload.birthDate,
              avatar: "default.png",
              status: "normal",
              aboutMe: "",
              interests: [
                { val: "Art", isChecked: false },
                { val: "Action Figures", isChecked: false },
                { val: "Anime", isChecked: false },
                { val: "Books", isChecked: false },
                { val: "Bags", isChecked: false },
                { val: "Cars", isChecked: false },
                { val: "Coffee", isChecked: false },
                { val: "Comics", isChecked: false },
                { val: "Food", isChecked: false },
                { val: "Fashion", isChecked: false },
                { val: "Travel", isChecked: false },
                { val: "Science", isChecked: false },
                { val: "Health", isChecked: false },
                { val: "Dogs", isChecked: false },
                { val: "Cats", isChecked: false },
                { val: "Social Media", isChecked: false },
                { val: "Technology", isChecked: false },
              ],
              notifications: [
                {
                  header: "New Messages",
                  subHeader: "Get notified by receiving new messages",
                  value: "new_messages",
                  isChecked: true,
                },
                {
                  header: "Gift Receipt",
                  subHeader: "Get notified by receiving new gifts",
                  value: "gift_receipt",
                  isChecked: true,
                },
                {
                  header: "New Friend",
                  subHeader: "Get notified by having new friends",
                  value: "new_friend",
                  isChecked: true,
                },
                {
                  header: "New Bars",
                  subHeader: "Get notified if there are new bars nearby",
                  value: "new_bars",
                  isChecked: true,
                },
                {
                  header: "New Restaurants",
                  subHeader: "Get notified if there are new restaurants nearby",
                  value: "new_restaurants",
                  isChecked: true,
                },
                {
                  header: "New Events",
                  subHeader: "Get notified if there are new events nearby",
                  value: "new_events",
                  isChecked: true,
                },
              ],
              proximity: { bar: 50, event: 50, resto: 50 },
              coordinates: {
                accuracy: 30,
                latitude: 14.4780569,
                longitude: 121.0488807,
              },
              mapSettings: {
                resto: true,
                event: true,
                bar: true,
              },
            };
            await firebase
              .firestore()
              .collection("users")
              .doc(user.user?.uid)
              .set(userInfo);
            const newUser = {
              id: user.user?.uid,
              name: user.user?.displayName,
              email: user.user?.email,
              photoUrl: user.user?.photoURL,
              ...userInfo,
            };
            commit("createAccountSuccess", newUser);
            commit("setLoading", false);
            return true;
          })
          .catch((err) => {
            commit("setLoading", false);
            commit("authError", { err });
            return false;
          });
      } catch (err) {
        commit("setLoading", false);
        commit("authError", { err });
        return false;
      }
    },
  },
  //
  // GETTERS
  //
  getters: {
    loggedIn: (state: { user: any }) => {
      return state.user ? true : false;
    },
    resto: (state: any) => {
      return state.restoJson;
    },
    authError: (state: { error: any }) => {
      return state.error;
    },
    currentUser: (state: { user: any }) => {
      return state.user;
    },
  },
};
