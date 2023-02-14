<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import  { useDateFormat } from '@vueuse/core'
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useCountryStore } from "../../stores/country";
import { useGiftCardStore } from "../../stores/giftcard";

const { countryNames } = storeToRefs(useCountryStore());
const { giftCard, loading, dialog, gift_categories, singleGiftCard } =
  storeToRefs(useGiftCardStore());
const {
  createGiftCardCategory,
  getAllGifCardCategories,
  getSingleGifCardCategories,
  deleteGifCardCategories,
  restoreGifCardCategories,
  activationGifCardCategories,
} = useGiftCardStore();
const page = ref({ title: "Gift Cards" });
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Categories",
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
    title: "Icon",
  },
  {
    title: "Name",
  },
  {
    title: "Created At",
  },

  // {
  //   title: "Restore",
  // },
  {
    title: "Toggle Activation",
  },
  {
    title: "Actions",
  },
]);
// select file
// interface InputFileEvent extends Event {
//   target: HTMLInputElement;
// }
const getGiftIcon = (e: any) => {
  // if (!e.target.files) return;
  giftCard.value.icon = e.target.files[0];
};
// end
onMounted(async () => {
  await getAllGifCardCategories();
});

const id = ref("");
const dialog2 = ref(false);
const showDetails = async () => {
  dialog2.value = true;
  await getSingleGifCardCategories(id.value);
};
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <div class="w-full d-flex justify-end my-3">
    <v-btn @click="dialog = true" variant="flat" color="secondary">
      Create new giftcard category
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
    <tbody v-if="loading == false">
      <tr class="pa-2" v-for="item in gift_categories.data" :key="item.id">
        <td>{{ item?.icon }}</td>
        <td>{{ item?.name }}</td>
        <!-- <td>{{ item?.sale_term }}</td> -->
        <td>{{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}</td>

        <!-- <td>
          <v-switch @input="restoreGifCardCategories(item?.id)"></v-switch>
        </td> -->
        <td>
          <v-switch @input="activationGifCardCategories(item?.id)"></v-switch>
        </td>
        <td>
          <!-- <v-icon icon="mdi-dots-vertical"></v-icon> -->
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
                  @click="
                    id = item?.id;
                    showDetails();
                  "
                  link
                  color="secondary"
                >
                  <v-list-item-title> View Details </v-list-item-title>
                </v-list-item>
                <v-list-item link color="secondary">
                  <v-list-item-title> Update giftcard </v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="deleteGifCardCategories(item?.id)"
                  link
                  color="secondary"
                >
                  <v-list-item-title> Delete giftcard </v-list-item-title>
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
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="550px">
      <v-card>
        <v-card-title class="py-4">
          <h3 class="text-h5 font-weight-bold">New Giftcard Category</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="giftCard.name"
                    :rules="name"
                    label="Giftcard category name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-file-input
                    hint="This field is optional"
                    persistent-hint
                    append-inner-icon="mdi-paperclip"
                    prepend-icon=""
                    @input="getGiftIcon"
                    label="File input"
                  ></v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    hint="This field is optional"
                    persistent-hint
                    v-model="giftCard.sale_term"
                    label="Sale Term*"
                    required
                  ></v-textarea>
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
            @click="createGiftCardCategory(giftCard)"
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

  <v-dialog max-width="800px" v-model="dialog2">
    <v-card class="pa-5">
      <h3>GiftCard Details</h3>

      <div class="w-100 d-flex align-center justify-center">
        <v-row class="my-12 w-100 max-w-lg">
          <v-col cols="12" sm="6" lg="6">
            <h4 class="py-3">Image:</h4>
            <p class="mb-0">{{ singleGiftCard?.icon }}</p>
          </v-col>
          <v-col cols="12" sm="6" lg="6">
            <h4 class="py-3">Name:</h4>
            <p class="mb-0">{{ singleGiftCard?.name }}</p>
          </v-col>
          <v-col cols="12" sm="6" lg="6">
            <h4 class="py-3">Sales Term:</h4>
            <p class="mb-0">{{ singleGiftCard?.sale_term }}</p>
          </v-col>
          <v-col cols="12" sm="6" lg="6">
            <h4 class="py-3">Created At:</h4>
            <p class="mb-0">{{ singleGiftCard?.created_at }}</p>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>
