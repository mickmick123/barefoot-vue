<template>
  <div>
     <ion-item>
      <ion-label position="floating">Event Starting Date</ion-label>
      <ion-datetime
        name="eventDetails.startDate"
        v-model="startDate"
        display-format="MM/DD/YYYY"
      />
    </ion-item>
    <p class="error">{{ errors["eventDetails.startDate"] }}</p>
    <ion-item>
      <ion-label position="floating">Event Start Time</ion-label>
      <ion-datetime
        name="eventDetails.startTime"
        v-model="startTime"
        display-format="HH:mm"
      />
    </ion-item>
    <p class="error">{{ errors["eventDetails.startTime"] }}</p>
    <ion-item>
      <ion-label position="floating">Event Ending Date</ion-label>
      <ion-datetime
        name="eventDetails.endDate"
        v-model="endDate"
        display-format="MM/DD/YYYY"
      />
    </ion-item>
    <p class="error">{{ errors["eventDetails.endDate"] }}</p>
    <ion-item>
      <ion-label position="floating">Event Ending Time</ion-label>
      <ion-datetime
        name="eventDetails.endTime"
        v-model="endTime"
        display-format="HH:mm"
      />
    </ion-item>
    <p class="error">{{ errors["eventDetails.endTime"] }}</p>
  </div>
</template>

<script lang="ts">
import { useField, useFormErrors } from "vee-validate";
import { IonItem, IonLabel, IonDatetime} from "@ionic/vue";
import * as yup from "yup";
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { watchEffect } from 'vue';
const today = new Date();
export const EventTimeDetailsComponentSchema = yup
  .object({
    eventDetails: yup.object({
      startDate: yup.date().required("Event should have starting date"),
      endDate: yup.date().required("Event should have ending date").when("startDate",
                    (startDate: any, yup: any ) => startDate && yup.min(startDate, "End date cannot be before start date")),
      startTime: yup.date().required("Event should have starting time"),
      endTime: yup.date().required("Event should have ending time"),
    })
  })
  .required();
export default {
  name: "EventDetails",
  setup() {
    // No need to define rules for fields
    const store = useStore()
    const formProcess = computed(() => store.state.users.formProcess[1])
    const { value: startDate } = useField("eventDetails.startDate");
    const { value: endDate } = useField("eventDetails.endDate");
    const { value: startTime } = useField("eventDetails.startTime");
    const { value: endTime } = useField("eventDetails.endTime");
    watchEffect(() => {
      if (!formProcess.value){
        startDate.value = undefined
        endDate.value = undefined
        startTime.value = undefined
        startTime.value = undefined
        endTime.value = undefined
        store.commit('users/formProcess',{status: 'old', form: 1, value: true})
      }
    })
    return {
      startDate,
      endDate,
      startTime,
      endTime,
      errors: useFormErrors() as any,
    };
  },
  components: {
    IonItem,
    IonLabel,
    IonDatetime
  }
};
</script>
<style lang="css" scoped>
ion-item {
  --padding-start: 0;
}
</style>