import firebase from "firebase";
import * as geofire from "geofire-common";
export default {
  namespaced: true,
  state: {
    fromLogin: false,
    peopleNearby: [],
  },
  mutations: {
    isFromLogin(state: any, payload: any) {
      state.fromLogin = payload;
    },
  },
  actions: {
    findPeople({ commit }: any, payload: any) {
        return new Promise((resolve, reject) => {
        const center = [payload.latitude, payload.longitude];
        const radiusInM = 50 * 1000;

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
                    matchingDocs.push(doc.data());
                }
                }
            }

            return matchingDocs;
            })
            .then((matchingDocs) => {
                resolve(matchingDocs)
            });
        })
    },
  },
  getters: {},
};
