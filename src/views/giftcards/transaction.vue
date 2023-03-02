<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGiftCardStore } from "../../stores/giftcard";
import { storeToRefs } from "pinia";
import { useDateFormat } from '@vueuse/core'
const { getAllGiftCardTransaction, declineRequest, approveRequest } = useGiftCardStore();
const { gift_transactions, loading } = storeToRefs(useGiftCardStore());
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const header = ref([
  {
    title: "Account name",
  },
  {
    title: "Account number",
  },
  {
    title: "Reference No.",
  },

  {
    title: "Amount in NGN",
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

const page = ref({ title: "Gift Cards" });
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Transactions",
    disabled: true,
    href: "#",
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
const status_options = ref(["Pending", "Completed", "Declined"]);
onMounted(async () => {
  await getAllGiftCardTransaction();
});
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
       <v-card flat elevation="0" rounded="0" class="my-5 pa-4">
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
  <v-row>
  
    <v-col cols="12" sm="12" class="mt-4">
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
          <tbody v-if="gift_transactions?.length > 0 && loading == false">
            <tr v-for="item in gift_transactions" :key="item.id">
              <td class="font-weight-bold">{{ item.account_name }}</td>
              <td>{{ item.account_number }}</td>
              <td>{{ item.reference }}</td>
              <td>{{ item.payable_amount }}</td>
             

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
                          @click="approveRequest(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Approve giftcard
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="declineRequest(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Decline giftcard
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
          class="font-weight-bold text-center my-3"
          v-if="gift_transactions?.length <= 0 && loading == false"
        >
          No data found
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
    </v-col>
  </v-row>
</template>


<style scoped>
table tbody tr td {
  padding: 18px !important;
}
</style>