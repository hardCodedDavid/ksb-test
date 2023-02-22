<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAssetStore } from "../../stores/asset";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";

const {
  getAllAssetTransactions,
  declineAsset,
  
  getSingleAssetTransactions,
} = useAssetStore();
const { allTransactions, loading, dialog, single_transactions } = storeToRefs(
  useAssetStore()
);

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
onMounted(async () => {
  await getAllAssetTransactions();
});

// CHANGE STATUS COLOR
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
//
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <h2 class="my-3">Asset transactions</h2>
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
                        @click="approveRequest(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Approve Request </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'transferred'"
                        @click="declineRequest(item?.id)"
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

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
    </v-col>

    <v-dialog v-model="dialog" width="600">
      <v-card class="pa-3">
        <h3 class="text-center my-3">Asset transactions details</h3>
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4>Account name</h4>
              <p>{{ single_transactions.account_name ?? 'No data'}}</p>
            </div>
            <div>
              <h4>Account number</h4>
              <p>{{ single_transactions.account_number ?? 'No data'}}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Reference</h4>
              <p>{{ single_transactions.reference ?? 'No data' }}</p>
            </div>
            <div>
              <h4>Account number</h4>
              <p>{{ single_transactions.account_number ?? 'No data' }}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Status</h4>
             <v-chip
                  label
                  class="text-capitalize font-weight-bold pa-3"
                  :color="status_color(item?.status)"
                  >{{ single_transactions?.status ?? 'No data' }}</v-chip
                >
            </div>
            <div>
              <h4>Payable amount</h4>
              <p>₦‎ {{ single_transactions.payable_amount ?? 'No data' }}</p>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between my-5">
            <div>
              <h4>Asset amount</h4>
             <p>₦‎ {{single_transactions.asset_amount ?? 'No data'}}</p>
            </div>
            <div>
              <h4>Service charge</h4>
              <p>₦‎ {{ single_transactions.service_charge ?? 'No data' }}</p>
            </div>
          </div>

          <div class="my-5">
          <h4>
            Transaction Receipts
          </h4>
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
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
