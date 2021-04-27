import { createStore } from 'vuex'
import users from './modules/users'
import events from './modules/events'
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
  }
})
