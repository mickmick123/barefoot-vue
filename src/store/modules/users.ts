import { loadingController } from "@ionic/vue";
import firebase from "firebase/app";
import { Plugins } from "@capacitor/core";
import { State } from "ionicons/dist/types/stencil-public-runtime";
const { Geolocation } = Plugins;

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
  },
  mutations: {
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
     const objIndex = state.events.findIndex(((obj: any) => obj.id == payload.eventId));
      state.events[objIndex].like = payload.like
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
    async savePost({ commit, state }: any) {
      commit("postingStatus", "on process");
      commit("setLoading", true);
      commit("successMessage", "");
      const eventId = state.user.id+'_'+new Date().getTime()
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(
        `gallery/events/${state.postData.img.filepath}`
      );
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
              const image = url
              const postData = {
                type: "Feature",
                properties: {
                  eventId: eventId,
                  dbh: 5,
                  description: `<div class="map-event-container">
                  <img src="${image}" />
                  <h5>${state.postData.title}</h5>
                  <p>${state.postData.description.length > 150 ? 
                    state.postData.description.substring(0, 150 - 3) + "...": state.postData.description }</p>
                  <div class="date-container">
                  <h5>Event Schedule</h5>
                  <p>Start: ${state.postData.startDate} ${state.postData.startTime}<p>
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

              switch (state.postData.category) {
                case "events":
                  state.eventJson.features.push({ ...postData });
                  break;
                case "bars":
                  state.barsJson.features.push({ ...postData });
                  break;
                default:
                  state.restoJson.features.push({ ...postData });
                  break;
              }

              try {
                await firebase
                  .firestore()
                  .collection("barefoot")
                  .doc(state.postData.category)
                  .set({
                    value:
                      state.postData.category === "events"
                        ? JSON.stringify(state.eventJson)
                        : state.postData.category === "bars"
                        ? JSON.stringify(state.barsJson)
                        : JSON.stringify(state.restoJson),
                  })
                  .then(async () => {
                    await firebase
                      .firestore()
                      .collection("events")
                      .doc(eventId)
                      .set({
                        author: state.user.id,
                        eventId: eventId,
                        address: state.postData.address,
                        description: state.postData.description,
                        title: state.postData.title,
                        startDate: state.postData.startDate,
                        endDate: state.postData.endDate,
                        startTime: state.postData.startTime,
                        endTime: state.postData.endTime,
                        banner: image,
                        coordinates: {
                          latitude: state.postData.lat.toFixed(6),
                          longitude:  state.postData.lng.toFixed(6)
                        },
                        likes: 0,
                        attendies: [],
                        guests: 0,
                      })
                      .then(() => {
                        commit("setLoading", false);
                        commit("successMessage", "Event has been posted.");
                        commit("postingStatus", "posted");
                        return true;
                      });
                  });
              } catch (err) {
                commit("postingStatus", "idle");
                commit("setLoading", false);
                commit("appError", { err });
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
      await Geolocation.getCurrentPosition().then(async (coordinates) => {
        const newCoords = {
          accuracy: coordinates.coords.accuracy,
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
        try {
          await firebase
            .firestore()
            .collection("users")
            .doc(state.user.id)
            .update({
              coordinates: newCoords,
            })
            .then(() => {
              state.user.coordinates = newCoords;
            });
        } catch (error) {
          await firebase
            .firestore()
            .collection("users")
            .doc(state.user.id)
            .set({
              coordinates: newCoords,
            })
            .then(() => {
              state.user.coordinates = newCoords;
            });
        }
      });
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
        .collection("users").doc(state.user.id)
        .collection("events")
        .get();

        events.forEach((doc) => {
        commit("addEvent", {id: doc.id, ...doc.data()});
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
            proximity: JSON.stringify(payload),
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
            const url = await firebase
              .storage()
              .ref(`gallery/${doc.data().fileName}`)
              .getDownloadURL();
            state.gallery.push({
              filepath: doc.data().fileName,
              webviewPath: url,
            });
          });
        });
    },
    async getGeoJsonEvents({ state }: any) {
      const events = await firebase
        .firestore()
        .collection("barefoot")
        .doc("events")
        .get();
      if (events.data()) state.eventJson = JSON.parse(events.data()?.value);
    },
    async getGeoJsonResto({ state }: any) {
      const events = await firebase
        .firestore()
        .collection("barefoot")
        .doc("resto")
        .get();
      if (events.data()) state.restoJson = JSON.parse(events.data()?.value);
    },
    async getGeoJsonBars({ state }: any) {
      const events = await firebase
        .firestore()
        .collection("barefoot")
        .doc("bars")
        .get();
      if (events.data()) state.barsJson = JSON.parse(events.data()?.value);
    },
    async saveAvatar({ state, commit }: any, payload: any) {
      commit("setLoading", true);
      try {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`avatar/${payload.filepath}`);
        return imageRef
          .putString(
            payload.webviewPath,
            firebase.storage.StringFormat.DATA_URL
          )
          .then(async (snapshot) => {
            state.user.photoUrl = payload.webviewPath;
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
                      });
                    commit("setLoading", false);
                  });
              });
          });
      } catch (err) {
        commit("setLoading", false);
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
              firstName: payload.firstName,
              lastName: payload.lastName,
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
