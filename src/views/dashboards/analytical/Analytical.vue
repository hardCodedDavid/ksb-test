<script setup lang="ts">
import { ref, onMounted } from "vue";
import WelcomeCard from "../dashboardComponents/analytical/welcome-card/WelcomeCard.vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import TheEarnings from "@/views/dashboards/dashboardComponents/analytical/earnings/TheEarnings.vue";
import MonthlyRevenue from "@/views/dashboards/dashboardComponents/analytical/monthly-revenue/MonthlyRevenue.vue";
import TheSalesOverview from "@/views/dashboards/dashboardComponents/analytical/sales-overview/TheSalesOverview.vue";
import TotalSales from "@/views/dashboards/dashboardComponents/analytical/total-sales/TotalSales.vue";
import ProductMonthTable from "@/views/dashboards/dashboardComponents/analytical/project-month-table/ProductMonthTable.vue";
import BlogCard from "@/views/dashboards/dashboardComponents/analytical/blog-card/BlogCard.vue";
import WeeklyStats from "@/views/dashboards/dashboardComponents/analytical/weekly-stats/WeeklyStats.vue";
import DailyActivities from "@/views/dashboards/dashboardComponents/analytical/daily-activities/DailyActivities.vue";


import  { useAuthStore } from '../../../stores/auth'

const action = useAuthStore()

const page = ref({ title: "Dashboard Analytics" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "#",
  },
  {
    text: "Analytical",
    disabled: true,
    href: "#",
  },
]);

const mark = ref([])

onMounted(async ()=> {
  await action.GetProfile()
  await action.getPermissions()
})
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12" lg="12">
      <v-row>
        <v-col cols="12" sm="8" lg="6">
          <WelcomeCard />
        </v-col>
        <v-col cols="12" sm="8" lg="6">
          <v-card class="py-4 px-6">
            <v-layout align-center justify-space-between class="ml-6">
              <div
                v-for="(item, index) in 3"
                :key="index"
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="#e5fafb" size="x-large">
                  <vue-feather
                    type="gift"
                    class="text-dark text-success"
                  ></vue-feather>
                </v-avatar>

                <div class="pl-3 my-5">
                  <h3 class="mb-2">0</h3>
                  <span>Monthly Sales</span>
                </div>
              </div>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12" sm="6" lg="4" class="">
          <TheEarnings></TheEarnings>
        </v-col>
        <v-col cols="12" sm="6" lg="4" class="">
          <MonthlyRevenue></MonthlyRevenue>
        </v-col>
        <v-col cols="12" sm="6" lg="4" class="">
          <TheEarnings></TheEarnings>
        </v-col>
      </v-row>
    </v-col>
    <!-- <v-col cols="12" sm="12" lg="6">
      <TheSalesOverview></TheSalesOverview>
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TotalSales></TotalSales>
    </v-col>
    <v-col cols="12" sm="12" lg="8">
      <ProductMonthTable></ProductMonthTable>
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <BlogCard></BlogCard>
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <WeeklyStats></WeeklyStats>
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <DailyActivities></DailyActivities>
    </v-col> -->
  </v-row>

  <v-dialog max-width="400px" v-model="action.notificationModal">
      <v-card>
        
        <v-card-text>
        <h3>All Notifications</h3>
         <v-row>
          <v-col cols="12">
          <v-list>
          <v-list-item
          class="pa-3 mt-2 d-flex"
          v-for="(item, i) in action.notificationData"
          :key="i"
          :value="item?.id"
          rounded="lg"
          :title="item?.data.title"
          :subtitle="item?.data.body"
        >
          <!-- <v-checkbox
            @click="action.markAsRead(item.id)"
            v-model="item.id"
            label="Mark as read"
            color="red-darken-3"
            value="red-darken-3"
            hide-details
          ></v-checkbox> -->
          <v-btn color="secondary" variant="text" :loading="action.updating" @click="action.markAsRead(item.id)">Mark as read</v-btn>
        </v-list-item>
          </v-list>
          </v-col>
         </v-row>
        </v-card-text>
        <v-card-actions class="my-4">
          <v-btn   block @click="action.notificationModal = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
