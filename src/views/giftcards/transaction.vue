<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGiftCardStore } from "../../stores/giftcard";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
const {
  getAllGiftCardTransaction,
  declineRequest,
  approveRequest,
  getAllGiftCardTransactionByUserId,
} = useGiftCardStore();
const { gift_transactions, loading, singleGiftCardTransaction, declining, approving , dialog} = storeToRefs(useGiftCardStore());
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const header = ref([
  {
    title: "No.",
  },
  {
    title: "User name",
  },
  {
    title: "Reference No.",
  },
  {
    title: "Trade Type.",
  },

  {
    title: "Amount",
  },
  {
    title: "Date",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

const page = ref({ title: "Gift Cards Transactions" });
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

const status_options = ref(["Pending", "Completed", "Declined"]);
const status = ref("");
const trade = ref("");
const trade_type = ref(["Buy", "Sell"]);
const page_no = ref(1);
const date_from = ref("");
const date_to = ref("");
// const dialog = ref(false);

onMounted(async () => {
  await getAllGiftCardTransaction(
    status.value,
    trade.value,
    page_no.value,
    date_from.value,
    date_to.value
  );
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
      <v-col cols="12" sm="6" md="3">
        <v-select
          label="Filter by Status"
          v-model="status"
          :items="status_options"
          density="compact"
          @update:modelValue="
            (...args) =>
              getAllGiftCardTransaction(
                ...args,
                trade,
                page_no,
                date_from,
                date_to
              )
          "
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="trade"
          label="Filter by trade type"
          density="compact"
          :items="trade_type"
          @update:modelValue="
            (...args) =>
              getAllGiftCardTransaction(
                status,
                ...args,
                page_no,
                date_from,
                date_to
              )
          "
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          @update:modelValue="
            (...args) =>
              getAllGiftCardTransaction(
                status,
                trade,
                page_no,
                ...args,
                date_to
              )
          "
          v-model="date_from"
          label="Filter date from"
          density="compact"
          type="date"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          @update:modelValue="
            (...args) =>
              getAllGiftCardTransaction(
                status,
                trade,
                page_no,
                date_from,
                ...args
              )
          "
          v-model="date_to"
          type="date"
          label="Filter date to"
          density="compact"
          variant="outlined"
        ></v-text-field>
      </v-col>
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
            <tr v-for="(item, index) in gift_transactions" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td
                class="font-weight-bold username"
                @click="
                  $router.push({
                    name: 'UserDetails',
                    params: { id: item?.user_id },
                  })
                "
              >
                {{ item.user.firstname }} {{ item.user.lastname }}
              </td>
              <!-- <td>{{ item.account_number }}</td> -->
              <td>{{ item.reference }}</td>
              <td>{{ item.trade_type }}</td>
              <td>{{ item.payable_amount.toLocaleString() }}</td>

              <td>
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
              </td>
              <!-- <td>{{ item.trade_type }}</td> -->
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
                        @click="dialog = true; getAllGiftCardTransactionByUserId(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View giftcard </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'pending'"
                        @click="approveRequest(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Approve giftcard
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'pending'"
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
        v-model="page_no"
        :length="4"
        @next="
          getAllGiftCardTransaction(status, trade, page_no, date_from, date_to)
        "
        @prev="
          getAllGiftCardTransaction(status, trade, page_no, date_from, date_to)
        "
        @update:modelValue="
          getAllGiftCardTransaction(status, trade, page_no, date_from, date_to)
        "
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-dialog v-model="dialog" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Transactions details</h3>
          <v-btn @click="dialog = false" icon="mdi-close" color="secondary" variant="text">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>
        <div class="my-3">
          <!-- <v-icon></v-icon> -->
          <div>
            <v-chip
              label
              size="small"
              density="comfortable"
              class="text-capitalize font-weight-bold pa-3"
              :color="status_color(singleGiftCardTransaction?.status)"
              >{{ singleGiftCardTransaction?.status }}</v-chip
            >
          </div>
        </div>
        <div
          v-if="loading == false"
          class="w-100 d-flex align-center justify-space-between"
        >
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="w-100 align-center justify-space-between"
          >
            <v-col class="pa-0">
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5>Payable amount</h5>
                  <p class="font-weight-bold">
                    ₦‎{{
                      singleGiftCardTransaction.payable_amount.toLocaleString()
                    }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">User name</h5>
                  <p class="">
                    {{ singleGiftCardTransaction?.user?.firstname }} {{ singleGiftCardTransaction?.user?.lastname }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Email address</h5>
                  <p class="">
                    {{ singleGiftCardTransaction?.user?.email }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Date & time</h5>
                  <p class="">
                    {{
                      useDateFormat(
                        singleGiftCardTransaction?.created_at,
                        "DD, MMMM-YYYY"
                      ).value
                    }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Reference</h5>
                  <p class="">
                    {{
                      singleGiftCardTransaction.reference
                    }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="w-100 align-center justify-space-between ml-5"
          >
            <v-col class="pa-0">
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5>Amount</h5>
                  <p class="font-weight-bold">
                    ₦‎{{ singleGiftCardTransaction?.amount?.toLocaleString() }}
                  </p>
                </div>
              </div>
              <!-- <div class="mb-4">
                
                <div>
                  <h5 class="">Bank name</h5>
                  <p class="">
                    {{ singleWithdrawal?.bank?.name ?? "No data" }}
                  </p>
                </div>
              </div> -->

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Account name</h5>
                  <p class="">
                    {{ singleGiftCardTransaction?.account_name ?? "No data" }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Account number</h5>
                  <p class="">
                    {{ singleGiftCardTransaction?.account_number ?? "No data" }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Trade type</h5>
                  <p class="">
                    {{ singleGiftCardTransaction?.trade_type ?? "No data" }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-layout
          v-if=" loading == true"
          class="align-center justify-center w-100 my-10"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <!-- <v-btn color="secondary" class="my-2" block @click="dialog = false"
          >Close Dialog</v-btn
        > -->

        <div v-if="singleGiftCardTransaction.status == 'pending' && loading == false">
          <v-btn
            @click="declineRequest(singleGiftCardTransaction?.id)"
            class="wallet-btn"
            variant="outlined"
            color="error"
            :loading="declining"
          >
            Disapprove giftcard
          </v-btn>
          <v-btn
            @click="approveRequest(singleGiftCardTransaction?.id)"
            class="wallet-btn ml-4"
            color="secondary"
            :loading="approving"
          >
            Approve giftcard
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped lang="scss">
table tbody tr td {
  padding: 15px !important;
}

.username {
  text-decoration: underline;
  cursor: pointer;
}

.view-dialog {
  background: #ffffff;
  border-radius: 16px !important;

  h3 {
    font-weight: 600;
    font-size: 24px;
    width: 50%;
    line-height: 24px;
  }

  h5 {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    color: #afafaf;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 16px !important;
    line-height: 24px;
  }

  .wallet-btn {
    padding: 22px;
    border-radius: 8px;
    width: 188px;
    height: 64px;
  }
}
</style>
