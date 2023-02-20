<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGiftCardStore } from "../../stores/giftcard";
import { storeToRefs } from "pinia";

const { getAllGiftCardTransaction } = useGiftCardStore();
const { gift_transactions } = storeToRefs(useGiftCardStore());
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const header = ref([
  {
    title: "Username",
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
    ? "yellow lighten-3"
    : status == "completed"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//

onMounted(async () => {
  await getAllGiftCardTransaction();
});
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
          <tbody v-if="gift_transactions?.length > 0">
            <tr v-for="item in gift_transactions" :key="item.id">
              <td>{{ item.user.firstname }} {{ item.user.lastname }}</td>
              <td>{{ item.reference }}</td>
              <td>{{ item.amount }}</td>
              <td>{{ item.trade_type }}</td>

              <td>
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
              </td>
              <td>
                <v-chip
                  label
                  class="text-capitalize font-weight-bold pa-3"
                  :color="status_color(item?.status)"
                  >{{ item?.status }}</v-chip
                >
              </td>
              <td>
                <v-icon icon="mdi-dots-vertical"></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>

        <p
          class="font-weight-bold text-center my-3"
          v-if="gift_transactions?.length <= 0"
        >
          No data found
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>
