<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="event-main-container" v-if="event && loadEvent === 'idle'">
        <div class="event-menu-container">
          <ion-icon :src="shareSocial" @click="shareRet" />
          <ion-icon
            :style="like ? 'color: yellow' : 'color: #fff'"
            :src="starImage"
            @click="likeHandler"
          />
          <ion-icon
            :style="attending ? 'color: yellow' : 'color: #fff'"
            :src="book"
            @click="presentAlert"
          />
        </div>
        <div class="event-menu-container-right">
          <ion-icon :src="closeCircle" @click="router.push('/map')" />
        </div>

        <div
          class="event-image-container"
          :style="`background-image: url(${
            (event && event.banner) || defaultImage
          })`"
        >
          <div class="event-meter">
            <ion-progress-bar
              :value="
                (manCount.length + womanCount.length + unknownCount).length /
                100
              "
            ></ion-progress-bar>
          </div>
        </div>
        <div class="event-title-container">
          <h5>{{ event && event.title }}</h5>
          <div class="event-star">
            <ion-icon :src="starImage"></ion-icon>
            <span>{{ event.likes }}</span>
          </div>
          <div class="event-distance">
            <p>{{ event && event.address }}</p>
            <p
              :style="
                kmaway > 50
                  ? 'color: red'
                  : kmaway > 10 && kmaway < 21
                  ? 'color: orange'
                  : kmaway > 2 && kmaway < 11
                  ? 'color: skyblue'
                  : 'color: white'
              "
            >
              {{ kmaway }} KM away
            </p>
            <p
              :style="
                eventStatus === 'ended'
                  ? 'color: red;'
                  : eventStatus === 'Upcoming'
                  ? 'color: yellow;'
                  : ''
              "
            >
              ({{ eventStatus }})
            </p>
          </div>
          <div class="event-address">
            <p>
              {{ event && moment(event.startDate).format("ll") }} -
              {{ event && moment(event.endDate).format("ll") }}
            </p>
            <p>
              {{ event && moment(event.startDate).format("ddd") }}
              {{ event && event.startTime }} -
              {{ event && moment(event.endDate).format("ddd") }}
              {{ event && event.endTime }}
            </p>
          </div>
        </div>
        <div class="event-chat-container">
          <div class="event-atendies">
            <span><ion-icon :src="man" />{{ manCount.length }}</span>
            <span><ion-icon :src="woman" />{{ womanCount.length }}</span>
            <span><ion-icon :src="help" />{{ unknownCount.length }}</span>
          </div>
          <ion-button>JOIN LIVE CHAT</ion-button>
        </div>
        <div class="event-content">
          <p>{{ event && event.description }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  alertController,
  IonProgressBar,
} from "@ionic/vue";
import {
  computed,
  defineComponent,
  ref,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import {
  shareSocial,
  thumbsUp,
  book,
  closeCircle,
  man,
  woman,
  help,
} from "ionicons/icons";
import { Plugins } from "@capacitor/core";
const { Share } = Plugins;

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonButton,
    IonProgressBar,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const userEvents = computed(() => store.state.users.events);
    const event = computed(() => store.state.events.event);
    const loadEvent = computed(() => store.state.events.status);
    const reloadEvent = computed(() => store.state.events.loading);
    const route = useRoute();
    const router = useRouter();
    const eventStatus = ref("Upcomming");
    const kmaway = ref();
    const attending = ref(false);
    const like = ref(false);
    const manCount = ref([]);
    const womanCount = ref([]);
    const unknownCount = ref([]);
    const defaultImage = computed(() =>
      require("../../../../public/assets/images/events/default-image.jpg")
    );
    const starImage = computed(() =>
      require("../../../../public/assets/images/posts/star.svg")
    );
    const shareRet = async () => {
      return await Share.share({
        title: "See cool stuff",
        text: "Really awesome thing you need to see right meow",
        url: "http://ionicframework.com/",
        dialogTitle: "Share with buddies",
      });
    };

    const toRad = (Value: any) => {
      return (Value * Math.PI) / 180;
    };

    const calcCrow = (lat1: any, lon1: any, lat2: any, lon2: any) => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    };

    watchEffect(async () => {
      if(loadEvent.value === "load"){
        store.commit("users/setLoading", true);
      }else {
        store.commit("users/setLoading", false);
      }
      if (loadEvent.value === "load" || reloadEvent.value === "load") {
        const { id } = route.params;
        await store.dispatch("events/getEvent", id).then((res) => {
          console.log(res)
          const eventStart = moment(
            new Date(res.startDate + " " + res.startTime)
          ).diff(new Date(), "minutes");
          const eventEnd = moment(
            new Date(res.endDate + " " + res.endTime)
          ).diff(new Date(), "minutes");
          kmaway.value = calcCrow(
            user.value.coordinates.latitude,
            user.value.coordinates.longitude,
            res.coordinates.latitude,
            res.coordinates.longitude
          ).toFixed(2);
          if (eventStart > 0 && eventEnd > 0) {
            eventStatus.value = "Upcomming";
          } else if (eventStart < 0 && eventEnd > 0) {
            eventStatus.value = "Ongoing";
          } else {
            eventStatus.value = "Ended";
          }
          attending.value = res.attendies.some(
            (e: any) => e.id === user.value.id
          );
          manCount.value = res.attendies.filter(
            (e: any) => e.gender === "male"
          );
          womanCount.value = res.attendies.filter(
            (e: any) => e.gender === "female"
          );
          unknownCount.value = res.attendies.filter(
            (e: any) => e.gender !== "female" && e.gender !== "male"
          );
          like.value = userEvents.value.some(
            (e: any) => e.id === res.eventId && e.like === true
          );
        });
        setTimeout(() => {
          store.commit("events/eventStatus", "idle");
          store.commit("events/loadingEvent", "idle");
        }, 1000);
      }
    });
    const presentAlert = async () => {
      if (!attending.value) {
        const alert = await alertController.create({
          cssClass: "confirmation-alert",
          subHeader: "Event Notification",
          message: "Please confirm if you are going to attend this event.",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Confirm",
              handler: () => {
                store
                  .dispatch("events/confirmAttendance", {
                    user: user.value,
                    event: event.value,
                  })
                  .then(() => {
                    attending.value = true;
                    manCount.value = event.value.attendies.filter(
                      (e: any) => e.gender === "male"
                    );
                    womanCount.value = event.value.attendies.filter(
                      (e: any) => e.gender === "female"
                    );
                    unknownCount.value = event.value.attendies.filter(
                      (e: any) => e.gender !== "female" && e.gender !== "male"
                    );
                  });
              },
            },
          ],
        });
        return alert.present();
      } else {
        const alert = await alertController.create({
          cssClass: "confirmation-alert",
          subHeader: "Event Notification",
          message: "Cancelling your attendance to this event?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Confirm",
              handler: () => {
                store
                  .dispatch("events/cancelAttendance", {
                    user: user.value,
                    event: event.value,
                  })
                  .then(() => {
                    attending.value = false;
                    manCount.value = event.value.attendies.filter(
                      (e: any) => e.gender === "male"
                    );
                    womanCount.value = event.value.attendies.filter(
                      (e: any) => e.gender === "female"
                    );
                    unknownCount.value = event.value.attendies.filter(
                      (e: any) => e.gender !== "female" && e.gender !== "male"
                    );
                  });
              },
            },
          ],
        });
        return alert.present();
      }
    };
    const likeHandler = async () => {
      like.value = like.value ? false : true;
      await store
        .dispatch("events/likeEvent", {
          user: user.value,
          event: event.value,
          like: like.value,
        })
        .then(() => {
          store.commit("users/updateLike", {
            eventId: event.value.eventId,
            like: like.value,
          });
        });
    };
    return {
      user,
      event,
      defaultImage,
      starImage,
      moment,
      shareSocial,
      thumbsUp,
      book,
      kmaway,
      loadEvent,
      eventStatus,
      closeCircle,
      router,
      presentAlert,
      attending,
      likeHandler,
      like,
      userEvents,
      man,
      woman,
      help,
      manCount,
      womanCount,
      unknownCount,
      shareRet,
    };
  },
});
</script>
