<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGiftCardStore } from "@/stores/giftcard";
import { useDateFormat } from "@vueuse/core";
const { 
    declineRequest,
    approveRequest,
    getAllGiftCardTransactionByUserId ,
} = useGiftCardStore();
const { loading, approving, declining, singleGiftCardTransaction, dialog} = storeToRefs(useGiftCardStore());

const route = useRoute();

// const dialog2 = ref(false)

const note = ref("");
const id = ref("")

const disapprove = (selected:any) => {
  dialog.value = true;
  id.value = selected;
};

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

const trade_color = (status: StatusType) => {
  return status === "buy"
    ? "green lighten-3"
    : status === "sell"
    ? "red lighten-3"
    : "";
};
//
const reproof = ref('')
const get_reproof = (e:any) => {
  reproof.value = e.target.files[0]
}

const image = computed(() => {
  if(singleGiftCardTransaction.value.cards.length <= 0){
    return "https://cdn.vuetifyjs.com/images/cards/cooking.png"
  }
  else{
    return singleGiftCardTransaction.value?.cards[0].original_url
  }
})

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

              <v-img
                v-if="singleGiftCardTransaction?.cards"
                cover
                height="250"
                :src="image"
              ></v-img>

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

                <div class="mb-4">
                  {{ singleGiftCardTransaction?.comment }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Payable Amount:</strong>
                  &#x20A6{{ singleGiftCardTransaction.payable_amount?.toLocaleString() }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Card Amount:</strong>
                  &#x20A6{{ singleGiftCardTransaction.amount?.toLocaleString() }}
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
                        "DD, MMMM-YYYY"
                      ).value }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last Updated:</strong>
                  {{ useDateFormat(
                        singleGiftCardTransaction?.updated_at,
                        "DD, MMMM-YYYY"
                      ).value }}
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
              </v-card-actions>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Other Information</v-card-title>
                 <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Review Note:</strong>
                  {{ singleGiftCardTransaction?.review_note}}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review By:</strong>
                  {{ singleGiftCardTransaction?.reviewed_by}}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review At:</strong>
                  <span v-if="singleGiftCardTransaction.reviewed_at">
                    {{ useDateFormat(
                        singleGiftCardTransaction?.reviewed_at,
                        "DD, MMMM-YYYY"
                      ).value }}
                  </span>
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review Proof:</strong>
                  <span v-if="singleGiftCardTransaction.reviewed_at">
                    {{ singleGiftCardTransaction.review_proof }}
                  </span>
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
                <div class="font-weight-normal mb-4">
                  <strong>Code:</strong>
                  {{ singleGiftCardTransaction.code ? singleGiftCardTransaction.code : ""}}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Pin:</strong>
                  {{ singleGiftCardTransaction.code ? singleGiftCardTransaction.pin : ""}}
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
  </v-row>
</template>
