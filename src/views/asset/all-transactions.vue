<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAssetStore } from "../../stores/asset";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { watchDebounced } from "@vueuse/core";
const {
  getAllAssetTransactions,
  approveAssetTransactions,
  declineAssetTransactions,
  getSingleAssetTransactions,
  getAllAssetTransactionByTradeType,
  getAllAssetTransactionsStatus,
  getAllAssetTransactionByReference,
  getAllAssetTransactionByDate,
} = useAssetStore();

const { getAllUsers } = useUserStore();

const { allTransactions, loading, dialog, single_transactions } = storeToRefs(
  useAssetStore()
);
const tab = ref(null);
const page = ref(1);



const header = ref([
  {
    title: "No.",
  },
  {
    title: "Full name",
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

const status = ref("");
const search = ref("");
const type = ref("");
const date = ref("");
const search_by_reference = () => {
  watchDebounced(
    search,
    async () => {
      await getAllAssetTransactionByReference(search.value);
    },
    { debounce: 1000, maxWait: 5000 }
  );
};

onMounted(async () => {
  await getAllAssetTransactions(status.value, 1, type.value);
  // await getAllUsers()
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "approved" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "approved"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//

const open_file = (file: string) => {
  window.open(file);
};
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <h2 class="my-3">Asset transactions</h2>

      <v-card flat rounded="0" elevation="0" class="my-5 pa-4">
        <h4>Filter Options:</h4>

        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              label="Filter by reference"
              density="compact"
              @blur="search_by_reference"
              v-model="search"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              label="Filter by status"
              density="compact"
              :persistent-placeholder="true"
              :placeholder="'Select'"
              @update:modelValue="getAllAssetTransactionsStatus"
              v-model="status"
              :items="['Approved', 'Declined', 'Transferred', 'Pending']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              label="Filter by trade type"
              density="compact"
              placeholder="Select"
              @update:modelValue="getAllAssetTransactionByTradeType"
              v-model="type"
              :items="['Buy', 'Sell']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              label="Filter by date created"
              density="compact"
              @update:modelValue="getAllAssetTransactionByDate"
              v-model="date"
              type="date"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="pa-5">
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
          <tbody v-if="allTransactions?.data?.length > 0 && loading == false">
            <tr v-for="(item, index) in allTransactions?.data" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td class="font-weight-bold">
                {{ item.user?.firstname ?? "No name" }}
                {{ item.user?.lastname }}
              </td>
              <td>{{ item.reference }}</td>
              <td>₦‎{{ item.payable_amount.toLocaleString() }}</td>
              <td>
                {{
                  useDateFormat(item?.created_at, "DD, MMMM-YYYY hh:mm a").value
                }}
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
          v-if="allTransactions?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
      <v-pagination
        v-model="page"
        :length="4"
        @next="getAllAssetTransactions(status, page, type)"
        @prev="getAllAssetTransactions(status, page, type)"
        @update:modelValue="getAllAssetTransactions(status, page, type)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-dialog v-model="dialog" width="600">
      <v-card class="pa-3">
        <h3 class="text-center my-3">Asset transactions details</h3>

        <v-tabs v-model="tab" class="my-4" bg-color="secondary">
          <v-tab value="one">First view</v-tab>
          <v-tab value="two">Second view</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="one">
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
                    :color="status_color(single_transactions?.status)"
                    >{{ single_transactions?.status ?? "No data" }}</v-chip
                  >
                </div>
                <div class="mr-2">
                  <h4>Payable amount</h4>
                  <p>
                    ₦‎
                    {{
                      single_transactions.payable_amount.toLocaleString() ??
                      "No data"
                    }}
                  </p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Asset amount</h4>
                  <p>
                    {{ single_transactions.asset?.code ?? "No data" }}

                    {{
                      single_transactions.asset_amount.toLocaleString() ??
                      "No data"
                    }}
                  </p>
                </div>
                <div class="mr-4">
                  <h4>Service charge</h4>
                  <p>
                    ₦‎
                    {{
                      single_transactions.service_charge.toLocaleString() ??
                      "No data"
                    }}
                  </p>
                </div>
              </div>

              <div class="my-5">
                <v-card
                  rounded="0"
                  class="pa-5 my-3 d-flex align-center justify-between w-100"
                >
                  <div
                    v-if="single_transactions.proof !== null"
                    class="d-flex align-center justify-between w-100"
                  >
                    <v-icon icon="mdi-file-document"></v-icon>
                    <p>Transaction Receipts</p>
                  </div>
                  <v-btn
                    v-if="single_transactions.proof !== null"
                    @click="open_file(single_transactions.proof)"
                    color="secondary"
                    >View reciept</v-btn
                  >

                  <p v-else class="text-center py-4">No Transaction Receipts</p>
                </v-card>
                <!-- <v-img :src="single_transactions.proof"></v-img> -->
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="two">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4>Comments</h4>
                  <p>{{ single_transactions.comments ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Selling rate</h4>
                  <p>{{ single_transactions.rate ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Wallet address</h4>
                  <p>{{ single_transactions.wallet_address ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Trade type</h4>
                  <p>{{ single_transactions.trade_type ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Buying rate</h4>
                  <p>{{ single_transactions.asset?.buy_rate ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Asset code</h4>
                  <p>{{ single_transactions.asset?.code ?? "No data" }}</p>
                </div>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
        <!-- <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
