import { createStore } from 'vuex'
import users from './modules/users'
import events from './modules/events'
import inApp from './modules/inApp'
import offlineWatcher from './modules/offlineWatcher'
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
  }
})
