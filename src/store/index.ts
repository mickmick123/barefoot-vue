import { createStore } from 'vuex'
import users from './modules/users'
import events from './modules/events'
import inApp from './modules/inApp'
import offlineWatcher from './modules/offlineWatcher'
import friends from './modules/friends'
import chats from './modules/chats'
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    users,
    offlineWatcher,
    events,
    inApp,
    friends,
    chats,
  }
})
