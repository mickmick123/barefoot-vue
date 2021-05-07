import firebase from "firebase";

export default {
    namespaced: true,
    state: {
    },
    mutations: {},
    actions: {
        async offlineListeners({commit}: any, payload: any) {
            try {
                firebase.firestore().collection('users').doc(payload).collection('gallery').onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            console.log("New Image: ", change.doc.data());
                        }
                
                        const source = snapshot.metadata.fromCache ? "local cache" : "server";
                        console.log("Data came from " + source);
                    });
                });
            
                firebase.firestore().collection('cities').onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            console.log("New Country: ", change.doc.data());
                        }
                
                        const source = snapshot.metadata.fromCache ? "local cache" : "server";
                        console.log("Data came from " + source);
                    });
                });
    
                firebase.firestore().collection('barefoot').onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            console.log("New Country: ", change.doc.data());
                        }
                
                        const source = snapshot.metadata.fromCache ? "local cache" : "server";
                        console.log("Data came from " + source);
                    });
                });
                firebase.firestore().collection('events').onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            console.log("New Events: ", change.doc.data());
                        }
                
                        const source = snapshot.metadata.fromCache ? "local cache" : "server";
                        console.log("Data came from " + source);
                    });
                });
            } catch (error) {console.log(error)}
                
        }
        
    },
    getters: {}
}