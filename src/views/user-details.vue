<template>
  <div>
    <v-card rounded="0" class="pa-5">
      <v-tabs v-model="tab">
        <v-tab value="one" class="font-weight-bold">User Information</v-tab>
        <v-tab value="two" class="font-weight-bold">Giftcard Transactions</v-tab>
        <v-tab value="three" class="font-weight-bold">All Transactions</v-tab>
        <v-tab value="four" class="font-weight-bold">Asset Transactions</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="one">
          <div class="d-flex align-center justify-center w-100 my-7">
            <div
              class="d-flex align-center justify-center flex-column w-100"
              v-for="(detail, index) in userDetails"
              :key="index"
            >
            
                <v-avatar
                  color="secondary"
                  :size="80"
                  class="my-4 position-relative"
                >
                  <v-img
                    cover
                    v-if="detail.avatar !== null"
                    :src="detail.avatar"
                  ></v-img>
                  <span v-else class="text-h5 text-uppercase">{{
                    detail.email.slice(0, 2)
                  }}</span>
                </v-avatar>
            

              <h3>{{ detail.firstname }} {{ detail.lastname }}</h3>

              <div class="text-center">
                <p>{{ detail.email }}</p>
                <p class="font-weight-bold mt-2">
                  Phone:  <span class="font-weight-light">{{ detail.phone_number }}</span>
                </p>
                <p class="font-weight-bold mt-2">
                  Wallet balance: <span class="font-weight-light">₦{{ detail.wallet_balance }}</span>
                </p>

                <div class="mt-6 d-flex align-center w-100">
                  <v-switch
                    color="secondary"
                    hide-details
                    inset
                    :label="'Restore User'"
                  ></v-switch>
                  <v-switch
                    color="secondary"
                    hide-details
                    inset
                    class="ml-4"
                    @input="blockUsers(detail?.id)"
                    :label="'Toggle Blocked Status'"
                  ></v-switch>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <v-window-item value="two"> 
        
          <v-table class="mt-7">
            <thead>
            
            <tr>
             <th
            :key="index"
            v-for="(headerTitle, index) in giftCardCategoryHeader"
            class="text-left"
          >
            {{ headerTitle.title }}
          </th>
            </tr>
            </thead>
          </v-table>
         </v-window-item>

        <v-window-item value="three"> Three </v-window-item>
        <v-window-item value="four"> four </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
const { getUsers, restoreUsers, blockUsers } = useUserStore();
const { user, filterUserById } = storeToRefs(useUserStore());
const tab = ref(null);
const route: any = useRoute();

const userDetails = ref<any>([]);

onMounted(async () => {
  await getUsers();
  userDetails.value = { ...filterUserById.value(route.params.id) };
});
const giftCardCategoryHeader = reactive([
  {
    title: "Icon",
  },
  {
    title: "Name",
  },
  {
    title: "Created At",
  },

  // {
  //   title: "Restore",
  // },
  {
    title: "Toggle Activation",
  },
  {
    title: "Actions",
  },
]);
const transactions = reactive([
  {
    title: "Username",
  },
  {
    title: "Ref No.",
  },
  {
    title: "Amount (NGN)",
  },

  {
    title: "Date & Time",
  },
  {
    title: "Type",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

</script>

<style scoped></style>
