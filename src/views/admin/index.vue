<script setup lang="ts">
// @ts-ignore
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
const {
  getAdmin,
  CreateAdmin,
  deleteAdmin,
  restoreAdmin,
  activationAdmin,
  updateAdmin,
} = useUserStore();
// @ts-ignore
import { useCountryStore } from "../../stores/country";
const { admin, loading, dialog, adminDetails, id } = storeToRefs(
  useUserStore()
);
const form = ref(null);
const { countryNames } = storeToRefs(useCountryStore());
// @ts-ignore
import { reactive, onMounted, ref } from "vue";
const header = reactive([
  {
    title: "Id",
  },
  {
    title: "User Info",
  },
  // {
  //   title: "Last name",
  // },
  // {
  //   title: "Email",
  // },
  {
    title: "Phone number",
  },
  {
    title: "Blocked at",
  },

  // {
  //   title: "Restore",
  // },
  // {
  //   title: "Toggle blocked status",
  // },
  {
    title: "Actions",
  },
]);
onMounted(async () => {
  await getAdmin();
});

const blockedStatus = (status: string | null) => {
  return !status ? "Active" : "Blocked";
};
const editAdmin = async (admin_id: string) => {
  id.value = admin_id;
  await updateAdmin();
  // adminDetails.value = updateAdmin.value
  dialog.value = true;
};

const valid = ref(null);
</script>

<template>
  <div>
    <v-card class="pa-3" rounded="0">
      <div class="d-flex align-center justify-space-between">
        <h3>All Admins</h3>
        <v-btn
          @click="dialog = true"
          prepend-icon="mdi-account-plus"
          color="secondary"
          >Create Admin</v-btn
        >
      </div>

      <v-table class="my-5">
        <thead>
          <tr>
            <td
              class="font-weight-bold"
              v-for="(Ttitle, index) in header"
              :key="index"
            >
              {{ Ttitle.title }}
            </td>
          </tr>
        </thead>

        <tbody v-if="admin?.length > 0 && loading === false">
          <tr class="border-b" v-for="(items, index) in admin" :key="index">
            <td># {{ index + 1 }}</td>
            <td class="d-flex align-center">
              <div>
                <v-img
                  width="40px"
                  :src="items?.avatar ?? 'https://via.placeholder.com/15'"
                  class="rounded-circle"
                >
                </v-img>
              </div>
              <div class="ml-2">
                <span class="font-weight-bold"> {{ items?.firstname }}</span>
                <span class="ml-1 font-weight-bold">
                  {{ items?.lastname }}</span
                >
                <p> {{ items?.email ?? "No data" }}</p>
              </div>
            </td>
      
            <td>
              {{ items?.phone_number ?? "No data" }}
            </td>
            <td>
              <v-chip>
                {{ blockedStatus(items?.blocked_at) }}
              </v-chip>
            </td>
            <!-- <td>
              <v-switch @input="restoreAdmin(items?.id)"></v-switch>
            </td>
            <td>
              <v-switch @input="activationAdmin(items?.id)"></v-switch>
            </td> -->
            <td>
              <v-row justify="center">
                <v-menu transition="scroll-y-transition">
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
                    <v-list-item link color="secondary">
                      <v-list-item-title> View Details </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="editAdmin(items?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Update admin </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="deleteAdmin(items?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Delete admin </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>

        <tr v-else-if="loading === false && admin?.length <= 0" class="mt-7">
          <td colspan="8" class="text-center">No data found</td>
        </tr>
      </v-table>
      <v-layout
        v-if="loading == true"
        class="align-center justify-center w-100 my-5"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550px">
        <v-card>
          <v-card-title class="py-4">
            <h3 class="text-h5 font-weight-bold">New Admin</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="adminDetails.firstname"
                      label="First name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="adminDetails.lastname"
                      label="Last name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="adminDetails.email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-autocomplete
                      :items="[...countryNames]"
                      label="Countries"
                      required
                      v-model="adminDetails.country_name"
                      hint="This field is optional"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              class="px-7"
              variant="outlined"
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              :loading="loading"
              @click="CreateAdmin()"
              color="secondary"
              class="px-12"
              variant="flat"
            >
              Create admin
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style scoped></style>
