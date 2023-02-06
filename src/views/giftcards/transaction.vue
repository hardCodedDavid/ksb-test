<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const header = ref([
  {
    title: "Username",
  },
  {
    title: "Reference No.",
  },
  {
    title: "Category",
  },
  {
    title: "Amount in currency",
  },
  {
    title: "Amount in NGN",
  },
  {
    title: "Date",
  },
  {
    title: "Type",
  },
  {
    title: "Status",
  },
]);

const items = ref([
  {
    name: "James",
    refNo: 159,
    amount: "1000",
    status: "Pending",
    service: "Wallet",
    type: "Buy/sell",
    date: "28/05/2023",
  },
  {
    name: "Ice cream sandwich",
    refNo: 237,
    amount: "1000",
    status: "Approved",
    service: "Wallet",
    type: "Transfer",
    date: "28/05/2023",
  },
  {
    name: "Ice cream sandwich",
    refNo: 237,
    amount: "1000",
    status: "Decline",
    service: "Wallet",
    type: "Deposit/Withdrawal",
    date: "28/05/2023",
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
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
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
          <tbody>
           <tr v-for="item in items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.refNo }}</td>
              <td>{{ item.amount }}</td>

              <td>{{ item.service }}</td>
              <td>{{ item.type }}</td>

              <td>{{ item.date }}</td>
              <td><v-chip color="red lighten-3">{{ item.status }}</v-chip></td>
              <td>
                <v-icon icon="mdi-dots-vertical"></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>
</template>
