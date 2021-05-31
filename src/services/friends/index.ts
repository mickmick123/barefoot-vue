import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { ref, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import geohash from "ngeohash";

let friendsCollection: any;
let userCollection: any;

export function friendsHandler() {
    const store = useStore()
    const user = computed(() => store.state.users.user)
    userCollection = firebase.firestore().collection('users');
    friendsCollection = firebase.firestore().collection('users').doc(user.value.id).collection('friends')

    const getUserData = async (id: any) => {
        const data = await firebase.firestore().collection('users').doc(id).get();
        store.commit('inApp/pushImage', {avatar: data.data()?.avatar, id: data.id})
        return {id: data.id, ...data.data()}
    }


    const friendsQuery = friendsCollection.where('status', '==', 'accepted')
    const friendsList = ref<any>([])
    const unsubscribe = friendsQuery.onSnapshot((snapshot: any) => {
        const promises = snapshot.docs.map(async (doc: any) => {
            return getUserData(doc.id).then((snapshot) => {
                return snapshot
            })
        }).reverse()
        Promise.all(promises)
        .then(results => {
            friendsList.value = results
        })
        .catch(e => {
            console.error(e);
        })
    })
    onUnmounted(unsubscribe)

    const requestQuery = friendsCollection.where('status', '==', 'pending').where('requestor', '==', false)
    const friendsRequest = ref<any>([])
    const unsubscribe2 = requestQuery.onSnapshot((snapshot: any) => {
        const promises = snapshot.docs.map(async (doc: any) => {
            return getUserData(doc.id).then((snapshot) => {
                return snapshot
            })
        }).reverse()
        Promise.all(promises)
        .then(results => {
            friendsRequest.value = results
        })
        .catch(e => {
            console.error(e);
        })
    })
    onUnmounted(unsubscribe2)


    // start of finding friends nearby location

    const getGeohashRange = (
        latitude: number,
        longitude: number,
        distance: number, // miles
      ) => {
        const lat = 0.0144927536231884; // degrees latitude per mile
        const lon = 0.0181818181818182; // degrees longitude per mile
      
        const lowerLat = latitude - lat * distance;
        const lowerLon = longitude - lon * distance;
      
        const upperLat = latitude + lat * distance;
        const upperLon = longitude + lon * distance;
      
        const lower = geohash.encode(lowerLat, lowerLon);
        const upper = geohash.encode(upperLat, upperLon);
      
        return {
          lower,
          upper
        };
      };

    const range = getGeohashRange(user.value.coordinates.latitude, user.value.coordinates.longitude, 10);
    const nearbyQuery =  userCollection.where("geohash", ">=", range.lower)
    .where("geohash", "<=", range.upper)
    const usersList = ref<any>([])
    const unsubscribe3 = nearbyQuery.onSnapshot((snapshot: any) => {
        const promises = snapshot.docs.map((doc: any) => {
            store.commit('inApp/pushImage', {avatar: doc.data()?.avatar, id: doc.id})
            return {id: doc.id, ...doc.data()}
        }).reverse()

        Promise.all(promises)
        .then(results => {
            usersList.value = results
        })
        .catch(e => {
            console.error(e);
        })
    })
    onUnmounted(unsubscribe3)

    const sendRequest = (id: any) => {
      const friendRef = firebase.firestore().collection('users').doc(id).collection('friends')
        friendsCollection.doc(id).set({
            requestor: true,
            status: 'pending',
            date: new Date(),
        })
        friendRef.doc(user.value.id).set({
            requestor: false,
            status: 'pending',
            date: new Date(),
        })
    }
    const friendSearch = (text: any, page: any) => {
        if(page === 'friendsList' && text !== '') {
            const filtered = friendsList.value.filter((o: any) => {
                return o.fullName.indexOf(text) !== -1
            })
            store.commit('inApp/fillSearch', filtered)
        } else if (page === 'friendsRequest' && text !== '') {
            const filtered = friendsRequest.value.filter((o: any) => {
                return o.fullName.indexOf(text) !== -1
            })
            store.commit('inApp/fillSearch', filtered)
        } else if (page === 'friendsNearby' && text !== '') {
            // const filtered = usersList.value.filter((o: any) => {
            //     return o.fullName.indexOf(text) !== -1
            // })
            userCollection.where('fullName', '>=', text).onSnapshot((snapshot: any) => {
                const promises = snapshot.docs.map((doc: any) => {
                    store.commit('inApp/pushImage', {avatar: doc.data()?.avatar, id: doc.id})
                    return {id: doc.id, ...doc.data()}
                }).reverse()
            
                Promise.all(promises)
                .then(results => {
                    store.commit('inApp/fillSearch', results)
                })
                .catch(e => {
                    console.error(e);
                })
            })
            
        }
        else {
            store.commit('inApp/fillSearch', [])
        }
    }

      return { friendSearch, friendsRequest, friendsList, usersList, sendRequest }
}
