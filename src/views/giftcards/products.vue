<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useCountryStore } from "../../stores/country";
import { useGiftProductStore } from "../../stores/products";

const { countryNames } = storeToRefs(useCountryStore());
const { giftCard, loading, dialog, gift_products } = storeToRefs(useGiftProductStore());
const { createGiftCardProduct, getAllGifCardProduct } = useGiftProductStore();
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

// const dialog = ref(false);
const valid = ref(false);
// const budget = ref(["Less then $5000", "$5000 - $10000"]);
// const rules = ref([
//   (v: string | any[]) => v.length <= 25 || "Max 25 characters",
// ]);
const name = ref([(v: string) => !!v || "Giftcard name is required"]);
const giftCardCategoryHeader = reactive([
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
    title: "Created At",
  },
  {
    title: "Actions",
  },
]);
// select file
interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

// end
onMounted(async () => {
  await getAllGifCardProduct();
});
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div class="w-full d-flex justify-end my-3">
    <v-btn @click="dialog = true" variant="flat" color="secondary">
      Create new giftcard product
    </v-btn>
  </div>
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
    <tbody v-if="gift_products?.data?.length > 0">
      <tr v-for="item in gift_products.data" :key="item?.id">
        <td>{{ item?.name }}</td>
        <td>{{ item?.sell_rate }}</td>
        <td>{{ item?.sell_min_amount }}</td>
        <td>{{ item?.sell_max_amount }}</td>
        <td>{{ item?.created_at }}</td>
      </tr>
    </tbody>
    
      <tr v-else class="text-center pa-4">
        <th colspan="8" class="pa-4">No data found</th>
      </tr>
    
  </v-table>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <h3 class="text-h5 font-weight-bold pa-7">New Giftcard Product</h3>
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
                    :items="[...countryNames]"
                    label="Countries"
                    required
                    v-model="giftCard.country"
                    hint="This field is optional"
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
            @click="createGiftCardProduct(giftCard)"
            color="secondary"
            class="px-12"
            variant="flat"
          >
            Create Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
