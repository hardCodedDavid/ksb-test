<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useCountryStore } from "../../stores/country";
import { useGiftCardStore } from "../../stores/giftcard";

const { countries } = storeToRefs(useCountryStore());
const { giftCard, loading, dialog, gift_categories, singleGiftCard } =
  storeToRefs(useGiftCardStore());
const {
  createGiftCardCategory,
  getAllGifCardCategories,
  getSingleGifCardCategories,
  deleteGifCardCategories,
  restoreGifCardCategories,
  activationGifCardCategories,
  editGiftCardCategory,
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
const name = ref([(v: string) => !!v || "Giftcard name is required"]);
const giftCardCategoryHeader = reactive([
  {
    title: "No.",
  },
  {
    title: "Icon",
  },
  {
    title: "Name",
  },
  {
    title: "Created At",
  },
  {
    title: "Status",
  },

  {
    title: "Toggle Activation",
  },
  {
    title: "Actions",
  },
]);

const getGiftIcon = (e: any) => {
  giftCard.value.icon = e.target.files[0];
};
// end
onMounted(async () => {
  await getAllGifCardCategories();
});

const id = ref("");
const dialog2 = ref(false);
const showDetails = async (id: string) => {
  dialog2.value = true;
  await getSingleGifCardCategories(id);
};

const addGiftCard = async (giftCard: any) => {
  const store = useGiftCardStore();
  await createGiftCardCategory(giftCard);
  await store.$reset();
};

const edit = ref(false);
const btnText = ref("Create Item");
const editItem = (item: never) => {
  giftCard.value = Object.assign({}, item);
  btnText.value = "Update Item";
  dialog.value = true;
  edit.value = true;
};

const customFilter = (item: any, queryText: any, itemText: any) => {
  const textOne = item.name.toLowerCase();
  const textTwo = item.alpha2_code.toLowerCase();
  const textThree = item.alpha3_code.toLowerCase();
  const searchText = queryText.toLowerCase();

  return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1;
};

const blockedStatus = (status: string | null) => {
  return !status ? "Activated" : "Not active";
};

const statusColor = (status: string | null) => {
  return !status ? "green lighten-3" : "red lighten-3";
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
      Add giftcard category
    </v-btn>
  </div>
  <v-card>
    <v-table>
      <thead>
        <tr class="pa-2">
          <th
            :key="index"
            v-for="(headerTitle, index) in giftCardCategoryHeader"
            class="text-left"
          >
            {{ headerTitle.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="loading == false && gift_categories?.data?.length > 0">
        <tr
          class="pa-2"
          v-for="(item, index) in gift_categories.data"
          :key="item.id"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <v-avatar size="50px">
              <v-img
                cover
                class="rounded-circle img-fluid img-size"
                :src="item?.icon"
              ></v-img>
            </v-avatar>
          </td>
          <td>{{ item?.name }}</td>

          <!-- <td>{{ item?.sale_term }}</td> -->
          <td>{{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}</td>
          <td>
            <v-chip label class="pa-2" :color="statusColor(item?.activated_at)">
              {{ blockedStatus(item?.activated_at) }}
            </v-chip>
          </td>
          <!-- <td>
          <v-switch @input="restoreGifCardCategories(item?.id)"></v-switch>
        </td> -->
          <td>
            <v-switch @input="activationGifCardCategories(item?.id)"></v-switch>
          </td>
          <td>
            <v-icon
              small
              class="mr-2 text-secondary cursor-pointer"
              @click="showDetails(item?.id)"
              title="view"
              >mdi-eye</v-icon
            >
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
              @click="deleteGifCardCategories(item?.id)"
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
      v-if="loading == false && gift_categories?.data?.length <= 0"
      class="text-center py-6"
    >
      No data available
    </p>
  </v-card>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="520px">
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
                    :items="countries"
                    label="Countries"
                    required
                    chips
                    :custom-filter="customFilter"
                    multiple
                    item-title="name"
                    item-value="id"
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
            @click=" edit == true
                ? editGiftCardCategory(giftCard)
                : createGiftCardCategory(giftCard)
             
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

  <v-dialog max-width="300px" v-model="dialog2">
    <v-card class="pa-5">
      <h3>GiftCard Details</h3>

      <div class="w-100 d-flex align-center justify-center">
        <v-row class="my-12 w-100 max-w-lg">
          <v-col cols="12" sm="6" lg="6">
            <div class="d-flex align-center">
              <v-avatar size="70px">
                <v-img
                  cover
                  class="rounded-circle img-fluid"
                  :src="singleGiftCard?.icon"
                >
                </v-img>
              </v-avatar>
              <div class="ml-4">
                <h4 class="py-1">Name:</h4>
                <p class="mb-0">{{ singleGiftCard?.name }}</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6" lg="12">
            <h4 class="py-1">Sales Term:</h4>
            <p class="mb-0">
              {{ singleGiftCard?.sale_term ?? "No sale term detail" }}
            </p>
          </v-col>
          <v-col cols="12" sm="6" lg="12">
            <h4 class="py-1">Created At:</h4>
            <p class="mb-0">
              {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
            </p>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>

