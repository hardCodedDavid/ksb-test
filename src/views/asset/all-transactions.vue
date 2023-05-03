<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useAssetStore } from "../../stores/asset";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { watchDebounced } from "@vueuse/core";
// import { storeToRefs } from "pinia";
import { useAuthStore } from '../../stores/auth'

import { useWithdrawalsStore } from "../../stores/withdrawals";

const { getAllTransactionCount } = useWithdrawalsStore();

const { asset_total } = storeToRefs(useWithdrawalsStore());
const { permissions } = storeToRefs(useAuthStore());

const {
  getAllAssetTransactions,
  approveAssetTransactions,
  declineAssetTransactions,
  getSingleAssetTransactions,
  getAllAssetTransactionByTradeType,
  getAllAssetTransactionsStatus,
  getAllAssetTransactionByReference,
  getAllAssetTransactionByDate,
  partialApproveRequest,
} = useAssetStore();

// const { getAllUsers } = useUserStore();
const partial_approve = reactive({
  review_rate: "",
  review_note: "",
  review_proof: null,
});
const partial = (e: any) => {
  partial_approve.review_proof = e.target.files[0];
};
const { allTransactions, loading, dialog, dialog2, single_transactions } = storeToRefs(
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
const date2 = ref("");
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
  await getAllTransactionCount()
  await getAllAssetTransactions(
    status.value,
    page.value,
    type.value,
    search.value,
    date.value,
    date2.value
  );
  // await getAllUsers()
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "approved" | "declined" | "partially_approved";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "approved"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : status == "partially_approved"
    ? "purple lighten-3"
    : "";
};
//

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

// const open_file = (file: string) => {
//   window.open(file);
// }

const note = ref("");
const id = ref("");

const reproof = ref("");
const get_reproof = (e: any) => {
  reproof.value = e.target.files[0];
};

const reset = async () => {
  (status.value = ""),
    (page.value = 1),
    (type.value = ""),
    (search.value = ""),
    (date.value = ""),
    (date2.value = "");
  await getAllAssetTransactions(
    status.value,
    page.value,
    type.value,
    search.value,
    date.value,
    date2.value
  );
};
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <h2 class="my-3">Asset transactions</h2>
      <v-row v-if="permissions?.length == 18" class="my-3">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="pa-6 h-100">
            <div class="">
              <h4>Total Earnings</h4>
            </div>

            <div v-if="asset_total?.length > 0" class="mt-11">
              <h2 class="mb-2">₦‎ {{formatCurrency(asset_total[0].total_approved_transactions_amount)}}</h2>
              <span>All time</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="8">
          <v-card elevation="0" class="py-4 px-2">
            <div class="ml-16 d-flex align-center justify-space-between w-100">
              <div class="d-flex align-start justify-start flex-column w-100">
                <v-avatar color="#e5fafb" size="x-large">
                  <vue-feather
                    type="check-circle"
                    class="text-dark text-success"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">{{asset_total[0].total_approved_transactions_count}}</h2>
                  <span>Successful</span>
                </div>
              </div>
              <div class="d-flex align-start justify-start flex-column w-100 flex-grow-1">
                <v-avatar color="#FFF9C4" size="x-large">
                  <vue-feather
                    type="bar-chart"
                    class="text-dark text-primary"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">{{asset_total[0].total_pending_transactions_count}}</h2>
                  <span>pending</span>
                </div>
              </div>
              <div class="d-flex align-start justify-start flex-column w-100 flex-grow-1">
                <v-avatar color="#FFCCBC" size="x-large">
                  <vue-feather type="x-circle" class="text-dark text-error"></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">{{asset_total[0].total_declined_transactions_count}}</h2>
                  <span>Failed</span>
                </div>
              </div>
              <div class="d-flex align-start justify-start flex-column w-100 flex-grow-1">
                <v-avatar color="purple" size="x-large">
                  <vue-feather type="check" class="purple-lighten-1"></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">{{asset_total[0].total_partially_approved_transactions_count}}</h2>
                  <span>Partial</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-card flat rounded="0" elevation="0" class="my-5 pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <h4>Filter Options:</h4>
          <div>
            <v-btn @click="reset" width="200px" class="mr-4">Reset</v-btn>
            <v-btn
              @click="getAllAssetTransactions(status, page, type, search, date, date2)"
              width="200px"
              color="secondary"
              >Filter</v-btn
            >
          </div>
        </div>

        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              label="Filter by reference"
              density="compact"
              v-model="search"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              label="Filter by status"
              density="compact"
              :persistent-placeholder="true"
              :placeholder="'Select'"
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
              v-model="type"
              :items="['Buy', 'Sell']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date"
              type="date"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date2"
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
              <th v-for="(headings, index) in header" :key="index" class="text-left">
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
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY hh:mm a").value }}
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
                        :to="{ name: 'ViewAssetsTransaction', params: { id: item?.id } }"
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
                        @click="
                          dialog = true;
                          id = item?.id;
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Decline Request </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'transferred'"
                        @click="
                          dialog2 = true;
                          id = item?.id;
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Partial Approval </v-list-item-title>
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

        <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
      <v-pagination
        v-model="page"
        :length="allTransactions?.last_page"
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

    <v-dialog v-if="dialog" v-model="dialog" max-width="500px" width="100%">
      <v-card max-width="500px">
        <v-card-text>
          <h3>Decline Transaction</h3>
          <p>Enter Reasons for Declining this asset transaction</p>
        </v-card-text>

        <v-container class="mt-7">
          <v-textarea label="Comments" v-model="note" variant="outlined"></v-textarea>

          <v-file-input
            @change="get_reproof"
            hint="Optional"
            persistent-hint
            label="Review proof"
            append-inner-icon="mdi-paperclip"
            prepend-icon=""
          ></v-file-input>

          <v-btn
            color="secondary"
            class="my-5"
            block
            :loading="declining"
            @click="declineAssetTransactions(id, note, reproof)"
            >Submit</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog2 = false"
            icon="mdi-close"
            color="secondary"
            variant="text"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>
        <v-form class="my-10">
          <v-text-field
            prefix="₦‎"
            v-model="partial_approve.review_rate"
            type="number"
            variant="outlined"
            label="Amount"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Review Note"
          ></v-textarea>
          <v-file-input
            prepend-icon=""
            variant="outlined"
            @change="partial"
            label="Review Proof"
          ></v-file-input>
          <v-btn
            :loading="loading"
            @click="partialApproveRequest(id, partial_approve)"
            block
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
