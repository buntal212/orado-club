<template>
  <q-page class="member-page">
    <main class="page-content">
      <div class="page-heading">
        <q-btn
          round
          flat
          icon="arrow_back"
          color="white"
          aria-label="Kembali"
          @click="router.push('/')"
        />
        <div>
          <span>KEANGGOTAAN CLUB</span>
          <h1>Data Anggota</h1>
        </div>
      </div>

      <section class="member-card form-card">
        <div class="section-heading">
          <div class="heading-icon"><q-icon name="person_add" size="21px" /></div>
          <div><strong>Input Anggota</strong><span>Tambahkan anggota baru ke club Anda.</span></div>
        </div>
        <q-form class="member-form" @submit="submitForm">
          <q-input v-model.trim="store.form.name" outlined dense label="Nama lengkap" />
          <q-input
            v-model.trim="store.form.nik"
            outlined
            dense
            label="NIK"
            inputmode="numeric"
            maxlength="16"
          />
          <q-input
            v-model="store.form.tanggal_lahir"
            outlined
            dense
            type="date"
            label="Tanggal lahir"
          />
          <q-select
            v-model="store.form.jenis_kelamin"
            outlined
            dense
            emit-value
            map-options
            label="Jenis kelamin"
            :options="genderOptions.slice(1)"
          />
          <q-input
            v-model.trim="store.form.email"
            outlined
            dense
            type="email"
            label="Email (opsional)"
            hint="Jika kosong, email akan dibuat otomatis"
          />
          <q-input
            v-model.trim="store.form.no_hp"
            outlined
            dense
            label="Nomor HP (opsional)"
            inputmode="tel"
            maxlength="20"
          />
          <q-btn
            unelevated
            no-caps
            type="submit"
            color="positive"
            icon="save"
            label="Simpan anggota"
            :loading="store.saving"
            class="submit-button"
          />
        </q-form>
      </section>

      <section class="member-card list-card">
        <div class="section-heading list-heading">
          <div class="heading-icon"><q-icon name="groups" size="21px" /></div>
          <div>
            <strong>List Anggota</strong><span>Daftar anggota yang terdaftar di club.</span>
          </div>
        </div>
        <q-input
          v-model.trim="store.search"
          outlined
          dense
          clearable
          debounce="400"
          placeholder="Cari nama atau NIK"
          @update:model-value="store.getData"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <div class="age-filter">
          <span>Filter kategori atlet</span>
          <q-btn-toggle
            :model-value="store.ageGroup"
            unelevated
            no-caps
            spread
            toggle-color="positive"
            color="grey-2"
            text-color="grey-8"
            :options="ageGroupOptions"
            @update:model-value="filterByAge"
          />
        </div>
        <div class="gender-filter">
          <span>Jenis kelamin</span>
          <q-btn-toggle
            :model-value="store.gender"
            unelevated
            no-caps
            spread
            toggle-color="positive"
            color="grey-2"
            text-color="grey-8"
            :options="genderOptions"
            @update:model-value="filterByGender"
          />
        </div>

        <div v-if="store.loading" class="state-box">
          <q-spinner color="positive" size="32px" /><span>Memuat data anggota...</span>
        </div>
        <div v-else-if="!store.anggota.length" class="state-box">
          <q-icon name="group_off" size="38px" color="grey-5" /><strong>Belum ada anggota</strong
          ><span>Tambahkan anggota pertama club Anda.</span>
        </div>
        <q-list v-else separator class="member-list">
          <q-item v-for="member in store.anggota" :key="member.id" class="member-item">
            <q-item-section avatar
              ><q-avatar color="green-1" text-color="positive" icon="person"
            /></q-item-section>
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
              <q-item-label v-if="member.tanggal_lahir" caption>
                Lahir {{ formatDate(member.tanggal_lahir) }} ({{
                  calculateAge(member.tanggal_lahir)
                }})
              </q-item-label>
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
const ageGroupOptions = [
  { label: 'Semua', value: '' },
  { label: 'Yunior · ≤16', value: 'junior' },
  { label: 'Senior · 17–23', value: 'senior' },
  { label: 'Profesional · ≥24', value: 'professional' },
]
const genderOptions = [
  { label: 'Semua', value: '' },
  { label: 'Laki-laki', value: 'L' },
  { label: 'Perempuan', value: 'P' },
]

function filterByAge(value) {
  store.ageGroup = value
  store.getData()
}

function filterByGender(value) {
  store.gender = value
  store.getData()
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function calculateAge(value) {
  const birthDate = new Date(`${value}T00:00:00`)
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  let days = today.getDate() - birthDate.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return `${years} tahun ${months} bulan ${days} hari`
}

async function submitForm() {
  if (await store.saveData()) await store.getData()
}

onMounted(() => store.getData())
onBeforeUnmount(() => store.resetForm())
</script>

<style scoped>
.member-page {
  min-height: calc(100vh - 58px);
  padding: 16px 14px 48px;
  background:
    radial-gradient(circle at 88% 4%, rgba(91, 210, 151, 0.32), transparent 145px),
    linear-gradient(180deg, #006d50 0, #007354 190px, #eef6f2 190px);
}
.page-content {
  max-width: 500px;
  margin: auto;
}
.page-heading {
  display: grid;
  grid-template-columns: 46px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 104px;
  color: #fff;
}
.page-heading :deep(.q-btn) {
  background: rgba(255, 255, 255, 0.12);
}
.page-heading span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  opacity: 0.72;
}
.page-heading h1 {
  margin: 4px 0 0;
  font-size: 25px;
  line-height: 1.05;
  letter-spacing: -0.5px;
}
.member-card {
  padding: 16px;
  border: 1px solid rgba(218, 234, 226, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 16px 34px rgba(3, 73, 53, 0.12);
}
.form-card {
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
}
.form-card::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 96px;
  height: 4px;
  content: '';
  border-radius: 0 20px 0 8px;
  background: linear-gradient(90deg, #22c45a, #8be6a8);
}
.list-card {
  min-height: 280px;
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
}
.heading-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  color: #05a947;
  background: #e5f8eb;
}
.section-heading div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.section-heading strong {
  color: #164d3c;
  font-size: 15px;
  letter-spacing: -0.15px;
}
.section-heading span {
  color: #789087;
  font-size: 10px;
}
.list-heading {
  margin-bottom: 13px;
}
.member-form {
  display: grid;
  gap: 8px;
}
.member-form :deep(.q-field--outlined .q-field__control) {
  min-height: 44px;
  border-radius: 11px;
  background: #fbfdfc;
}
.member-form :deep(.q-field--outlined .q-field__control::before) {
  border-color: #cddbd4;
}
.member-form :deep(.q-field--focused .q-field__control::after) {
  border-width: 2px;
}
.member-form :deep(.q-field__label) {
  color: #718279;
}
.member-form :deep(.q-field__bottom) {
  min-height: 14px;
  padding: 2px 4px 0;
  font-size: 9px;
}
.submit-button {
  min-height: 44px;
  margin-top: 1px;
  border-radius: 12px;
  font-weight: 800;
  letter-spacing: 0.1px;
  box-shadow: 0 8px 16px rgba(25, 183, 77, 0.24);
}
.list-card > :deep(.q-field--outlined .q-field__control) {
  min-height: 46px;
  border-radius: 11px;
  background: #fbfdfc;
}
.list-card > :deep(.q-field--outlined .q-field__control::before) {
  border-color: #d1ded8;
}
.age-filter {
  margin-top: 14px;
}
.age-filter > span {
  display: block;
  margin: 0 0 7px 2px;
  color: #71877e;
  font-size: 10px;
  font-weight: 700;
}
.age-filter :deep(.q-btn-group) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  box-shadow: none;
}
.age-filter :deep(.q-btn) {
  min-height: 33px;
  border: 1px solid #dce8e2;
  border-radius: 9px !important;
  font-size: 9px;
}
.age-filter :deep(.q-btn--active) {
  border-color: #18aa52;
  box-shadow: 0 4px 9px rgba(24, 170, 82, 0.17);
}
.gender-filter {
  margin-top: 12px;
}
.gender-filter > span {
  display: block;
  margin: 0 0 7px 2px;
  color: #71877e;
  font-size: 10px;
  font-weight: 700;
}
.gender-filter :deep(.q-btn-group) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  box-shadow: none;
}
.gender-filter :deep(.q-btn) {
  min-height: 33px;
  border: 1px solid #dce8e2;
  border-radius: 9px !important;
  font-size: 9px;
}
.gender-filter :deep(.q-btn--active) {
  border-color: #18aa52;
  box-shadow: 0 4px 9px rgba(24, 170, 82, 0.17);
}
.member-list {
  margin-top: 14px;
}
.member-item {
  min-height: 76px;
  padding: 11px 3px;
}
.member-item :deep(.q-item__section--avatar) {
  min-width: 48px;
}
.member-item :deep(.q-avatar) {
  box-shadow: inset 0 0 0 1px rgba(26, 180, 79, 0.08);
}
.member-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.member-name {
  color: #174c3d;
  font-weight: 800;
}
.member-heading :deep(.q-badge) {
  flex: 0 0 auto;
  padding: 4px 7px;
  font-size: 9px;
  font-weight: 700;
}
.member-item :deep(.q-item__label--caption) {
  margin-top: 2px;
  color: #74877f;
  line-height: 1.35;
}
.state-box {
  display: flex;
  min-height: 210px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #708a81;
  font-size: 12px;
  text-align: center;
}
.state-box strong {
  color: #174c3d;
  font-size: 14px;
}

@media (min-width: 600px) {
  .member-page {
    padding-top: 24px;
  }
  .page-heading {
    min-height: 112px;
  }
  .member-card {
    padding: 22px;
  }
}
</style>
