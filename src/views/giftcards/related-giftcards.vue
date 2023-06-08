<template>
  <div>
    <v-btn link size="small" color="grey-darken-4" :to="{ name: 'GiftCardTransaction' }">
      <v-icon size="small" start icon="mdi-arrow-left"></v-icon>
      Giftcard Transactions
    </v-btn>
    <h4 class="my-5">Related Giftcards:</h4>

    <v-table>
      <thead>
        <tr>
          <th
            v-for="(headings, index) in related_giftcard"
            :key="index"
            class="text-left"
          >
            {{ headings.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="relatedGiftCards?.length > 0 && loading == false">
        <tr>
          <td>{{ 1 }}</td>

          <td
            class="font-weight-bold username"
            @click="
              $router.push({
                name: 'UserDetails',
                params: { id: singleGiftCardTransaction?.user_id },
              })
            "
          >
            {{ singleGiftCardTransaction?.user?.firstname }}
            {{ singleGiftCardTransaction?.user?.lastname }}
          </td>

          <td>
            {{ singleGiftCardTransaction?.giftcard_product?.giftcard_category?.name }}
          </td>

          <td>{{ singleGiftCardTransaction?.reference }}</td>
          <td>{{ singleGiftCardTransaction?.trade_type }}</td>
          <td>
            {{
              formatCurrency(
                singleGiftCardTransaction.payable_amount *
                  (singleGiftCardTransaction.children_count &&
                  singleGiftCardTransaction.children_count !== 0
                    ? singleGiftCardTransaction.children_count + 1
                    : 1)
              )
            }}
          </td>

          <td>
            {{
              useDateFormat(singleGiftCardTransaction?.created_at, "DD-MM-YYYY hh:mm a")
                .value
            }}
          </td>

          <td>
            <v-chip
              label
              size="small"
              class="text-capitalize font-weight-bold pa-3"
              :color="status_color(singleGiftCardTransaction?.status)"
              >{{ formate_text(singleGiftCardTransaction?.status) }}</v-chip
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
                    :to="{
                      name: 'ViewGiftCardTransaction',
                      params: { id: singleGiftCardTransaction.id },
                    }"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> View giftcard </v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    v-if="singleGiftCardTransaction?.status == 'pending'"
                    @click="approveRequest(singleGiftCardTransaction?.id, page_no)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Approve giftcard </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="singleGiftCardTransaction?.status == 'pending'"
                    @click="
                      dialog = true;
                      id = singleGiftCardTransaction.id;
                    "
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Partial approval </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="singleGiftCardTransaction?.status == 'pending'"
                    @click="
                      id = singleGiftCardTransaction?.id;
                      disapprove();
                    "
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Decline giftcard </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </td>
        </tr>
        <tr class="pa-2" v-for="(item, index) in relatedGiftCards" :key="item.id">
          <td>{{ index + 2 }}</td>
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
          <td>{{ item?.giftcard_product?.giftcard_category?.name }}</td>
          <td>{{ item.reference }}</td>
          <td>{{ item.trade_type }}</td>
          <td>
            {{
              formatCurrency(
                item.payable_amount *
                  (item.children_count && item.children_count !== 0
                    ? item.children_count + 1
                    : 1)
              )
            }}
          </td>

          <td>
            {{ useDateFormat(item?.created_at, "DD-MM-YYYY hh:mm a").value }}
          </td>
          <!-- <td>{{ item.trade_type }}</td> -->
          <td>
            <v-chip
              label
              size="small"
              class="text-capitalize font-weight-bold pa-3"
              :color="status_color(item?.status)"
              >{{ formate_text(item?.status) }}</v-chip
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
                    :to="{
                      name: 'ViewGiftCardTransaction',
                      params: { id: item.id },
                    }"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> View giftcard </v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    v-if="item?.status == 'pending'"
                    @click="openConfirmationDialog('approve', item?.id)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Approve giftcard </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item?.status == 'pending'"
                    @click="(dialog = true), (confirmationID = item?.id)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Partial approval </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item?.status == 'pending'"
                    @click="(dialog2 = true), (confirmationID = item?.id)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title> Decline giftcard </v-list-item-title>
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
    <p
      v-if="relatedGiftCards?.length <= 0 || relatedGiftCards == null"
      class="text-center pa-5"
    >
      No related giftcard
    </p>

    <v-dialog v-if="dialog" v-model="dialog" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog = false"
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
            label="Review Amount"
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
            :loading="approving"
            @click="openConfirmationDialog('partial', confirmationID)"
            block
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <v-expand-transition>
      <v-dialog v-if="dialog2" v-model="dialog2" max-width="500px" width="100%">
        <v-card max-width="500px">
          <v-card-text>
            <h3>Decline Request</h3>
            <p>Enter Reasons for Declining this withdrawal request</p>
          </v-card-text>

          <v-container class="mt-7">
            <v-textarea label="Comments" v-model="note" variant="outlined"></v-textarea>

            <v-file-input
              @change="get_reproof"
              hint="Optional"
              persistent-hint
              label="Review proof"
              append-inner-icon="mdi-paperclip"
              prepend-icon=""
            ></v-file-input>

            <v-btn
              color="secondary"
              class="my-5"
              block
              :loading="declining"
              @click="openConfirmationDialog('decline', confirmationID)"
              >Submit</v-btn
            >
          </v-container>
        </v-card>
      </v-dialog>
    </v-expand-transition>
    <v-dialog v-model="confirmationDialog" width="500">
      <v-card>
        <v-toolbar dark dense flat>
          <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
            Confirm
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4 black--text"
          >Are you sure you want to
          {{
            confirmationStatus === "partial" ? "partially approve" : confirmationStatus
          }}
          this transaction?</v-card-text
        >
        <v-card-actions class="pt-3">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click.native="confirmationDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            class="body-2 font-weight-bold"
            outlined
            @click.native="makeConfirmation(confirmationStatus)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGiftCardStore } from "@/stores/giftcard";
import { useDateFormat } from "@vueuse/core";
import useFormatter from "@/composables/useFormatter";
export default defineComponent({
  setup() {
    const related_giftcard = ref([
      {
        title: "No.",
      },
      {
        title: "User name",
      },
      {
        title: "Category",
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

    const note = ref("");
    const id = ref("");
    const route: any = useRoute();

    const {
      loading,
      relatedGiftCards,
      dialog,
      dialog2,
      declining,
      singleGiftCardTransaction,
    } = storeToRefs(useGiftCardStore());

    const {
      getAllGiftCardTransactionByUserId,
      approveRequest,
      declineRequest,
      partialApproveRequest,
    } = useGiftCardStore();

    const formate_text = (text: string) => {
      if (text === "partially_approved") return "Partial";
      return text;
    };
    const page_no = ref(1);
    const reproof = ref("");
    const get_reproof = (e: any) => {
      reproof.value = e.target.files[0];
    };
    const partial_approve = reactive({
      review_rate: "",
      review_note: "",
      review_proof: null,
    });

    const partial = (e: any) => {
      partial_approve.review_proof = e.target.files[0];
    };

    const disapprove = () => {
      if (dialog.value == true) {
        dialog.value = false;
      }
      dialog2.value = true;
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

    // watch([dialog, dialog2, loading],() => {
    //     getAllGiftCardTransactionByUserId(route.params.id);
    // })

    onMounted(() => {
      getAllGiftCardTransactionByUserId(route.params.id);
    });

    // const formatCurrency = (value: any) => {
    //   return new Intl.NumberFormat().format(value);
    // };

    const { formatCurrency } = useFormatter();

    const refresh = async () => {
      await getAllGiftCardTransactionByUserId(route.params.id);
    };
    const confirmationDialog = ref(false);
    let confirmationID = ref("");
    const confirmationStatus = ref("");
    const openConfirmationDialog = (type: string, id?: any) => {
      confirmationDialog.value = true;
      confirmationID.value = id;
      confirmationStatus.value = type;
    };
    const makeConfirmation = async (type: string) => {
      if (type == "approve") {
        await approveRequest(confirmationID.value);
        refresh();
        confirmationDialog.value = false;
      } else if (type == "decline") {
        declineRequest(confirmationID.value, note.value, reproof.value as any);
        confirmationDialog.value = false;
      } else if (type == "partial") {
        partialApproveRequest(confirmationID.value, partial_approve);
        confirmationDialog.value = false;
      }
      confirmationDialog.value = false;
    };

    watch([dialog, dialog2], ([newDialog, oldDialog], [newDialog2, oldDialog2]) => {
      newDialog === false && oldDialog === false ? refresh() : "";
    });

    return {
      related_giftcard,
      relatedGiftCards,
      reproof,
      loading,
      useDateFormat,
      formate_text,
      status_color,
      dialog,
      dialog2,
      declining,
      approveRequest,
      declineRequest,
      partialApproveRequest,
      partial_approve,
      get_reproof,
      note,
      id,
      disapprove,
      singleGiftCardTransaction,
      page_no,
      partial,
      formatCurrency,
      makeConfirmation,
      openConfirmationDialog,
      confirmationID,
      confirmationDialog,
      confirmationStatus,
    };
  },
});
</script>

<style scoped></style>
