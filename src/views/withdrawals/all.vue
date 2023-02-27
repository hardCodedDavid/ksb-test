<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useWithdrawalsStore } from "../../stores/withdrawals";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const {
  getAllWithDrawals,
  approveRequest,
  declineRequest,
  getSingleWithDrawals,
} = useWithdrawalsStore();
const { withdrawals, loading, singleWithdrawal } = storeToRefs(
  useWithdrawalsStore()
);

onMounted(async () => {
  await getAllWithDrawals();
});

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
    title: "Username",
  },
  {
    title: "Amount (NGN)",
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

const page = ref(21);
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
              <td class="text-capitalize font-weight-bold">
                {{ withdrawal?.user?.firstname }}
                {{ withdrawal?.user?.lastname }}
              </td>
              <td>₦‎ {{ withdrawal?.amount }}</td>
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
      </v-card>
      <v-pagination
        v-model="page"
        :length="4"
        active-color="grey-darken-4"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>

    <v-dialog v-if="dialog" v-model="dialog" max-width="500px">
      <v-card class="pa-5">
        <h3 class="text-center">Withdrawal Request</h3>

        <v-container class="fill-height w-100">
          <v-row
            v-if="fetching == false"
            class="my-5 fill-height w-100 align-center justify-space-between"
          >
            <v-col cols="12" sm="6">
              <h4>Status</h4>

              <v-chip
                :label="true"
                class="text-capitalize font-weight-bold"
                :color="status_color(singleWithdrawal?.status)"
                >{{ singleWithdrawal?.status }}</v-chip
              >
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Wallet Balance</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                ₦ {{ singleWithdrawal.user?.wallet_balance }}
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Email Address</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user?.email }}
              </p>
            </v-col>

            <v-col cols="12" sm="6">
              <h4>First name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal?.user?.firstname }}
              </p>
            </v-col>

            <v-col cols="12" sm="6">
              <h4>Last name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.user?.lastname }}
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Account name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.account_name }}
              </p>
            </v-col>

            <v-col cols="12" sm="6">
              <h4>Account number</h4>
              <p>{{ singleWithdrawal.user_bank_account?.account_number }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Bank name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.bank.name }}
              </p>
            </v-col>
          </v-row>
        </v-container>
        <v-layout
          v-if="fetching == true"
          class="align-center justify-center w-100 my-10"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <v-btn color="secondary" class="my-2" block @click="dialog = false"
          >Close Dialog</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
