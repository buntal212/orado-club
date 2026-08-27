<template>
  <q-page class="member-page">
    <main class="page-content">
      <div class="page-heading">
        <q-btn round flat icon="arrow_back" color="white" aria-label="Kembali" @click="router.push('/')" />
        <div>
          <span>DATA ANGGOTA</span>
        </div>
      </div>

      <section class="member-card form-card">
        <div class="section-heading">
          <q-icon name="person_add" color="positive" size="24px" />
          <div><strong>Input Anggota</strong><span>Tambahkan anggota baru ke club Anda.</span></div>
        </div>
        <q-form class="member-form" @submit="submitForm">
          <q-input
            v-model.trim="store.form.name"
            outlined
            dense
            label="Nama lengkap"
            lazy-rules
            :rules="[(value) => Boolean(value) || 'Nama lengkap wajib diisi']"
          />
          <q-input
            v-model.trim="store.form.nik"
            outlined
            dense
            label="NIK"
            inputmode="numeric"
            maxlength="16"
            counter
            lazy-rules
            :rules="[(value) => /^\d{16}$/.test(value) || 'NIK harus terdiri dari 16 angka']"
          />
          <q-input
            v-model.trim="store.form.email"
            outlined
            dense
            type="email"
            label="Email (opsional)"
            hint="Jika kosong, email akan dibuat otomatis"
          />
          <q-input v-model.trim="store.form.no_hp" outlined dense label="Nomor HP (opsional)" inputmode="tel" maxlength="20" />
          <q-btn unelevated no-caps type="submit" color="positive" icon="save" label="Simpan anggota" :loading="store.saving" class="submit-button" />
        </q-form>
      </section>

      <section class="member-card list-card">
        <div class="section-heading list-heading">
          <q-icon name="groups" color="positive" size="24px" />
          <div><strong>List Anggota</strong><span>Daftar anggota yang terdaftar di club.</span></div>
        </div>
        <q-input v-model.trim="store.search" outlined dense clearable debounce="400" placeholder="Cari nama atau NIK" @update:model-value="store.getData">
          <template #prepend><q-icon name="search" /></template>
        </q-input>

        <div v-if="store.loading" class="state-box"><q-spinner color="positive" size="32px" /><span>Memuat data anggota...</span></div>
        <div v-else-if="!store.anggota.length" class="state-box"><q-icon name="group_off" size="38px" color="grey-5" /><strong>Belum ada anggota</strong><span>Tambahkan anggota pertama club Anda.</span></div>
        <q-list v-else separator class="member-list">
          <q-item v-for="member in store.anggota" :key="member.id">
            <q-item-section avatar><q-avatar color="green-1" text-color="positive" icon="person" /></q-item-section>
            <q-item-section>
              <q-item-label class="member-heading">
                <span class="member-name">{{ member.name }}</span>
                <q-badge
                  rounded
                  :color="member.flag === 2 ? 'positive' : 'orange-8'"
                  :label="member.flag === 2 ? 'Terverifikasi' : 'Menunggu Verifikasi'"
                />
              </q-item-label>
              <q-item-label caption>NIK {{ member.nik }}</q-item-label>
              <q-item-label v-if="member.email" caption>{{ member.email }}</q-item-label>
              <q-item-label v-if="member.no_hp" caption>{{ member.no_hp }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnggotaStore } from '@/stores/anggota'

const router = useRouter()
const store = useAnggotaStore()

async function submitForm() {
  if (await store.saveData()) await store.getData()
}

onMounted(() => store.getData())
onBeforeUnmount(() => store.resetForm())
</script>

<style scoped>
.member-page { min-height: calc(100vh - 58px); padding: 20px 14px 48px; background: linear-gradient(180deg, #006b4f 0, #006b4f 150px, #f1f6f3 150px); }
.page-content { max-width: 500px; margin: auto; }
.page-heading { display: grid; grid-template-columns: 42px 1fr; align-items: center; gap: 8px; min-height: 72px; color: #fff; }
.page-heading span { font-size: 9px; font-weight: 800; letter-spacing: .7px; opacity: .8; }
.page-heading h1 { margin: 3px 0 0; font-size: 22px; }
.member-card { padding: 16px; border: 1px solid #d8e9e2; border-radius: 18px; background: #fff; box-shadow: 0 14px 30px rgba(3, 73, 53, .13); }
.form-card { margin-bottom: 14px; }
.list-card { min-height: 280px; }
.section-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.section-heading div { display: flex; flex-direction: column; gap: 2px; }
.section-heading strong { color: #174c3d; font-size: 14px; }
.section-heading span { color: #708a81; font-size: 10px; }
.list-heading { margin-bottom: 13px; }
.member-form { display: grid; gap: 9px; }
.submit-button { min-height: 44px; border-radius: 10px; font-weight: 700; }
.member-list { margin-top: 12px; }
.member-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.member-name { color: #174c3d; font-weight: 700; }
.member-heading :deep(.q-badge) { flex: 0 0 auto; padding: 4px 7px; font-size: 9px; }
.state-box { display: flex; min-height: 210px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #708a81; font-size: 12px; text-align: center; }
.state-box strong { color: #174c3d; font-size: 14px; }
</style>
