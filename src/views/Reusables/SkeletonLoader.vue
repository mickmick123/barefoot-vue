<template>
  <div class="custom-skeleton">
    <div class="skeleton-image">
      <ion-skeleton-text
        animated
        style="width: 100%; line-height: 30vh"
      ></ion-skeleton-text>
    </div>
    <div class="skeleton-header">
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 20%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
    </div>
    <div class="skeleton-button">
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 30px; flex-basis: 50%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 30px; flex-basis: 50%"
      ></ion-skeleton-text>
    </div>
    <div class="skeleton-content">
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 20%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 20%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 20%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 40%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 80%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        animated
        style="width: 20%; line-height: 15px; flex-basis: 100%"
      ></ion-skeleton-text>
    </div>
  </div>
</template>

<style>
/* Custom Skeleton Line Height and Margin */
.custom-skeleton {
  line-height: 13px;
  display: flex;
  background-color: rgb(240, 239, 239);
  flex-direction: column;
}
.skeleton-image {
  min-height: 30vh;
  background-color: rgb(219, 219, 219);
  flex-basis: 100%;
}
.skeleton-header {
  min-height: 10vh;
  flex-basis: 100%;
  background-color: rgb(187, 186, 186);
}
.skeleton-button {
  display: flex;
  min-height: 9vh;
  background-color: rgb(187, 186, 186);
}
.skeleton-content {
  min-height: 47.2vh;
  background-color: rgb(161, 159, 159);
  display: flex;
  flex-direction: column;
}
</style>

<script>
import { IonSkeletonText } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SkeletonLoader",
  components: {
    IonSkeletonText,
  },
});
</script>