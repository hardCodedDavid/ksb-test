<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useCountryStore } from "../../stores/country";
import { useGiftProductStore } from "../../stores/products";
import { useDateFormat } from "@vueuse/core";
const { countries, giftCardCategories, currencies } = storeToRefs(
  useCountryStore()
);
const { giftCard, loading, dialog, gift_products } = storeToRefs(
  useGiftProductStore()
);
const {
  createGiftCardProduct,
  getAllGifCardProduct,
  deleteGifCardProducts,
  activationGifCardProduct,
  editGiftCardProduct,
} = useGiftProductStore();
const page = ref({ title: "Gift Cards" });
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Products",
    disabled: true,
    href: "#",
  },
]);

const valid = ref(false);

const name = ref([(v: string) => !!v || "Giftcard name is required"]);
const giftCardCategoryHeader = reactive([
  {
    title: "No",
  },
  {
    title: "Name",
  },
  {
    title: "Sell Rate",
  },
  {
    title: "Sell min amount",
  },
  {
    title: "Sell max amount",
  },
  {
    title: "Created at",
  },
  {
    title: "Status",
  },
  {
    title: "Toggle activation",
  },
  {
    title: "Actions",
  },
]);
// select file

// end
onMounted(async () => {
  await getAllGifCardProduct();
});

const blockedStatus = (status: string | null) => {
  return status !== null ? "Activated" : "Not active";
};
const statusColor = (status: string | null) => {
  return status !== null ? "green lighten-3" : "red lighten-3";
};

const edit = ref(false);
const btnText = ref("Create Item");
const editItem = (item: never) => {
  giftCard.value = Object.assign({}, item);
  btnText.value = "Update Item";
  dialog.value = true;
  edit.value = true;
};
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <div class="w-full d-flex justify-end my-3">
    <v-btn
      prepend-icon="mdi-plus"
      @click="dialog = true"
      variant="flat"
      color="secondary"
    >
      Create new giftcard product
    </v-btn>
  </div>
  <v-card class="my-4">
    <v-table>
      <thead>
        <tr>
          <th
            :key="index"
            v-for="(headerTitle, index) in giftCardCategoryHeader"
            class="text-left"
          >
            {{ headerTitle.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="loading == false && gift_products?.data?.length > 0">
        <tr v-for="(item, index) in gift_products.data" :key="item?.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item?.name }}</td>
          <td>{{ item.sell_rate.toLocaleString() }}</td>
          <td>₦‎ {{ item.sell_min_amount.toLocaleString() }}</td>
          <td>₦‎ {{ item.sell_max_amount.toLocaleString() }}</td>
          <td>{{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}</td>
          <td>
            <v-chip label class="pa-2" :color="statusColor(item?.activated_at)">
              {{ blockedStatus(item?.activated_at) }}
            </v-chip>
          </td>
          <td>
            <v-switch
              :color="item?.activated_at !== null ? 'secondary' : null"
              :value="item?.activated_at"
              v-model="item.activated_at"
              @input="activationGifCardProduct(item?.id)"
            ></v-switch>
          </td>
          <td>
            <!-- <v-icon
              small
              class="mr-2 text-secondary cursor-pointer"
              @click="showDetails(item?.id)"
              title="view"
              >mdi-eye</v-icon
            > -->
            <v-icon
              small
              class="mr-2 text-primary cursor-pointer"
              @click="editItem(item)"
              title="Edit"
              >mdi-pencil</v-icon
            >
            <v-icon
              small
              class="text-error cursor-pointer"
              title="Delete"
              @click="deleteGifCardProducts(item?.id)"
              >mdi-delete</v-icon
            >
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
      v-if="loading == false && gift_products?.data?.length <= 0"
      class="text-center py-6"
    >
      No data available
    </p>
  </v-card>

  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <h3 class="text-h5 font-weight-bold pa-7">{{ btnText }}</h3>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="giftCard.name"
                    :rules="name"
                    variant="outlined"
                    label="Giftcard product name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="giftCard.sell_rate"
                    variant="outlined"
                    label="Selling Rate*"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="giftCard.sell_min_amount"
                    variant="outlined"
                    label="Selling amount*"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="giftCard.sell_max_amount"
                    variant="outlined"
                    label="Selling Max Amount*"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-autocomplete
                    :items="countries"
                    label="Countries*"
                    required
                    chips
                    item-title="name"
                    item-value="id"
                    v-model="giftCard.country"
                    hint="This field is required"
                    persistent-hint
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-autocomplete
                    :items="giftCardCategories"
                    label="Giftcard categories*"
                    required
                    chips
                    item-title="name"
                    item-value="id"
                    v-model="giftCard.giftcard_category.id"
                    hint="This field is required"
                    persistent-hint
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-autocomplete
                    :items="currencies"
                    label="Currency*"
                    required
                    v-model="giftCard.currency"
                    chips
                    item-title="code"
                    item-value="id"
                    hint="This field is required"
                    persistent-hint
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            class="px-7"
            variant="outlined"
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            :loading="loading"
            @click="
              edit == true
                ? editGiftCardProduct(giftCard)
                : createGiftCardProduct(giftCard)
            "
            color="secondary"
            class="px-12"
            variant="flat"
          >
            {{ btnText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 18px !important;
}
</style>
