<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
// import { useGiftCardStore } from "@/stores/giftcard";
import VueEasyLightbox from "vue-easy-lightbox";
import { useAssetStore } from "../../stores/asset";
import { useDateFormat } from "@vueuse/core";

const {
  getSingleAssetTransactions,
  approveAssetTransactions,
  declineAssetTransactions,
  partialApproveRequest,
} = useAssetStore();

const { dialog, loading, single_transactions, dialog2 } = storeToRefs(
  useAssetStore()
);

const transaction_header = ref([
  {
    title: "Asset",
  },
  {
    title: "Network",
  },
  {
    title: "Type",
  },
  {
    title: "Rate",
  },
  {
    title: "Asset value",
  },
  {
    title: "Amount",
  },
]);

const route: any = useRoute();
const router: any = useRouter();

// const dialog2 = ref(false)

const view_user_details = (id: string) => {
  router.push({ name: "UserDetails", params: { id: id } });
};

const note = ref("");
const id = ref("");

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
type TradeType = "sell" | "buy";

const trade_color = (status: TradeType) => {
  return status === "buy"
    ? "green lighten-3"
    : status === "sell"
    ? "red lighten-3"
    : "";
};
//
const reproof = ref("");
const get_reproof = (e: any) => {
  reproof.value = e.target.files[0];
};

const view_img = (url: string) => {
  window.open(url);
};
const partial_approve = reactive({
  review_rate: "",
  review_note: "",
  review_proof: null,
});

const partial = (e: any) => {
  partial_approve.review_proof = e.target.files[0];
};

onMounted(async () => {
  await getSingleAssetTransactions(route.params.id);
});

const visibleRef = ref(false);
const onShow = () => {
  visibleRef.value = true;
};
const indexRef = ref(0);
const onHide = () => (visibleRef.value = false);

const  image = computed(() => {
  return Array(single_transactions?.value?.proof)
})
</script>

<template>
  <v-row>
    <v-btn 
        class="ml-4" 
        link
        size="large"
        variant="plain"
        color="grey-darken-4"
        :to="{name:'AssetsTransaction'}"
    >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Asset Transactions
    </v-btn>
    
    <v-col cols="12" sm="12" lg="12">
      <v-card rounded="0" class="pa-4">

        <v-toolbar color="transparent">
          <v-toolbar-title class="font-weight-medium">
            View Asset transaction
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
               <v-table class="ksb-border my-10">
        <thead>
        <tr class="pa-2">
          <th
            :key="index"
            v-for="(headerTitle, index) in transaction_header"
            class="text-left"
          >
            {{ headerTitle.title }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
        <td>{{single_transactions?.asset?.code}}</td>
        <td>{{single_transactions?.network?.name}}</td>
        <td>{{single_transactions?.trade_type}}</td>
        <td>{{single_transactions?.rate}}</td>
        <td>{{single_transactions?.asset_amount}}</td>
        <td>{{single_transactions?.payable_amount}}</td>
        </tr>
      </tbody>
      </v-table>
        <v-row class="px-4">
       
            <v-col cols="12" sm="12" lg="6">
            <v-card :loading="loading" class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <!-- <v-img
                cover
                v-if="single_transactions?.proof"
                height="250"
                :src="single_transactions?.proof "
              ></v-img> -->

              <v-card-item class="pa-0 mb-5">
                <v-card-title class="pa-4">Asset Transaction Information</v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle class="ml-6 my-2">
                  <span class="mr-1">Reference:</span>

                  <span>{{ single_transactions.reference }}</span>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0 mb-3">
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3 mr-4"
                    :color="status_color(single_transactions?.status)"
                    >{{ single_transactions?.status }}</v-chip
                  >
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3"
                    :color="trade_color(single_transactions?.trade_type)"
                    >{{ single_transactions?.trade_type }}</v-chip
                  >
                </v-row>

                <div class="mb-5">
                  <strong>Buy rate:</strong>
                  {{ single_transactions?.asset?.buy_rate }}
                </div>

                <div class="mb-4">
                 <strong>Comment:</strong>
                  {{ single_transactions?.comment }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Payable Amount:</strong>
                  &#x20A6{{ single_transactions.payable_amount?.toLocaleString() }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Review rate:</strong>
                  &#x20A6{{ single_transactions.review_rate?.toLocaleString() }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Service Charge:</strong>
                  &#x20A6{{ single_transactions.service_charge }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Rate:</strong>
                  &#x20A6{{ single_transactions.rate }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Date Created:</strong>
                    {{ useDateFormat(
                        single_transactions?.created_at,
                        "DD, MMMM-YYYY hh:mm a"
                      ).value }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last Updated:</strong>
                  {{ useDateFormat(
                        single_transactions?.updated_at,
                        "DD, MMMM-YYYY hh:mm a"
                      ).value }}
                </div>
               
              </v-card-text>

              <v-divider v-if="single_transactions.status == 'transferred'" class="mx-4 mb-1"></v-divider>

              <v-card-actions v-if="single_transactions.status == 'transferred'">
                    <v-btn
                    class="mr-4"
                  color="green lighten-3"
                  :loading="approving"
                  variant="tonal"
                  @click="approveAssetTransactions(single_transactions?.id)"
                >
                  Approve
                </v-btn>

                <v-btn
                  color="red lighten-3"
                  variant="tonal"
                  @click="id = single_transactions?.id; dialog = true"
                >
                  Decline
                </v-btn>
                <v-btn
                  color="purple lighten-3"
                  variant="tonal"
                  @click="id = single_transactions?.id; dialog2 = true"
                >
                  Partial approve
                </v-btn>
              </v-card-actions>
            </v-card>

             <v-card>
              <v-card-title>Receipt Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Review Note: </strong>
                  {{ single_transactions?.review_note ?? 'No data'}}
                </div>
               <div class="font-weight-normal mb-5">
                  <strong>Review By:</strong>
                  <p class="my-1">Email: <span class="font-weight-bold">{{ single_transactions?.reviewer?.email ?? 'No data'}}</span></p>
                  <p>Full name: <span class="font-weight-bold">{{ single_transactions?.reviewer?.firstname }}  {{ single_transactions?.reviewer?.lastname}}</span></p>
                </div>
                <div class="font-weight-normal">
                  <strong>Review At: </strong>
                  <span v-if="single_transactions.reviewed_at">
                    {{  useDateFormat(
                        single_transactions?.reviewed_at,
                        "DD, MMMM-YYYY hh:mm a"
                      ).value ?? 'No data' }}
                  </span>
                </div>
          </v-card-text>

              <v-btn v-if="single_transactions?.review_proof" @click="view_img(single_transactions?.review_proof)" color="secondary" class="ml-6 mb-3">Review proof image</v-btn>
            </v-card>
            </v-col>

            <v-col cols="12" sm="12" lg="6">
                <v-card :loading="loading" class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-item>
                <v-card-title>User Information</v-card-title>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>First name:</strong>
                  {{ single_transactions.user?.firstname }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last name:</strong>
                  {{ single_transactions.user?.lastname}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Email:</strong>
                 <span @click="view_user_details(single_transactions.user?.id)" class="text-underline ml-3"> {{ single_transactions.user?.email}}</span>
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Phone number:</strong>
                  {{ single_transactions.user?.phone_number}}
                </div>


              </v-card-text>

              <!-- <v-divider class="mx-4 mb-1"></v-divider> -->

              
            </v-card>
            
            <v-card>
              <v-card-title>Bank Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Bank name:</strong>
                  {{ single_transactions.bank?.name ?? ' No bank'}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account name:</strong>
                  {{ single_transactions?.account_name ?? ' No account name'}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account number:</strong>
                  {{ single_transactions?.account_number ?? ' No account number'}}
                </div>
              </v-card-text>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Other Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
               
               
           
              
                <div class="font-weight-normal mb-4">
                  <strong>Network name: </strong>
                  {{ single_transactions.network?.name }}
                </div>
              
              <strong class="mb-4">Proof Image:</strong>
               <v-img
               v-if="single_transactions?.proof"
                      cover
                      width="100"
                      height="100"
                      @click="onShow"
                     :src="single_transactions?.proof "
                      class="cursor-pointer mt-4"
                      ></v-img>
                
              </v-card-text>

              <!-- <v-btn v-if="single_transactions?.proof" @click="view_img(single_transactions?.proof)" color="secondary" class="ml-4 my-4">View Proof image</v-btn> -->
            </v-card>
            </v-col>
            
            
        </v-row>
      </v-card>
    </v-col>
                  <vue-easy-lightbox
                      :visible="visibleRef"
                      :imgs="image"
                      :index="indexRef"
                      @hide="onHide"
                    ></vue-easy-lightbox>

      <v-dialog
        v-if="dialog"
        v-model="dialog"
        max-width="500px"
        width="100%"
      >
        <v-card max-width="500px">
          <v-card-text>
            <h3>Decline Transaction</h3>
            <p>Enter Reasons for Declining 
             this asset transaction</p>
          </v-card-text>

          <v-container class="mt-7">
            <v-textarea
              label="Comments"
              v-model="note"
              variant="outlined"
            ></v-textarea>

              <v-file-input @change="get_reproof" hint="Optional" persistent-hint label="Review proof" append-inner-icon="mdi-paperclip"
                    prepend-icon=""></v-file-input>

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
.text-underline {
  text-decoration: underline !important;
  cursor: cursor-pointer;
}

.ksb-border {
  border: 1px solid #cecccc;
  border-radius: none;
}
</style>
