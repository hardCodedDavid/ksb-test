<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";
const { getUsers } = useUserStore();
const { user, loading, filterUserById } = storeToRefs(useUserStore());
onMounted(async () => {
  await getUsers();
});
const dialog = ref(false);
const header = ref([
  { title: "Avatar" },
  {
    title: "First Name",
  },
  {
    title: "Last Name",
  },
  { title: "Username" },
  {
    title: "Email",
  },
  {
    title: "Phone Number",
  },
  {
    title: "Wallet Balance",
  },

  {
    title: "View Details",
  },
  {
    title: "Toggle Blocked Status",
  },
]);

const userDetails = ref<any>([]);

// user initials
const userInitials = computed(() => {
  return userDetails.value[0]?.email.slice(0, 2);
});
//

const viewUsers = (id: string) => {
  dialog.value = true;
  userDetails.value = filterUserById.value(id);
};
</script>

<template>
  <div>
    <h3 class="my-7">All Users</h3>
    <v-card>
      <v-table>
        <thead>
          <tr>
            <th
              v-for="(headings, index) in header"
              :key="index"
              class="text-left"
            >
              {{ headings.title }}
            </th>
          </tr>
        </thead>

        <tbody v-if="!loading">
          <tr class="pa-3" v-for="item in user" :key="item.id">
            <td>
              <v-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-avatar>
            </td>
            <td>{{ item.firstname }}</td>
            <td>{{ item.lastname }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone_number }}</td>
            <td>₦ {{ item.wallet_balance }} </td>
            <td>
              <vue-feather
                @click="viewUsers(item.id)"
                type="eye"
                class="cursor-pointer"
              />
            </td>
            <td>
              <v-switch color="success"></v-switch>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-layout v-if="loading" class="align-center justify-center ma-12 w-100">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

    <v-dialog max-width="800px" v-model="dialog">
      <v-card class="pa-5">
        <h3>User Details</h3>

        <div class="w-100 d-flex align-center justify-center">
          <v-row
            v-for="user in userDetails"
            :key="user.id"
            class="my-12 w-100 max-w-lg"
          >
            <v-col cols="12" sm="6" lg="6" class="">
              <v-avatar rounded="0" color="info" size="180">
                <span
                  v-if="user.avatar == null"
                  class="text-center text-uppercase"
                  >{{ userInitials }}</span
                >
                <v-img v-else :src="user.avatar"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" sm="6" lg="6" class="">
              <h4 class="py-3">User Name:</h4>
              <p>{{ user.username }}</p>
              <h4 class="py-3">Last Name:</h4>
              <p>{{ user.lastname }}</p>
              <h4 class="py-3">Email:</h4>
              <p>{{ user.email }}</p>
              <h4 class="py-3">Phone Number:</h4>
              <p>{{ user.phone_number }}</p>
              <h4 class="py-3">Wallet Balance:</h4>
              <p>{{ user.wallet_balance }}</p>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>



<style scoped>
.max-w-lg {
  max-width: 600px !important;
}
</style>