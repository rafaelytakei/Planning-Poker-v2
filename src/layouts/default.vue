<template>
  <router-view v-slot="{ Component }">
    <div class="flex flex-column h-full">
      <small-logo />
      <Avatar
        v-if="user"
        icon="pi pi-user"
        class="avatar"
        size="large"
        shape="circle"
        @click="toggleMenu"
      />
      <TieredMenu ref="menu" :model="items" :popup="true" />
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </div>
  </router-view>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUserOut, user } from '~/composables/firebase'

const menu = ref()
const router = useRouter()
const items = ref([
  {
    label: 'Sair',
    icon: 'pi pi-fw pi-power-off',
    command: async () => {
      await signUserOut()
      router.go()
      router.push({
        path: '/',
      })
    },
  },
])
const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.avatar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}
</style>
