<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useUserStore } from "../stores/user";
import  { useRouter } from 'vue-router'
import { storeToRefs } from "pinia";
const { getUsers, restoreUsers, blockUsers, financeUsers } = useUserStore();
const { user, loading, filterUserById } = storeToRefs(useUserStore());
onMounted(async () => {
  await getUsers();
});
const dialog = ref(false);
const dialog2 = ref(false);
const header = ref([
  { title: "No." },
  { title: "User Info" },
  {
    title: "Phone Number",
  },
  {
    title: "Wallet Balance",
  },

  {
    title: "Actions",
  },
]);

const userDetails = ref<any>([]);
const router = useRouter()

// user initials
const userInitials = computed(() => {
  return userDetails.value[0]?.email.slice(0, 2);
});
//

const finance = reactive({
  type: "Select",
  amount: "",
});
const id = ref("");

const viewUsers = (id: string) => {
  dialog.value = true;
  userDetails.value = filterUserById.value(id);

  return router.push({
    name:"UserDetails",
    params:{id: id}
  })
};
</script>

<template>
  <div>
    <h3 class="my-7">All Users</h3>



    <v-card>
      <v-row class="ml-3 mt-3">
         <v-col cols="12" sm="6" lg="4">
          <v-text-field label="Search Users" variant="outlined" density="compact"></v-text-field>
         </v-col>
      </v-row>
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
          <tr class="pa-3" v-for="(item,index) in user" :key="item?.id">
           <td># {{ index + 1 }}</td>
            <td>
              <!-- <v-avatar>
                <v-img class="border-radius" :src="item?.avatar"></v-img>
              </v-avatar> -->

              <div class="d-flex align-center">
                <v-avatar size="45px">
                  <v-img
                     cover
                    :src="item?.avatar ?? 'https://via.placeholder.com/15'"
                    class="rounded-circle"
                  >
                  </v-img>
                </v-avatar>
                <div class="ml-4">
                  <span class="font-weight-bold"> {{ item?.firstname.substring(0,10) }}</span>
                  <span class="ml-1 font-weight-bold">
                    {{ item?.lastname.substring(0,10) }}</span
                  >
                  <p>{{ item?.email ?? "No data" }}</p>
                </div>
              </div>
            </td>
            <td>{{ item?.phone_number }}</td>
            <td>₦ {{ item?.wallet_balance }}</td>
            <!-- 
            <td>
              <v-switch
                @input="blockUsers(item?.id)"
                color="success"
              ></v-switch>
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
                    <v-list-item
                      @click="viewUsers(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> View user </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="
                        dialog2 = true;
                        id = item?.id;
                      "
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Finance user </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-layout v-if="loading" class="align-center justify-center ma-12 w-100">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

    <!-- <v-dialog max-width="800px" v-model="dialog">
      <v-card class="pa-5">
        <h3>User Details</h3>

        <div class="w-100 d-flex align-center justify-center">
          <v-row
            v-for="user in userDetails"
            :key="user?.id"
            class="my-12 w-100 max-w-lg"
          >
            <v-col cols="12" sm="6" lg="6" class="">
              <v-avatar rounded="0" color="info" size="180">
                <span
                  v-if="user.avatar == null"
                  class="text-center text-uppercase"
                  >{{ userInitials }}</span
                >
                <v-img v-else :src="user?.avatar"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" sm="6" lg="6" class="">
              <h4 class="py-3">User Name:</h4>
              <p>{{ user?.username }}</p>
              <h4 class="py-3">Last Name:</h4>
              <p>{{ user?.lastname }}</p>
              <h4 class="py-3">Email:</h4>
              <p>{{ user?.email }}</p>
              <h4 class="py-3">Phone Number:</h4>
              <p>{{ user?.phone_number }}</p>
              <h4 class="py-3">Wallet Balance:</h4>
              <p>{{ user?.wallet_balance }}</p>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog> -->

    <v-dialog v-model="dialog2" max-width="500px">
      <v-card class="pa-4">
        <h3>Finance User</h3>
        <v-form class="mt-8 py-8">
          <v-select
            v-model="finance.type"
            label="Transaction Type"
            variant="outlined"
            :items="['Debit', 'Credit']"
          ></v-select>
          <v-text-field
            v-model="finance.amount"
            label="Amount"
            variant="outlined"
          ></v-text-field>
          <v-btn
            :loading="loading"
            color="primary"
            block
            @click="financeUsers(id, finance)"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.max-w-lg {
  max-width: 600px !important;
}
.rounded-full{
  border-radius:50% !important;
}
table tbody tr td {
  padding: 15px !important;
}
</style>
