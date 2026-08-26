<template>
  <q-page class="club-page">
    <main class="club-content">
      <section class="profile-card">
        <div class="profile-avatar"><img src="@/assets/orado/logo-white.svg" alt="ORADO" /></div>
        <div class="col">
          <span class="greeting">Selamat datang,</span>
          <strong>{{ currentUser?.name || currentUser?.username || 'Pengguna Club' }}</strong>
          <p>Kelola aktivitas club dengan lebih mudah dan terintegrasi.</p>
        </div>
      </section>

      <div class="section-label">MENU APLIKASI</div>
      <section class="menu-panel">
        <div class="menu-grid">
          <q-card v-for="menu in menus" :key="menu.title" flat bordered class="menu-card" :class="{ 'menu-card--clickable': menu.to }" @click="openMenu(menu)">
            <q-card-section><q-icon :name="menu.icon" color="positive" size="25px" /><span>{{ menu.title }}</span></q-card-section>
          </q-card>
        </div>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Navigasi utama">
      <button type="button" class="nav-item nav-item--active"><q-icon name="home" /><span>Home</span></button>
      <button type="button" class="nav-item"><q-icon name="person_outline" /><span>Akun</span></button>
      <button type="button" class="nav-item" @click="handleLogout"><q-icon name="logout" /><span>Logout</span></button>
    </nav>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'

const router = useRouter()
const loginStore = useLoginStore()
const currentUser = ref(loginStore.user || JSON.parse(localStorage.getItem('orado_club_user') || 'null'))
const menus = [
  { title: 'Dashboard Club', icon: 'dashboard' },
  { title: 'Pendaftaran Club', icon: 'app_registration', to: '/pendaftaran-club' },
  { title: 'Data Anggota', icon: 'groups' },
  { title: 'Keuangan', icon: 'account_balance_wallet' },
  { title: 'Pemasukan', icon: 'south' },
  { title: 'Pengeluaran', icon: 'north' },
  { title: 'Laporan', icon: 'description' },
]

async function handleLogout() {
  await loginStore.logout()
  router.replace('/login')
}

function openMenu(menu) {
  if (menu.to) router.push(menu.to)
}

onMounted(async () => {
  currentUser.value = await loginStore.getUser()
})
</script>

<style scoped>
.club-page { min-height: calc(100vh - 58px); padding: 0 14px 92px; background: linear-gradient(#006b4f 0, #006b4f 86px, #f7f9fc 86px); }
.club-content { max-width: 430px; margin: auto; }
.profile-card { position: relative; top: 14px; display: flex; min-height: 116px; align-items: center; gap: 13px; padding: 17px 15px; border-radius: 14px; background: #fff; box-shadow: 0 8px 24px rgba(3, 73, 53, .14); }
.profile-avatar { display: grid; width: 64px; height: 64px; flex: 0 0 64px; place-items: center; overflow: hidden; border-radius: 50%; background: #006b4f; }.profile-avatar img { display: block; width: 52px; height: 52px; object-fit: contain; object-position: center; transform: translateX(1px); }
.greeting { color: #667b73; font-size: 9px; }.profile-card strong { display: block; color: #174c3d; font-size: 13px; }.profile-card p { margin: 3px 0 0; color: #718c84; font-size: 9px; line-height: 1.4; }
.section-label { margin: 35px 2px 10px; color: #24483e; font-size: 10px; font-weight: 800; letter-spacing: .55px; }.menu-panel { padding: 10px; border: 1px solid #dce9e4; border-radius: 15px; background: #fff; box-shadow: 0 4px 14px rgba(3, 73, 53, .05); }.menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }.menu-card { min-height: 102px; border-radius: 11px; background: #fdfffe; }.menu-card :deep(.q-card__section) { display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px 5px; color: #1e4d3f; font-size: 12px; font-weight: 700; line-height: 1.3; text-align: center; }.menu-card :deep(.q-icon) { font-size: 28px !important; }
.menu-card--clickable { cursor: pointer; }.menu-card--clickable:active { background: #effaf5; transform: translateY(1px); }
.bottom-nav { position: fixed; right: 0; bottom: 0; left: 0; z-index: 10; display: flex; justify-content: center; gap: 38px; padding: 11px 12px calc(11px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,.14); background: #006b4f; }.nav-item { display: flex; min-width: 66px; flex-direction: column; align-items: center; gap: 4px; padding: 3px 9px; border: 0; color: rgba(255,255,255,.72); background: transparent; font: inherit; font-size: 10px; cursor: pointer; }.nav-item .q-icon { font-size: 24px; }.nav-item--active { color: #fff; font-weight: 700; }
</style>
