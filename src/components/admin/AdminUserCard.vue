<script setup lang="ts">
import { computed } from 'vue'
import AdminChip from './AdminChip.vue'
import { formatDate } from '@/utils/format'
import type { AdminUser } from '@/types'

const props = defineProps<{ user: AdminUser; isSelf: boolean }>()
const emit = defineEmits<{ edit: [] }>()

const initials = computed(() =>
  (props.user.name || props.user.email)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <button type="button" class="ucard" :class="{ 'ucard--off': !user.isActive }" @click="emit('edit')">
    <span class="ucard__avatar" aria-hidden="true">{{ initials }}</span>
    <span class="ucard__info">
      <span class="ucard__name">{{ user.name || 'Sin nombre' }}<em v-if="isSelf"> (tú)</em></span>
      <span class="ucard__email">{{ user.email }}</span>
      <span class="ucard__meta">
        {{ user.lastLoginAt ? `Último ingreso ${formatDate(user.lastLoginAt)}` : `Creada ${formatDate(user.createdAt)}` }}
      </span>
    </span>
    <span class="ucard__chips">
      <AdminChip v-if="user.accountType === 'admin'" tone="accent" icon="fa-solid fa-user-shield">Admin</AdminChip>
      <AdminChip v-else tone="neutral">Clienta</AdminChip>
      <AdminChip v-if="!user.isActive" tone="danger">Inactiva</AdminChip>
    </span>
  </button>
</template>

<style scoped lang="scss">
.ucard {
  @include card;
  @include flex(row, flex-start, flex-start, 0.75rem);
  @include transition;
  @include focus-ring;
  width: 100%;
  padding: 0.9rem;
  text-align: left;

  &:hover {
    border-color: $accent;
  }

  &--off {
    opacity: 0.65;
  }

  &__avatar {
    @include flex(row, center, center);
    flex: 0 0 42px;
    height: 42px;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__info {
    flex: 1 1 auto;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  &__name {
    font-weight: 600;
    font-size: 0.92rem;

    em {
      font-style: normal;
      font-weight: 500;
      color: $ink-muted;
    }
  }

  &__email {
    font-size: $text-xs;
    color: $ink-soft;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    font-size: 0.68rem;
    color: $ink-muted;
  }

  &__chips {
    @include flex(column, flex-end, flex-start, 0.3rem);
  }
}
</style>
