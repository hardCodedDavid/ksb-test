<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const page = ref({ title: "Gift Cards" });
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Management",
    disabled: true,
    href: "#",
  },
]);

const interest = ref(["Desiging", "Development", "Marketing"]);
const budget = ref(["Less then $5000", "$5000 - $10000"]);
const rules = ref([
  (v: string | any[]) => v.length <= 25 || "Max 25 characters",
]);

</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row align="center" justify="center">
   <v-col cols="12" sm="8" lg="6">
     <v-card>
      <v-card-text class="pa-5 mt-3">
        <h3 class="subtitle">Category Parameters</h3>
        <v-row class="mt-3" align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              label="Category Name"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col class="12">
            <v-select
              :items="interest"
              label="Select Countries"
              class="mt-0 pt-0"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              counter
              label="Terms"
              rows="2"
              :rules="rules"
              variant="outlined"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="pb-5 px-4">
        <v-btn color="primary" size="large" class="mr-2 px-12 text-capitalize">Save</v-btn>
        <v-btn color="secondary" size="large" class="px-12 text-capitalize" dark>Cancel</v-btn>
      </div>
    </v-card>
   </v-col>
  </v-row>
</template>
