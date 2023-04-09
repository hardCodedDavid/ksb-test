<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDateFormat, watchDebounced } from "@vueuse/core";
const { getUsers, restoreUsers, blockUsers, financeUsers } = useUserStore();
const { user, loading, filterUserById } = storeToRefs(useUserStore());

const dialog = ref(false);
const dialog2 = ref(false);

const page = ref(1)
const header = ref([
  { title: "No." },
  { title: "User Info" },
  {
    title: "Phone Number",
  },
  {
    title: "Date and Time Joined",
  },
  {
    title: "Wallet Balance",
  },
  {
    title: "Transaction Count",
  },
  {
    title: "Status",
  },

  {
    title: "Actions",
  },
]);

const userDetails = ref<any>([]);
const router = useRouter();

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
    name: "UserDetails",
    params: { id: id },
  });
};

const status_color = (status: string | null) => {
  return status == null ? "green-darken-3" : "red-darken-3";
};

const name = ref("");
const email = ref("");
const date1 = ref("");
const date2 = ref("");

const clear_name = () => {
  name.value = ""
}
const clear_email = () => {
  email.value = ""
}

onMounted(async () => {
  await getUsers(page.value, name.value, email.value, date1.value, date2.value);
});

const search_by_name = () => {
  watchDebounced(
    name,
    async () => {
      await getUsers(page.value, name.value);
    },
    { debounce: 5000, maxWait: 5000 }
  );
};
const search_by_email = () => {
  watchDebounced(
    email,
    async () => {
      await getUsers(page.value,name.value, email.value, date1.value, date2.value);
    },
    { debounce: 7000, maxWait: 7000 }
  );
};
</script>

<template>
  <div>
    <h3 class="my-7">All Users</h3>

    <v-card class="py-4 px-5 my-4">
      <h4>Filter options:</h4>
      <v-row class="mt-3">
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            label="Search Users"
            variant="outlined"
            v-model="name"
            clearable
            @click:clear="clear_name"
            @update:modelValue="search_by_name()"
            density="compact"
            
          ></v-text-field>
          
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            label="Filter by email"
            variant="outlined"
            v-model="email"
            clearable
            @click:clear="clear"
            @update:modelValue="search_by_email"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            label="Filter date joined from"
            variant="outlined"
            density="compact"
            type="date"
            @update:modelValue="
              (...args) => getUsers(page,name, email, ...args, date2)
            "
            v-model="date1"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            label="Filter date joined to"
            variant="outlined"
            type="date"
            v-model="date2"
            @update:modelValue="
              (...args) => getUsers(page,name, email, date1, ...args)
            "
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
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
          <tr class="pa-3" v-for="(item, index) in user?.data" :key="item?.id">
            <td>{{ index + 1 }}</td>
            <td>
              <!-- <v-avatar>
                <v-img class="border-radius" :src="item?.avatar"></v-img>
              </v-avatar> -->

              <div class="d-flex align-center">
                <!-- <v-avatar size="45px">
                  <v-img
                     cover
                    :src="item?.avatar ?? 'https://via.placeholder.com/15'"
                    class="rounded-circle"
                  >
                  </v-img>
                </v-avatar> -->
                <div>
                  <span class="font-weight-bold">
                    {{ item?.firstname.substring(0, 10) }}</span
                  >
                  <span class="ml-1 font-weight-bold">
                    {{ item?.lastname.substring(0, 10) }}</span
                  >
                  <p>{{ item?.email ?? "No data" }}</p>
                </div>
              </div>
            </td>
            <td>(+234) {{ item?.phone_number }}</td>
            <td>
              {{
                useDateFormat(item?.created_at, "DD, MMMM-YYYY").value
              }}
              <div>
                {{
                useDateFormat(item?.created_at, "hh:mm a").value
              }}
              </div>
            </td>
            <td>₦ {{ item.wallet_balance.toLocaleString() }}</td>
             <td></td>
            <td>
              <v-chip label :color="status_color(item?.blocked_at)">
                {{ item?.blocked_at == null ? "Active" : "Blocked" }}
              </v-chip>
            </td>
           
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
      <p class="pa-6 text-center" v-if="user?.data?.length <= 0 && loading == false">No data</p>
      <v-layout v-if="loading" class="align-center justify-center my-6 w-100">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

     <v-pagination
        v-model="page"
        :length="user?.last_page"
        @next="getUsers(page,date1, date2)"
        @prev="getUsers( page,date1, date2)"
        @update:modelValue="getUsers(page,date1, date2)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
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
.rounded-full {
  border-radius: 50% !important;
}
table tbody tr td {
  padding: 15px !important;
}
</style>
