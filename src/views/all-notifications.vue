<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
const action = useAuthStore();
const { notificationData, updating } = storeToRefs(useAuthStore());

const notification_id = computed(() => {
  return notificationData.value.map((notice: any) => {
    return notice.id;
  });
});

onMounted(async () => {
  await action.getNotifications();
});
</script>

<template>
  <div>
    <v-card class="pa-7">
      <div class="d-flex align-center justify-space-between">
        <h3>All Notifications</h3>
        
        <v-btn
          color="secondary"
          prepend-icon="mdi-bell-ring-outline"
          :loading="updating"
          @click="
            action.notificationData?.length > 0
              ? action.markAsRead(notification_id)
              : null
          "
          >Mark all as read</v-btn
        >
      </div>
      <v-row>
        <v-col cols="12">
          <v-list v-if="action.notificationData?.length > 0">
            <v-list-item
              :active-color="item?.read_at !== null ?? 'primary'"
              class="pa-3 mt-2"
              v-for="(item, i) in action.notificationData"
              :key="i"
              :value="item?.id"
              rounded="lg"
            >
              <div>
                <h4 class="font-weight-bold my-3">{{ item?.data.title }}</h4>
                <p class="grey-lighten-1">{{ item?.data.body }}</p>
              </div>
            </v-list-item>
          </v-list>

          <p v-else class="font-weight-bold text-center my-4">No data found</p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped></style>
