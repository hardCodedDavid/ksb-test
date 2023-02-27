<template>
  <div>
    <v-card rounded="0" class="pa-5">
      <v-tabs v-model="tab">
        <v-tab value="one" class="font-weight-bold">User Information</v-tab>
        <!-- <v-tab value="two" class="font-weight-bold">Giftcard Transactions</v-tab>
        <v-tab value="three" class="font-weight-bold">All Transactions</v-tab> -->
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
              <v-avatar color="secondary" :size="80" class="my-4 position-relative">
                <v-img cover v-if="detail.avatar !== null" :src="detail.avatar"></v-img>
                <span v-else class="text-h5 text-uppercase">{{
                  detail.email.slice(0, 2)
                }}</span>
              </v-avatar>

              <h3>{{ detail.firstname }} {{ detail.lastname }}</h3>

              <div class="text-center">
                <p>{{ detail.email }}</p>
                <p class="font-weight-bold mt-2">
                  Phone: <span class="font-weight-light">{{ detail.phone_number }}</span>
                </p>
                <p class="font-weight-bold mt-2">
                  Wallet balance:
                  <span class="font-weight-light">₦{{ detail.wallet_balance }}</span>
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

        <!-- <v-window-item value="two"> 
        
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

        <v-window-item value="three"> Three </v-window-item> -->
        <v-window-item value="four">
          <v-table class="mt-5">
            <thead>
              <tr>
                <th v-for="(headings, index) in header" :key="index" class="text-left">
                  {{ headings.title }}
                </th>
              </tr>
            </thead>
            <tbody v-if="allTransactions?.length > 0 && loading == false">
              <tr v-for="item in allTransactions" :key="item.id">
                <td :class="{ 'font-weight-bold': item.account_name == null }">
                  {{ item.account_name ?? "No name" }}
                </td>
                <td>{{ item.reference }}</td>
                <td>₦‎{{ item.asset_amount }}</td>
                <td>
                  {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
                </td>
                <td>{{ item.trade_type }}</td>

                <td>
                  <v-chip
                    label
                    class="text-capitalize font-weight-bold pa-3"
                    :color="status_color(item?.status)"
                    >{{ item?.status }}</v-chip
                  >
                </td>
                <td>
                  <!-- <v-icon icon="mdi-dots-vertical"></v-icon> -->
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
                          @click="getSingleAssetTransactions(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title> View Details </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="item?.status == 'transferred'"
                          @click="approveAssetTransactions(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title> Approve Request </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="item?.status == 'transferred'"
                          @click="declineAssetTransactions(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title> Decline Request </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-table>

          <p
            class="font-weight-bold text-center my-3"
            v-if="allTransactions?.length <= 0 && loading == false"
          >
            No data found
          </p>

          <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
        </v-window-item>
      </v-window>
    </v-card>

    <v-dialog v-model="dialog" width="600">
      <v-card class="pa-3">
        <h3 class="text-center my-3">Asset transactions details</h3>
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4>Account name</h4>
              <p>{{ single_transactions.account_name ?? "No data" }}</p>
            </div>
            <div>
              <h4>Account number</h4>
              <p>{{ single_transactions.account_number ?? "No data" }}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Reference</h4>
              <p>{{ single_transactions.reference ?? "No data" }}</p>
            </div>
            <div>
              <h4>Account number</h4>
              <p>{{ single_transactions.account_number ?? "No data" }}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Status</h4>
              <v-chip
                label
                class="text-capitalize font-weight-bold pa-3"
                :color="status_color(item?.status)"
                >{{ single_transactions?.status ?? "No data" }}</v-chip
              >
            </div>
            <div>
              <h4>Payable amount</h4>
              <p>₦‎ {{ single_transactions.payable_amount ?? "No data" }}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Asset amount</h4>
              <p>₦‎ {{ single_transactions.asset_amount ?? "No data" }}</p>
            </div>
            <div>
              <h4>Service charge</h4>
              <p>₦‎ {{ single_transactions.service_charge ?? "No data" }}</p>
            </div>
          </div>

          <div class="my-5">
            <h4>Transaction Receipts</h4>
            <v-img :src="single_transactions.proof"></v-img>
          </div>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../stores/user";
import { useAssetStore } from "../stores/asset";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
const { getUsers, restoreUsers, blockUsers } = useUserStore();
const { user, filterUserById } = storeToRefs(useUserStore());
const { allTransactions, loading } = storeToRefs(useAssetStore());
const {
  getAllAssetTransactionsByUserId,
  declineAssetTransactions,
  approveAssetTransactions,
  getSingleAssetTransactions,
  single_transactions,
} = useAssetStore();
const tab = ref(null);
const route: any = useRoute();

const userDetails = ref<any>([]);

onMounted(async () => {
  await getAllAssetTransactionsByUserId(route.params.id);
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
const header = ref([
  {
    title: "Account name",
  },
  {
    title: "Reference No.",
  },

  {
    title: "Amount",
  },
  {
    title: "Date",
  },
  {
    title: "Trade Type",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

type StatusType = "pending" | "transferred" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow lighten-3"
    : status == "transferred"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
</script>

<style scoped></style>
