<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="backToMap"></ion-back-button>
        </ion-buttons>
        <ion-title>My Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container" class="remove-padding darker-color">
          <div class="profile-container">
              <ion-avatar @click="takeProfile" class="profile-avatar-container" :class="user && user.status+'-user'">
                  <ion-img :src="user && user.photoUrl" />
              </ion-avatar >
              <div class="profile-info-container">
                  <h5>{{user && user.name}}</h5>
                  <p>Age:</p>
                  <p>{{computeAge(user && user.birthDate)}}</p>
                  <p>Gender:</p>
                  <p>{{ucwords(user && user.gender)}}</p>
                  <p>Status:</p>
                  <p>{{ucwords(user && user.civilStatus)}}</p>
              </div>
          </div>
          <div class="divider">
              <p>Photos <span>(0 in total)</span></p>
              <ion-button @click="gotoGallery">EDIT</ion-button>
          </div>
          <div class="profile-photo-container">
               <div v-if="gallery.length > 0" class="gallery-wrapper">
                 <div class="profile-gallery-photo" v-for="(photo, index) in gallery" :key="index" :style="`background-image: url(${photo.webviewPath})`"/>
               </div>
               <p v-else>No photos to show</p>
          </div>
           <div class="divider">
              <p>Received Gifts</p>
          </div>
          <div class="profile-gifts-container">
              <div class="profile-gift-items">
                  <ion-img :src="candy" />
                  <p>Candy</p>
                  <p>(10 points)</p>
                  <p>x0</p>
              </div>
              <div class="profile-gift-items">
                  <ion-img :src="flower" />
                  <p>Flower</p>
                  <p>(50 points)</p>
                  <p>x0</p>
              </div>
              <div class="profile-gift-items">
                  <ion-img :src="booze" />
                  <p>Booze</p>
                  <p>(100 points)</p>
                  <p>x0</p>
              </div>
              <div class="profile-gift-items">
                  <ion-img :src="tickets" />
                  <p>Tickets</p>
                  <p>(500 points)</p>
                  <p>x0</p>
              </div>
              <div class="profile-gift-items">
                  <ion-img :src="points" />
                  <p>Points</p>
                  <p>(1000 points)</p>
                  <p>x0</p>
              </div>
          </div>
          <div class="divider">
              <p>About Me</p>
              <ion-button @click="gotoAbout">EDIT</ion-button>
          </div>
          <div class="profile-about-container">
              <p>{{user ? user.aboutMe : 'No self description'}}</p>
          </div>
          <div class="divider">
              <p>Interests</p>
              <ion-button  @click="gotoInterests">EDIT</ion-button>
          </div>
          <div class="profile-interests-container">
              <div class="interests-child-container" v-if="!interests || interests.length > 0">
                <div v-for="interest in interests" :key="interest.val">
                  <span v-if="interest.isChecked">{{interest.val}}</span>
                </div>
              </div>
              <p v-else>No interests</p>
          </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonAvatar,
  menuController,
  IonButton,
} from "@ionic/vue";
import moment from "moment";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { usePhotoGallery } from '@/composables/usePhotoGallery';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonAvatar,
    IonButton
  },
  setup() {
      const router = useRouter()
      const store = useStore()
      const user = computed(() => store.state.users.user)
      const gallery = computed(() => store.state.users.gallery)
      const candy = computed(() => require('../../../public/assets/images/profile/candy.svg'))
      const flower = computed(() => require('../../../public/assets/images/profile/flower.svg'))
      const booze = computed(() => require('../../../public/assets/images/profile/booze.svg'))
      const tickets = computed(() => require('../../../public/assets/images/profile/tickets.svg'))
      const points = computed(() => require('../../../public/assets/images/profile/points.svg'))
      const interests =  user.value && user.value.interests && user.value.interests.filter((val: any) => {
        return val.isChecked === true;
      });
      const backToMap = () => {
          router.push('/map')
          menuController.enable(true, 'first');
          menuController.open('first');
      }
      const gotoAbout = () => {
          router.push('/about')
      }
      const gotoInterests = () => {
          router.push('/interests')
      }
      const gotoGallery = () => {
          router.push('/gallery')
      }
      const computeAge = (age: any) => {
         return moment().diff(moment(age).format('L'), 'years');
      }
      const ucwords = (value: any) => {
        try {
          return value.charAt(0).toUpperCase() + value.slice(1)
        } catch (error) {
          return null
        }
      }
      const { takePhoto } = usePhotoGallery();
      const takeProfile = async () => {
         takePhoto(user.value.id, false).then(async (image) => {
          await store.dispatch('users/saveAvatar', image)
         })
      }
    return {
        user,
        computeAge,
        ucwords,
        candy,
        flower,
        booze,
        tickets,
        points,
        backToMap,
        gotoAbout,
        gotoInterests,
        interests,
        takeProfile,
        gotoGallery,
        gallery,
    };
  },
});
</script>
