<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useAlertStore } from "../stores/alert";
import  { useUserStore } from '../stores/user'
import { onMounted, computed, ref } from "vue";

import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
const action = useAuthStore();
const alert_action = useAlertStore();
const { loading, alerts, dialog, alert , time} = storeToRefs(useAlertStore());
const { getUsersByEmailAndId } = storeToRefs(useUserStore());
const   { getUsers } = useUserStore()


const date = ref();
const header = ref([
  {
    title: "No.",
  },
  {
    title: "Title",
  },

  {
    title: "Target user",
  },
  {
    title: "Target user count",
  },
  {
    title: "Date created",
  },
  {
    title: "Dispatched Date",
  },

  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);


onMounted(async () => {
  await alert_action.getAlerts();
  await getUsers(1);
});

type status_type = 'pending' | 'ongoing' | 'successful'
const statusColor = (status: status_type) => {
  if (status == 'pending') {
      return  'yellow-darken-3'
  }

  else if(status == 'ongoing') return 'light-green-darken-2'

  else return "green lighten-3"
  
};

const edit = ref(false);
const btnText = ref("Create Alert");
const editItem = (item: never) => {
  alert.value = Object.assign({}, item);
  btnText.value = "Update Alert";
  dialog.value = true;
  edit.value = true;
};
const close = (item: never) => {
  dialog.value = false;
  alert.value = Object.assign(
    {},
    {
      title: "",
      body: "",
      target_user: "",
      dispatched_at: "",
      channels: [],
      users:[]
    }
  );
  btnText.value = "Create Network";

  edit.value = false;
};
const currentDate = ref(new Date().toISOString().slice(0, 10));
</script>

<template>
  <div>
    <v-card class="pa-7">
      <div class="d-flex align-center justify-space-between">
        <h3>All Annoucement</h3>

        <v-btn
          color="secondary"
          prepend-icon="mdi-bell-ring-outline"
          @click="dialog = true"
          >Create an annoucement</v-btn
        >
      </div>

      <v-table class="my-4">
        <thead>
          <tr>
            <th
              v-for="(headings, index) in header"
              :key="index"
              class="text-left font-weight-bold"
            >
              {{ headings.title }}
            </th>
          </tr>
        </thead>
        <tbody v-if="loading == false && alerts?.length > 0">
          <tr v-for="(item, index) in alerts" :key="item?.id">
            <td>{{ index + 1 }}</td>
            <td class="font-weight-bold">{{ item?.title }}</td>
            <td>{{ item?.target_user }}</td>
            <td>{{ item?.target_user_count ?? "No data" }}</td>
            <!-- <td>₦‎ {{ item?.sell_max_amount }}</td> -->
            <td>
              {{ useDateFormat(item?.created_at, "DD, MMM YYYY - hh:mm a").value }}
            </td>
            <td>
              {{ useDateFormat(item?.dispatched_at, "DD, MMM YYYY - hh:mm a").value }}
            </td>
            <td>
              <v-chip
                label
                class="pa-2 text-capitalize"
                :color="statusColor(item?.status)"
              >
                {{ item?.status }}
              </v-chip>
            </td>
            <!-- <td>
            <v-switch @input="activationGifCardProduct(item?.id)"></v-switch>
          </td> -->
            <td>
              <v-row justify="center">
                <v-menu transition="scroll-x-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      text
                      icon="mdi-dots-vertical"
                      color="transparent"
                      class="ma-2"
                      v-bind="props"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="editItem(item)" link color="secondary">
                      <v-list-item-title> Edit Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.restoreAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Restore Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.deleteAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Delete Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.dispatchAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Dispatch Alert </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
      <p v-if="loading == false && alerts?.length <= 0" class="text-center py-6">
        No data available
      </p>
    </v-card>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <div class="d-flex align-center w-100 justify-space-between pa-7">
            <h3 class="text-h5 font-weight-bold ">{{ btnText }}</h3>
            <v-btn @click="close" color="secondary" variant="outlined" icon="mdi-close">
              <v-icon icon="mdi-close"></v-icon>
            </v-btn>
          </div>
          <v-card-text>
            <v-container>
              <v-form lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="alert.title"
                      variant="outlined"
                      label="Title*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="edit == false" cols="12">
                    <v-textarea
                      v-model="alert.body"
                      variant="outlined"
                      label="body*"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select
                      v-model="alert.target_user"
                      variant="outlined"
                      label="Target user*"
                      required
                      :items="['All','Verified', 'Specific']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      type="date"
                      :min="currentDate"
                      hint="Dispatch date and time must be a date after or equal to now + 5 minutes"
                      persistent-hint
                      label="Dispatch datetime"
                      placeholder="Dispatch datetime"
                      v-model="alert.dispatched_at"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      type="time"
                      :min="currentDate"
                      hint="Dispatch date and time must be a date after or equal to now + 5 minutes"
                      persistent-hint
                      label="Dispatch time"
                      placeholder="Dispatch datetime"
                      v-model="time"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col  cols="12" sm="12">
                    <v-autocomplete
                      :items="['email', 'in_app', 'push']"
                      label="Channels*"
                      required
                      multiple
                      v-model="alert.channels"
                      item-title="name"
                      item-value="id"
                      hint="This field is required"
                      persistent-hint
                    ></v-autocomplete>
                    </v-col>
                  <v-col v-if="alert.target_user == 'Specific' " cols="12" sm="12">
                    <v-autocomplete

                      :items="getUsersByEmailAndId"
                      label="Users*"
                      required
                      multiple
                      v-model="alert.users"
                      item-title="email"
                      item-value="id"
                      hint="This field is required"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  color="secondary" class="px-7" variant="outlined" @click="close">
              Close
            </v-btn>
            <v-btn
              :loading="loading"
              @click="
                edit == true
                  ? alert_action.updateAlert(alert)
                  : alert_action.createAlert(alert)
              "
              color="secondary"
              class="px-12"
              variant="flat"
            >
              {{ btnText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style>
.dp__input {
  padding: 15px !important;
}
</style>
