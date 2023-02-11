<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useWithdrawalsStore } from "../../stores/withdrawals";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const {
  getAllWithDrawals,
  approveRequest,
  declineRequest,
  getSingleWithDrawals,
} = useWithdrawalsStore();
const { withdrawals, loading, singleWithdrawal } = storeToRefs(useWithdrawalsStore());

onMounted(async () => {
  await getAllWithDrawals();
});

const page = ref({ title: "Withdrawals" });
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
  // {
  //   title: "Username",
  // },
  // {
  //   title: "Reference No.",
  // },
  {
    title: "Amount (NGN)",
  },
  // {
  //   title: "Service",
  // },
  // {
  //   title: "Type",
  // },
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
type StatusType = "pending" | "approved" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow lighten-3"
    : status == "approved"
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
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Height -->
  <!-- ----------------------------------------------------------------------------- -->
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div class="mt-4">
      <v-card class="pa-5">
        <v-table>
          <thead>
            <tr>
              <th v-for="(headings, index) in header" :key="index" class="text-left">
                {{ headings.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="loading == false">
            <tr v-for="withdrawal in withdrawals" :key="withdrawal.id">
              <td>₦‎ {{ withdrawal.amount }}</td>
              <td>{{ withdrawal.created_at }}</td>
              <!-- <td>{{ item.status }}</td> -->

              <!-- <td>{{ item.service }}</td>
              <td>{{ item.type }}</td>

              <td>{{ item.date }}</td> -->
              <td>
                <v-chip
                  class="text-capitalize"
                  :color="status_color(withdrawal.status)"
                  >{{ withdrawal.status }}</v-chip
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
                        @click="viewWithDrawalRequest(withdrawal.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Details </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="withdrawal.status == 'pending'"
                        @click="approveRequest(withdrawal.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Approve Withdrawal Request
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="withdrawal.status == 'pending'"
                        @click="declineRequest(withdrawal.id)"
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

        <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
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
                class="text-capitalize"
                :color="status_color(singleWithdrawal.status)"
                >{{ singleWithdrawal.status }}</v-chip
              >
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Wallet Balance</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                ₦ {{ singleWithdrawal.user_bank_account?.user.wallet_balance }}
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>Email Address</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.user.email }}
              </p>
            </v-col>

            <v-col class="align-self-center w-100" cols="12" sm="6">
              <h4>User name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.user.username }}
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>First name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.user.firstname }}
              </p>
            </v-col>

            <v-col cols="12" sm="6">
              <h4>Last name</h4>
              <p class="grey-lighten-2 text-subtitle-1">
                {{ singleWithdrawal.user_bank_account?.user.lastname }}
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
        <v-layout v-if="fetching == true" class="align-center justify-center w-100 my-10">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <v-btn color="secondary" class="my-2" block @click="dialog = false"
          >Close Dialog</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>
