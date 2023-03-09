<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useWithdrawalsStore } from "../../stores/withdrawals";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { watchWithFilter, debounceFilter } from "@vueuse/core";

const {
  getAllWithDrawals,
  approveRequest,
  declineRequest,
  getSingleWithDrawals,
  filterWithDrawalsByDateCreated,
} = useWithdrawalsStore();
const { withdrawals, loading, singleWithdrawal } = storeToRefs(
  useWithdrawalsStore()
);
const status = ref("");
onMounted(async () => {
  await getAllWithDrawals(status.value, 1);
});

// const search = ref("");

const page_title = ref({ title: "Withdrawals" });
const breadcrumbs = ref([
  {
    text: "Transactions",
    disabled: false,
    href: "#",
  },
  {
    text: "Withdrawals",
    disabled: true,
    href: "#",
  },
]);

const header = ref([
  {
    title: "No.",
  },
  {
    title: "Full name",
  },
  {
    title: "Amount (NGN)",
  },
  {
    title: "Account number",
  },
  {
    title: "Date and Time",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

const status_options = ref(["Pending", "Completed", "Declined"]);

// CHANGE STATUS COLOR
type StatusType = "pending" | "completed" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "completed"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//
// VIEW WITHDRAWAL
const dialog = ref(false);
const fetching = ref(false);
const viewWithDrawalRequest = async (id: string) => {
  dialog.value = true;
  fetching.value = true;
  await getSingleWithDrawals(id);
  fetching.value = false;
};

const page = ref(1);

const date = ref("");
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Height -->
  <!-- ----------------------------------------------------------------------------- -->
  <!-- <v-data-table></v-data-table> -->
  <div>
    <BaseBreadcrumb
      :title="page_title.title"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <div class="mt-4">
      <v-card flat rounded="1" class="my-5 pa-4">
        <h4>Filter Options:</h4>

        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="6">
            <v-select
              label="Sort by date created"
              v-model="date"
              @update:modelValue="filterWithDrawalsByDateCreated"
              :items="['created_at']"
              density="compact"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              v-model="status"
              label="Filter by transaction status"
              density="compact"
              @update:modelValue="getAllWithDrawals"
              :items="status_options"
              variant="outlined"
            ></v-select>
          </v-col>
          <!-- <v-col cols="12" sm="6" md="6">
            <v-text-field
              @update:modelValue="searching"
              v-model="search"
              label="Search"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col> -->
        </v-row>
      </v-card>

      <v-card class="pa-5">
        <v-table>
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
          <tbody v-if="loading == false">
            <tr
              class="pa-3"
              v-for="(withdrawal, index) in withdrawals"
              :key="withdrawal?.id"
            >
              <td>{{ index + 1 }}</td>
              <td class="font-weight-bold">
                <span class="text-capitalize">
                  {{ withdrawal?.user?.firstname ?? "---" }}
                  {{ withdrawal?.user?.lastname ?? "---" }}</span
                >
              </td>
              <td>₦‎ {{ withdrawal.amount.toLocaleString() }}</td>
              <td>{{ withdrawal?.account_number ?? "---" }}</td>
              <td>
                {{
                  useDateFormat(withdrawal?.created_at, "DD, MMMM-YYYY").value
                }}
              </td>
              <!-- <td>{{ item.status }}</td> -->

              <!-- <td>{{ item.service }}</td>
              <td>{{ item.type }}</td>

              <td>{{ item.date }}</td> -->
              <td>
                <v-chip
                  label
                  class="text-capitalize font-weight-bold pa-3"
                  :color="status_color(withdrawal?.status)"
                  >{{ withdrawal?.status }}</v-chip
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
                        @click="viewWithDrawalRequest(withdrawal?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Details </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="withdrawal?.status == 'pending'"
                        @click="approveRequest(withdrawal?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Approve Withdrawal Request
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="withdrawal?.status == 'pending'"
                        @click="declineRequest(withdrawal?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Decline Withdrawal Request
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <p
          v-if="loading == false && withdrawals?.length <= 0"
          class="text-center py-6"
        >
          No data available
        </p>
      </v-card>
      <v-pagination
        v-model="page"
        :length="4"
        @next="getAllWithDrawals(status, page)"
        @prev="getAllWithDrawals(status, page)"
        @update:modelValue="getAllWithDrawals(status, page)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </div>

    <v-dialog v-if="dialog" v-model="dialog" max-width="600px">
      <v-card class="">
        <h3 class="text-justify pa-5">Withdrawal request details</h3>
        <v-divider></v-divider>
        <v-container
          v-if="fetching == false && loading == false"
          class="fill-height w-100 pa-5 d-flex justify-space-between"
        >
          <v-row
            align="center"
            justify="center"
            class="fill-height w-100 align-center justify-space-between"
          >
            <v-col cols="12" sm="12" class="pb-0"> <h3>General info</h3></v-col>
            <v-col>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">User name</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{ singleWithdrawal?.user?.firstname }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Email address</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{ singleWithdrawal?.user?.email }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Amount</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    ₦‎{{ singleWithdrawal?.amount?.toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Wallet balance</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    ₦‎{{
                      singleWithdrawal?.user?.wallet_balance.toLocaleString()
                    }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Date & time</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{
                      useDateFormat(
                        singleWithdrawal?.created_at,
                        "DD, MMMM-YYYY"
                      ).value
                    }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Status</h5>
                  <v-chip
                    label
                    class="text-capitalize font-weight-bold pa-3"
                    :color="status_color(singleWithdrawal?.status)"
                    >{{ singleWithdrawal?.status }}</v-chip
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
            class="fill-height w-100 align-center justify-space-between ml-4"
          >
            <v-col cols="12" sm="12" class="pb-0"> <h3>Payment info</h3></v-col>
            <v-col>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Bank name</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{ singleWithdrawal?.bank?.name ?? "No data" }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Account name</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{ singleWithdrawal?.account_name ?? "No data" }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="text-h6">Account number</h5>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    {{ singleWithdrawal?.account_number ?? "No data" }}
                  </p>
                </div>
              </div>
            </v-col>

            <v-col
              cols="12"
              sm="12"
              class="py-0 d-flex mt-12 align-start flex-column"
            >
              <h3>Action</h3>
              <div
                v-if="singleWithdrawal?.status == 'pending'"
                class="d-flex align-center mt-5"
              >
                <v-btn
                  @click="approveRequest(singleWithdrawal?.id)"
                  width="130px"
                  color="secondary"
                >
                  Approve request
                </v-btn>
                <v-btn
                  @click="declineRequest(singleWithdrawal?.id)"
                  width="130px"
                  class="ml-2"
                  color="error"
                >
                  Disprove request
                </v-btn>
              </div>
              <p v-else>This request has been attended to</p>
            </v-col>
          </v-row>
        </v-container>
        <v-layout
          v-if="fetching == true || loading == true"
          class="align-center justify-center w-100 my-10"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <!-- <v-btn color="secondary" class="my-2" block @click="dialog = false"
          >Close Dialog</v-btn
        > -->
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
table tbody tr td {
  padding: 15px !important;
}
</style>
