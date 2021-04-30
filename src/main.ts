import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';
import './theme/home.css';
import './theme/registration.css';
import './theme/map.css';
import './theme/login.css';
import './theme/menu.css';
import './theme/profile.css';
import './theme/about.css';
import './theme/interest.css';
import './theme/gallery.css';
import './theme/loading.css';
import './theme/settings.css';
import './theme/cities.css';
import './theme/notification.css';
import './theme/proximity.css';
import './theme/faq.css';
import './theme/upgrade.css';
import './theme/epoints.css';
import './theme/event.css';
import './theme/post.css';
import './theme/friends.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import firebase from 'firebase';

import 'firebase/firestore'
import store from './store'

SplashScreen.hide()
window.screen.orientation.lock('portrait')

const firebaseConfig = {
  apiKey: "AIzaSyADj_y1dLwMGTnnS4m-Ah1gHov6nqZnfjc",
  authDomain: "barefoot-dev-299405.firebaseapp.com",
  databaseURL: "https://barefoot-dev-299405-default-rtdb.firebaseio.com",
  projectId: "barefoot-dev-299405",
  storageBucket: "barefoot-dev-299405.appspot.com",
  messagingSenderId: "890896973016",
  appId: "1:890896973016:web:f39ab59c47c449a4d6ebad",
  measurementId: "G-8DXW8HDBRX"
};
firebase.initializeApp(firebaseConfig);

firebase.firestore().enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log('failed-precondition')
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log('unimplemented')
      }
  });
// store.dispatch("users/doAuthCheck").then(() => {
const app = createApp(App)
  .use(store)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
// });