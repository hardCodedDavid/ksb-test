<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGiftCardStore } from "@/stores/giftcard";
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'
import { useDateFormat } from "@vueuse/core";

const {
  declineRequest,
  approveRequest,
  getAllGiftCardTransactionByUserId,
  partialApproveRequest,
} = useGiftCardStore();

const { loading, approving, declining, singleGiftCardTransaction, dialog, dialog2 } =
  storeToRefs(useGiftCardStore());

const route: any = useRoute();

// const dialog2 = ref(false)

const note = ref("");
const id = ref("");

const img = ref<string[]>([]);

const partial_approve = reactive({
  review_rate: "",
  review_note: "",
  review_proof: null,
});
// const partial_reproof = ref('')
const partial = (e: any) => {
  partial_approve.review_proof = e.target.files[0];
};

// const dialog2 = ref(false);

const disapprove = (selected: any) => {
  dialog.value = true;
  id.value = selected;
};

const view_img = (url: string) => {
  window.open(url);
};
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

const image = computed(() => {

    img.value = singleGiftCardTransaction.value?.cards.map((images:any) => {
        return images['original_url']
    });
    return img.value

});

const transaction_header = ref([
  {
    title: "No.",
  },
  {
    title: "Category",
  },
  {
    title: "Product",
  },
  {
    title: "Type",
  },
  {
    title: "Country",
  },
  {
    title: "Value",
  },
  {
    title: "Rate",
  },
  {
    title: "Total",
  },
]);
const visibleRef = ref(false);
const onShow = () => {
  visibleRef.value = true;
};
const indexRef = ref(0);
const onHide = () => (visibleRef.value = false);

onMounted(() => {
  getAllGiftCardTransactionByUserId(route.params.id);
});
</script>

<template>
  <v-row>
    <v-btn 
        class="ml-4" 
        link
        size="large"
        variant="plain"
        color="grey-darken-4"
        :to="{name:'GiftCardTransaction'}"
    >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        GiftCard Transactions
    </v-btn>
    <v-col cols="12" sm="12" lg="12">
    
      <v-card>
        <v-toolbar color="transparent">
          <v-toolbar-title class="font-weight-medium">
            View transaction
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card class="pa-6" rounded="0" elevation="0">
      <v-table class="ksb-border">
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
        <tr >
        <td>1</td>
        <td>{{singleGiftCardTransaction?.giftcard_product?.giftcard_category?.name}}</td>
        <td>{{singleGiftCardTransaction?.giftcard_product?.name}}</td>
        <td>{{singleGiftCardTransaction?.trade_type}}</td>
        <td>{{singleGiftCardTransaction?.giftcard_product?.country?.name}}</td>
        <td>{{singleGiftCardTransaction?.giftcard_product?.sell_rate}}</td>
        <td>1</td>
        </tr>
      </tbody>
      </v-table>
    </v-card>
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

             

              <v-card-item class="pa-0 mb-5">
                <v-card-title class="pa-4">GiftCard Information</v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle class="ml-6 my-2">
                  <span class="mr-1">Reference:</span>

                  <span>{{ singleGiftCardTransaction.reference }}</span>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0 mb-3">
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3 mr-4"
                    :color="status_color(singleGiftCardTransaction?.status)"
                    >{{ singleGiftCardTransaction?.status }}</v-chip
                  >

                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3"
                    :color="trade_color(singleGiftCardTransaction?.trade_type)"
                    >{{ singleGiftCardTransaction?.trade_type }}</v-chip
                  >
                </v-row>

                <div class="mb-5">
                  <strong>Card type:</strong>
                  {{ singleGiftCardTransaction?.card_type }}
                </div>

                

                <div class="font-weight-normal mb-4">
                  <strong>Payable Amount:</strong>
                  &#x20A6{{ singleGiftCardTransaction.payable_amount }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Card Amount:</strong>
                  &#x20A6{{ singleGiftCardTransaction.amount }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Service Charge:</strong>
                  &#x20A6{{ singleGiftCardTransaction.service_charge }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Rate:</strong>
                  &#x20A6{{ singleGiftCardTransaction.rate }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Date Created:</strong>
                    {{ useDateFormat(
                        singleGiftCardTransaction?.created_at,
                        "DD, MMM YYYY - hh:mm a"
                      ).value }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last Updated:</strong>
                  {{ useDateFormat(
                        singleGiftCardTransaction?.updated_at,
                        "DD, MMM YYYY - hh:mm a"
                      ).value }}
                </div>
                <div class="mb-4">
                 <strong>Comments:</strong> {{ singleGiftCardTransaction?.comment }}
                </div>
              </v-card-text>

              <v-divider v-if="singleGiftCardTransaction.status == 'pending'" class="mx-4 mb-1"></v-divider>

              <v-card-actions v-if="singleGiftCardTransaction.status == 'pending'">
                    <v-btn
                    class="mr-4"
                  color="green lighten-3"
                  :loading="approving"
                  variant="tonal"
                  @click="approveRequest(singleGiftCardTransaction?.id)"
                >
                  Approve
                </v-btn>

                <v-btn
                  color="red lighten-3"
                  variant="tonal"
                  @click="disapprove(singleGiftCardTransaction?.id)"
                >
                  Decline
                </v-btn>
                <v-btn
                  color="purple lighten-3"
                  variant="tonal"
                  @click="dialog2 = true"
                >
                  Partial approval
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Other Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Review Note:</strong>
                  {{ singleGiftCardTransaction?.review_note ?? 'No data'}}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review By:</strong>
                  {{ singleGiftCardTransaction?.reviewed_by ?? 'No data'}}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review Rate:</strong>
                  {{ singleGiftCardTransaction.review_rate ?? 'No data'}}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review At:</strong>
                  <span v-if="singleGiftCardTransaction.reviewed_at">
                    {{ useDateFormat(
                        singleGiftCardTransaction?.reviewed_at,
                        "DD, MMMM-YYYY"
                      ).value }}
                  </span>
                  <span v-else> No Data</span>
                </div>
                <div v-if="singleGiftCardTransaction.reviewed_at" class="font-weight-normal mb-4">
                  <strong>Review Proof:</strong>
                   <v-btn  @click="view_img(singleGiftCardTransaction.review_proof)" color="secondary" class="ml-4 my-4">View Proof image</v-btn>
                 
                </div>
              </v-card-text>
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
                  {{ singleGiftCardTransaction.user?.firstname }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last name:</strong>
                  {{ singleGiftCardTransaction.user?.lastname}}
                </div>

                
                  <div v-if="singleGiftCardTransaction.user_id" class="font-weight-normal mb-4">
                    <strong class="mr-1">Email:</strong>
                    <router-link :to="{name:'UserDetails', params: {id : singleGiftCardTransaction.user_id} }">
                      {{ singleGiftCardTransaction.user?.email}}
                    </router-link>
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
                  {{ singleGiftCardTransaction.bank?.name}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account name:</strong>
                  {{ singleGiftCardTransaction?.account_name}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account number:</strong>
                  {{ singleGiftCardTransaction?.account_number}}
                </div>
              </v-card-text>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Card Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
                <div  v-if="singleGiftCardTransaction?.cards" class="font-weight-normal mb-4">
                  <strong v-if="img?.length > 0" class="mb-5">Card Image(s):</strong>
                  
                  <v-row v-if="singleGiftCardTransaction?.cards?.length > 0">
                    <v-col 
                    v-for="(images, index) in singleGiftCardTransaction.cards"
                    :key="index" cols="12" sm="6" md="4" lg="3">
                    <v-img
                      cover
                      width="180"
                      height="100"
                      @click="onShow"
                      :src="images.original_url"
                      class="cursor-pointer mt-4"
                      ></v-img>
                    </v-col>
                  </v-row>

                  <p v-else class="text-center font-weight-bold">No card info</p>
                </div>
                <div v-if="singleGiftCardTransaction.code" class="font-weight-normal mb-4">
                  <strong>Code:</strong>
                  {{ singleGiftCardTransaction.code ?? "No Code"}}
                </div>

                <div v-if="singleGiftCardTransaction.pin" class="font-weight-normal mb-4">
                  <strong>Pin:</strong>
                  {{ singleGiftCardTransaction.pin ?? "No Pin"}}
                </div>
              </v-card-text>
            </v-card>
            </v-col>
            
        </v-row>
      </v-card>
    </v-col>

      <v-dialog
        v-if="dialog"
        v-model="dialog"
        max-width="500px"
        width="100%"
      >
        <v-card max-width="500px">
          <v-card-text>
            <h3>Decline Request</h3>
            <p>Enter Reasons for Declining 
             this withdrawal request</p>
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
              @click="declineRequest(id, note, reproof)"
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
            label="New Rate"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Note"
          ></v-textarea>
          <v-file-input
            prepend-icon=""
            variant="outlined"
            @change="partial"
            label="Proof"
          ></v-file-input>
          <v-btn
            :loading="approving"
            @click="partialApproveRequest($route.params.id, partial_approve)"
            block
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

                    <vue-easy-lightbox
                      :visible="visibleRef"
                      :imgs="img"
                      :index="indexRef"
                      @hide="onHide"
                    ></vue-easy-lightbox>
  </v-row>
</template>

<style lang='scss'>
.ksb-border {
  border: 1px solid #cecccc;
}
.cursor-pointer {
  cursor: pointer;
}

.vel-modal {
  z-index: 9999999999999999 !important;
}
</style>
