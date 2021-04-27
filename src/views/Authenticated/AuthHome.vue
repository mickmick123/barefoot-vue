<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
        class="notification-controller"
        :class="searching ? 'no-display' : ''"
      >
        <div class="img-container">
          <ion-img :src="leftLogo" @click="openLeftMenu" />
        </div>
        <span>Events</span>
        <div class="img-container">
          <ion-img :src="rightLogo" />
        </div>
      </div>
      <div
        id="flag-outline"
        class="flag-outline"
        :class="!posting ? 'no-display' : ''"
      >
        <div class="speech-bubble" :class="!showBubble ? 'no-display' : ''">
          Pin this flag to the event location
        </div>
        <ion-icon :src="flagOutline"></ion-icon>
      </div>
      <div id="map"></div>
      <ion-fab
        vertical="bottom"
        horizontal="start"
        slot="fixed"
        :class="!posting ? 'no-display' : ''"
      >
        <ion-fab-button @click="startPosting"> POST </ion-fab-button>
      </ion-fab>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="left-button" color="barefoot">
          <ion-icon :icon="rightButton"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="start">
          <ion-fab-button
            :color="eventStatus ? 'tertiary' : 'barefoot'"
            @click="eventHandler('event')"
          >
            <ion-icon :icon="event"></ion-icon>
          </ion-fab-button>
          <ion-fab-button
            :color="barStatus ? 'tertiary' : 'barefoot'"
            @click="eventHandler('bar')"
          >
            <ion-icon :icon="beer"></ion-icon>
          </ion-fab-button>
          <ion-fab-button
            :color="restoStatus ? 'tertiary' : 'barefoot'"
            @click="eventHandler('resto')"
          >
            <ion-icon :icon="spoon"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
        <ion-fab-list side="top">
          <ion-fab-button
            :color="searching ? 'tertiary' : 'barefoot'"
            @click="searchhandler"
          >
            <ion-icon :icon="searchIcon"></ion-icon>
          </ion-fab-button>
          <ion-fab-button
            :color="posting ? 'tertiary' : 'barefoot'"
            @click="postHandler"
          >
            <ion-icon :icon="golf"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonImg,
  menuController,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
} from "@ionic/vue";
import { arrowUpCircle } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref, watchEffect } from "vue";
import mapboxgl from "mapbox-gl";
import { useStore } from "vuex";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "AuthHome",
  components: {
    IonContent,
    IonPage,
    IonImg,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  },
  setup() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlja21pY2sxOTg5IiwiYSI6ImNrZnlzaHBrZDBkaXIyem52ZWdhZnBrYzQifQ.2E9EKB7Lx14VBMZfRuRrVQ";
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const router = useRouter();
    const eventStatus = computed(
      () => store.state.users.user.mapSettings.event
    );
    const barStatus = computed(() => store.state.users.user.mapSettings.bar);
    const restoStatus = computed(
      () => store.state.users.user.mapSettings.resto
    );
    const eventJson = computed(() => store.state.users.eventJson);
    const restoJson = computed(() => store.state.users.restoJson);
    const barsJson = computed(() => store.state.users.barsJson);
    const refreshData = computed(() => store.state.users.refreshData);
    const searching = ref(false);
    const posting = ref(false);
    const showBubble = ref(false);
    const map = ref();

    const restoMarker = computed(() =>
      require("../../../public/assets/images/map/bf-resto.png")
    );
    const barMarker = computed(() =>
      require("../../../public/assets/images/map/bf-bar.png")
    );
    const eventMarker = computed(() =>
      require("../../../public/assets/images/map/bf-event.png")
    );
    const leftLogo = computed(() =>
      require("../../../public/assets/images/map/leftLogo.png")
    );
    const rightLogo = computed(() =>
      require("../../../public/assets/images/map/rightLogo.png")
    );
    const world = computed(() =>
      require("../../../public/assets/images/map/chevron-up-outline.svg")
    );
    const event = computed(() =>
      require("../../../public/assets/images/map/event.svg")
    );
    const beer = computed(() =>
      require("../../../public/assets/images/map/beer1.svg")
    );
    const spoon = computed(() =>
      require("../../../public/assets/images/map/resto1.svg")
    );
    const golf = computed(() =>
      require("../../../public/assets/images/map/golf-outline.svg")
    );
    const searchIcon = computed(() =>
      require("../../../public/assets/images/map/search-outline.svg")
    );
    const rightButton = computed(() =>
      require("../../../public/assets/images/map/apps-outline.svg")
    );
    const flagOutline = computed(() =>
      require("../../../public/assets/images/map/flag-outline.svg")
    );
    const geoLocator = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    const postHandler = async () => {
      posting.value = posting.value ? false : true;
      searching.value = true;
      document
        .getElementsByClassName("mapboxgl-ctrl-geocoder")[0]
        .classList.add("show-search");
      if (posting.value) {
        map.value.removeControl(geoLocator);
        showBubble.value = true;
        setTimeout(() => {
          showBubble.value = false;
        }, 5000);
      } else {
        map.value.addControl(geoLocator);
      }
    };

    const startPosting = () => {
      const coords = map.value.getCenter();
      store.state.users.postData.lat = coords.lat;
      store.state.users.postData.lng = coords.lng;
      store.commit("users/formProcess", { status: "new" });
      router.push({ name: "post-1" });
    };

    const searchhandler = () => {
      searching.value
        ? document
            .getElementsByClassName("mapboxgl-ctrl-geocoder")[0]
            .classList.remove("show-search")
        : document
            .getElementsByClassName("mapboxgl-ctrl-geocoder")[0]
            .classList.add("show-search");
      searching.value = searching.value ? false : true;
      // store.commit("users/showSearch");
    };

    const openLeftMenu = () => {
      menuController.enable(true, "first");
      menuController.open("first");
    };

    const loadRestos = () => {
      map.value.loadImage(restoMarker.value, function (error: any, image: any) {
        if (error) throw error;

        // Add the image to the map style.
        map.value.addImage("bf-resto", image);

        // Add a data source containing one point feature.
        map.value.addSource("restos", {
          type: "geojson",
          data: restoJson.value,
        });

        map.value.addLayer({
          id: "restos",
          type: "symbol",
          source: "restos",
          layout: {
            "icon-image": "bf-resto",
            "icon-allow-overlap": true,
          },
        });

        map.value.on("click", "restos", function (e: any) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          const eventId = e.features[0].properties.eventId;
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          const divElement = document.createElement('div');
          const assignBtn = document.createElement('div');
          assignBtn.innerHTML = `<button class="barefoot-button" >Show more details</button>`;
          divElement.innerHTML = description;
          divElement.appendChild(assignBtn);
          assignBtn.addEventListener('click', () => {
            store.commit('events/eventStatus', 'load')
            store.commit('events/setEvent', undefined)
            router.push('/posts/'+eventId)
          });
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(divElement)
            .addTo(map.value);
        });
        map.value.on("mouseenter", "restos", function () {
          map.value.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.value.on("mouseleave", "restos", function () {
          map.value.getCanvas().style.cursor = "";
        });
      });
    };

    const loadEvents = () => {
      map.value.loadImage(eventMarker.value, function (error: any, image: any) {
        if (error) throw error;

        // Add the image to the map style.
        map.value.addImage("bf-event", image);

        // Add a data source containing one point feature.
        map.value.addSource("events", {
          type: "geojson",
          data: eventJson.value,
        });

        map.value.addLayer({
          id: "events",
          type: "symbol",
          source: "events",
          layout: {
            "icon-image": "bf-event",
            "icon-allow-overlap": true,
          },
        });

        map.value.on("click", "events", function (e: any) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          const eventId = e.features[0].properties.eventId;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const divElement = document.createElement('div');
          const assignBtn = document.createElement('div');
          assignBtn.innerHTML = `<button class="barefoot-button" >Show more details</button>`;
          divElement.innerHTML = description;
          divElement.appendChild(assignBtn);
          assignBtn.addEventListener('click', () => {
            store.commit('events/eventStatus', 'load')
            store.commit('events/setEvent', undefined)
            router.push('/posts/'+eventId)
          });
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(divElement)
            .addTo(map.value);
        });
        map.value.on("mouseenter", "events", function () {
          map.value.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.value.on("mouseleave", "events", function () {
          map.value.getCanvas().style.cursor = "";
        });
      });
    };

    const loadBars = () => {
      map.value.loadImage(barMarker.value, function (error: any, image: any) {
        if (error) throw error;

        // Add the image to the map style.
        map.value.addImage("bf-bar", image);

        // Add a data source containing one point feature.
        map.value.addSource("bars", {
          type: "geojson",
          data: barsJson.value,
        });

        map.value.addLayer({
          id: "bars",
          type: "symbol",
          source: "bars",
          layout: {
            "icon-image": "bf-bar",
            "icon-allow-overlap": true,
          },
        });

        map.value.on("click", "bars", function (e: any) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          const eventId = e.features[0].properties.eventId;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const divElement = document.createElement('div');
          const assignBtn = document.createElement('div');
          assignBtn.innerHTML = `<button class="barefoot-button" >Show more details</button>`;
          divElement.innerHTML = description;
          divElement.appendChild(assignBtn);
          assignBtn.addEventListener('click', () => {
            store.commit('events/eventStatus', 'load')
            store.commit('events/setEvent', undefined)
            router.push('/posts/'+eventId)
          });

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(divElement)
            .addTo(map.value);
        });
        map.value.on("mouseenter", "bars", function () {
          map.value.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.value.on("mouseleave", "bars", function () {
          map.value.getCanvas().style.cursor = "";
        });
      });
    };
    const eventHandler = (val: any) => {
      store.commit("users/changeEventStatus", val);
      store.dispatch("users/changeEventStatus");
    };

    const markerController = () => {
      if (eventStatus.value) {
        map.value.setLayoutProperty("events", "visibility", "visible");
      } else {
        map.value.setLayoutProperty("events", "visibility", "none");
      }
      if (barStatus.value) {
        map.value.setLayoutProperty("bars", "visibility", "visible");
      } else {
        map.value.setLayoutProperty("bars", "visibility", "none");
      }
      if (restoStatus.value) {
        map.value.setLayoutProperty("restos", "visibility", "visible");
      } else {
        map.value.setLayoutProperty("restos", "visibility", "none");
      }
    };

    onMounted(() => {
      map.value = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mickmick1989/ckg6chu5e1uqw19lo40u1od9a",
        center: [
          store.state.users.user.coordinates.longitude !== undefined
            ? store.state.users.user.coordinates.longitude
            : 14.478073199999999,
          store.state.users.user.coordinates.latitude !== undefined
            ? store.state.users.user.coordinates.latitude
            : 121.04882719999999,
        ], // starting position
        zoom: 14, // starting zoom
        attributionControl: false,
      });
      // Set options
      map.value.addControl(geoLocator);
      map.value.addControl(geocoder);
      map.value.on("idle", async function () {
        map.value.resize();
        try {
          markerController();
        } catch (error) {
          console.log("map not ready");
        }
      });

      map.value.on("load", async function () {
        geoLocator._geolocateButton.click();
        loadEvents();
        loadRestos();
        loadBars();
      });
    });
    watchEffect(() => {
      if (refreshData.value === "refresh") {
        map.value.getSource("events").setData(eventJson.value);
        map.value.getSource("restos").setData(restoJson.value);
        map.value.getSource("bars").setData(barsJson.value);
        searching.value = false;
        posting.value = false;
        document
          .getElementsByClassName("mapboxgl-ctrl-geocoder")[0]
          .classList.remove("show-search");
        store.commit("users/refreshData", "idle");
      }
    });
    return {
      leftLogo,
      rightLogo,
      openLeftMenu,
      arrowUpCircle,
      world,
      rightButton,
      event,
      beer,
      spoon,
      eventHandler,
      eventStatus,
      restoStatus,
      barStatus,
      golf,
      searchhandler,
      searchIcon,
      searching,
      postHandler,
      flagOutline,
      showBubble,
      posting,
      startPosting,
    };
  },
});
</script>

<style scoped></style>
