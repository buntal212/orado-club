<template>
  <q-page class="account-page">
    <main class="account-content">
      <div class="page-heading">
        <q-btn round flat icon="arrow_back" color="white" aria-label="Kembali" @click="router.push('/')" />
        <div><span>PROFIL CLUB</span></div>
      </div>

      <section class="identity-card">
        <div class="card-pattern card-pattern--one" />
        <div class="card-pattern card-pattern--two" />
        <div class="identity-header">
          <div class="brand-mark"><img src="@/assets/orado/logo-white.svg" alt="ORADO" /></div>
          <div><strong>KARTU IDENTITAS CLUB</strong><span>ORADO KOTA PROBOLINGGO</span></div>
          <q-icon name="verified" size="27px" />
        </div>

        <div class="club-name">{{ clubDisplayName }}</div>
        <div class="club-code"><span>KODE CLUB</span><strong>{{ club?.kode_club || '-' }}</strong></div>

        <div class="identity-footer">
          <div><span>PEMILIK AKUN</span><strong>{{ user?.username || user?.email || '-' }}</strong></div>
          <q-badge rounded :color="statusColor" :label="club?.status || 'Status belum tersedia'" />
        </div>
      </section>

      <section class="profile-card">
        <div class="section-title"><q-icon name="business" color="positive" /><strong>Informasi Club</strong></div>
        <q-list separator>
          <q-item>
            <q-item-section avatar><q-icon name="location_on" color="positive" /></q-item-section>
            <q-item-section><q-item-label caption>Alamat</q-item-label><q-item-label>{{ club?.alamat || '-' }}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar><q-icon name="map" color="positive" /></q-item-section>
            <q-item-section><q-item-label caption>Kelurahan / Kecamatan</q-item-label><q-item-label>{{ wilayah }}</q-item-label></q-item-section>
          </q-item>
          <q-item v-if="club?.catatan">
            <q-item-section avatar><q-icon name="notes" color="positive" /></q-item-section>
            <q-item-section><q-item-label caption>Catatan</q-item-label><q-item-label>{{ club.catatan }}</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </section>

      <section class="member-section">
        <div class="member-section-heading">
          <div><span>IDENTITAS ANGGOTA</span><h2>Kartu Anggota Club</h2></div>
          <q-badge rounded color="positive" :label="`${anggotaStore.anggota.length} anggota`" />
        </div>

        <div v-if="anggotaStore.loading" class="member-state"><q-spinner color="positive" size="30px" /> Memuat kartu anggota...</div>
        <div v-else-if="!anggotaStore.anggota.length" class="member-state"><q-icon name="badge" size="32px" /> Belum ada anggota club.</div>
        <article v-for="member in anggotaStore.anggota" v-else :key="member.id" class="member-card">
          <div class="member-card-top">
            <div class="member-avatar"><img src="@/assets/orado/logo-white.svg" alt="ORADO" /></div>
            <div class="member-brand"><strong>ORADO KOTA PROBOLINGGO</strong><span>Kartu Anggota</span></div>
            <div class="member-tools">
              <q-btn round flat dense icon="download" aria-label="Download kartu anggota" @click="downloadMemberCard(member)" />
              <img v-if="memberQrCodes[member.id]" class="member-qr" :src="memberQrCodes[member.id]" alt="QR identitas anggota" />
            </div>
          </div>
          <div class="member-name">{{ member.name }}</div>
          <div class="member-nik"><span>NIK</span><strong>{{ member.nik }}</strong></div>
          <div class="member-details">
            <div><span>NAMA CLUB</span><strong>{{ clubDisplayName }}</strong></div>
            <div><span>NO. HP</span><strong>{{ member.no_hp || '-' }}</strong></div>
            <div><span>JENIS KELAMIN</span><strong>{{ genderLabel(member.jenis_kelamin) }}</strong></div>
          </div>
          <div class="member-card-footer">
            <span>{{ club?.kode_club || 'ORADO' }}</span>
            <q-badge rounded :color="member.flag === 2 ? 'positive' : 'orange-8'" :label="member.flag === 2 ? 'Terverifikasi' : 'Menunggu Verifikasi'" />
          </div>
        </article>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Navigasi utama">
      <button type="button" class="nav-item" @click="router.push('/')"><q-icon name="home" /><span>Home</span></button>
      <button type="button" class="nav-item nav-item--active"><q-icon name="person" /><span>Akun</span></button>
      <button type="button" class="nav-item" @click="handleLogout"><q-icon name="logout" /><span>Logout</span></button>
    </nav>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { useLoginStore } from '@/stores/login'
import { useAnggotaStore } from '@/stores/anggota'
import logoOrado from '@/assets/orado/logo-white.svg'

const router = useRouter()
const loginStore = useLoginStore()
const anggotaStore = useAnggotaStore()
const memberQrCodes = ref({})
const user = computed(() => loginStore.user)
const club = computed(() => user.value?.club)
const clubDisplayName = computed(() => {
  const name = club.value?.nama_club || user.value?.name
  if (!name) return '-'
  return /\bclub$/i.test(name.trim()) ? name : `${name} Club`
})
const wilayah = computed(() => [club.value?.kelurahan, club.value?.kecamatan].filter(Boolean).join(', ') || '-')
const statusColor = computed(() => String(club.value?.status).toLowerCase().includes('verifikasi') && !String(club.value?.status).toLowerCase().includes('menunggu') ? 'positive' : 'orange-8')

async function handleLogout() {
  await loginStore.logout()
  router.replace('/login')
}

function genderLabel(value) {
  if (value === 'L') return 'Laki-laki'
  if (value === 'P') return 'Perempuan'
  return '-'
}

async function downloadMemberCard(member) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 700
  const ctx = canvas.getContext('2d')
  const verified = member.flag === 2
  const status = verified ? 'TERVERIFIKASI' : 'MENUNGGU VERIFIKASI'

  const gradient = ctx.createLinearGradient(0, 0, 1200, 700)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(1, '#e8f7f0')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 700)
  ctx.fillStyle = '#006b4f'
  ctx.fillRect(0, 0, 1200, 18)

  ctx.globalAlpha = 0.06
  ctx.strokeStyle = '#006b4f'
  ctx.lineWidth = 42
  ctx.beginPath()
  ctx.arc(1080, 620, 185, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.fillStyle = '#006b4f'
  ctx.beginPath()
  ctx.arc(105, 105, 57, 0, Math.PI * 2)
  ctx.fill()
  try {
    const logo = await loadImage(logoOrado)
    ctx.drawImage(logo, 66, 66, 78, 78)
  } catch {
    ctx.fillStyle = '#ffffff'
    ctx.font = '800 25px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('OR', 105, 114)
    ctx.textAlign = 'left'
  }

  ctx.fillStyle = '#174c3d'
  ctx.font = '700 28px Arial'
  ctx.fillText('ORADO KOTA PROBOLINGGO', 185, 92)
  ctx.fillStyle = '#718c84'
  ctx.font = '600 18px Arial'
  ctx.fillText('KARTU ANGGOTA', 185, 126)
  const qrSource = await QRCode.toDataURL(memberQrPayload(member), {
    width: 220,
    margin: 1,
    color: { dark: '#006b4f', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
  const qrImage = await loadImage(qrSource)
  ctx.drawImage(qrImage, 1015, 45, 125, 125)
  ctx.strokeStyle = '#b8d8cb'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(70, 185)
  ctx.lineTo(1130, 185)
  ctx.stroke()

  ctx.fillStyle = '#174c3d'
  ctx.font = '700 48px Arial'
  ctx.fillText(member.name || '-', 70, 250, 1060)
  drawField(ctx, 'NIK', member.nik || '-', 70, 310)
  drawField(ctx, 'NAMA CLUB', clubDisplayName.value, 70, 430, 470)
  drawField(ctx, 'NO. HP', member.no_hp || '-', 590, 430, 230)
  drawField(ctx, 'JENIS KELAMIN', genderLabel(member.jenis_kelamin), 870, 430, 260)

  ctx.strokeStyle = '#cfe3da'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(70, 555)
  ctx.lineTo(1130, 555)
  ctx.stroke()
  ctx.fillStyle = '#174c3d'
  ctx.font = '800 23px Arial'
  ctx.fillText(club.value?.kode_club || 'ORADO', 70, 620)

  ctx.fillStyle = verified ? '#16a34a' : '#d97706'
  ctx.beginPath()
  ctx.roundRect(850, 580, 280, 58, 29)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(status, 990, 617)
  ctx.textAlign = 'left'

  const link = document.createElement('a')
  const filename = String(member.name || 'anggota').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  link.download = `kartu-anggota-${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function drawField(ctx, label, value, x, y, maxWidth = 1060) {
  ctx.fillStyle = '#789087'
  ctx.font = '700 15px Arial'
  ctx.fillText(label, x, y)
  ctx.fillStyle = '#174c3d'
  ctx.font = '700 23px Arial'
  ctx.fillText(String(value), x, y + 38, maxWidth)
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })
}

function memberQrPayload(member) {
  return JSON.stringify({
    orado: 'Kota Probolinggo',
    club: club.value?.kode_club || club.value?.nama_club || null,
    anggota: member.id,
    nik: member.nik,
    nama: member.name,
  })
}

async function generateMemberQrCodes() {
  const entries = await Promise.all(
    anggotaStore.anggota.map(async (member) => [
      member.id,
      await QRCode.toDataURL(memberQrPayload(member), {
        width: 160,
        margin: 1,
        color: { dark: '#006b4f', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      }),
    ]),
  )
  memberQrCodes.value = Object.fromEntries(entries)
}

onMounted(async () => {
  if (!(await loginStore.getUser())) {
    router.replace('/login')
    return
  }
  anggotaStore.search = ''
  await anggotaStore.getData()
  await generateMemberQrCodes()
})
</script>

<style scoped>
.account-page { min-height: calc(100vh - 58px); padding: 16px 14px 94px; background: linear-gradient(180deg, #006b4f 0, #006b4f 185px, #f1f6f3 185px); }
.account-content { max-width: 500px; margin: auto; }
.page-heading { display: grid; grid-template-columns: 42px 1fr; align-items: center; gap: 8px; min-height: 66px; color: #fff; }
.page-heading span { font-size: 9px; font-weight: 800; letter-spacing: .8px; opacity: .75; }.page-heading h1 { margin: 2px 0 0; font-size: 22px; }
.identity-card { position: relative; min-height: 225px; overflow: hidden; padding: 20px; border-radius: 20px; color: #fff; background: linear-gradient(145deg, #014d39, #00825e); box-shadow: 0 16px 34px rgba(3, 73, 53, .28); }
.card-pattern { position: absolute; border: 1px solid rgba(255,255,255,.1); border-radius: 50%; }.card-pattern--one { width: 190px; height: 190px; top: -105px; right: -55px; }.card-pattern--two { width: 150px; height: 150px; right: 28px; bottom: -105px; }
.identity-header { position: relative; display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 10px; }.brand-mark { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.14); }.brand-mark img { width: 34px; height: 34px; object-fit: contain; }.identity-header strong,.identity-header span { display: block; }.identity-header strong { font-size: 12px; letter-spacing: .5px; }.identity-header span { margin-top: 2px; font-size: 8px; letter-spacing: .8px; opacity: .75; }
.club-name { position: relative; margin-top: 28px; font-size: 21px; font-weight: 800; line-height: 1.25; }.club-code { position: relative; margin-top: 11px; }.club-code span,.identity-footer span { display: block; font-size: 8px; font-weight: 700; letter-spacing: .8px; opacity: .7; }.club-code strong { display: block; margin-top: 2px; font-size: 13px; letter-spacing: 1px; }
.identity-footer { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-top: 22px; }.identity-footer strong { display: block; margin-top: 3px; font-size: 11px; }.identity-footer :deep(.q-badge) { padding: 5px 8px; font-size: 9px; }
.profile-card { margin-top: 15px; padding: 16px; border: 1px solid #d8e9e2; border-radius: 17px; background: #fff; box-shadow: 0 7px 20px rgba(3,73,53,.08); }.section-title { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #174c3d; font-size: 14px; }.section-title .q-icon { font-size: 22px; }.profile-card :deep(.q-item) { padding-right: 2px; padding-left: 2px; }.profile-card :deep(.q-item__section--avatar) { min-width: 36px; }.profile-card :deep(.q-item__label) { color: #294c42; font-size: 12px; }.profile-card :deep(.q-item__label--caption) { color: #80948d; font-size: 10px; }
.member-section { margin-top: 22px; }.member-section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin: 0 2px 12px; }.member-section-heading span { color: #007157; font-size: 9px; font-weight: 800; letter-spacing: .7px; }.member-section-heading h2 { margin: 3px 0 0; color: #174c3d; font-size: 18px; }.member-section-heading :deep(.q-badge) { padding: 5px 8px; font-size: 9px; }.member-state { display: flex; min-height: 100px; align-items: center; justify-content: center; gap: 9px; border: 1px solid #d8e9e2; border-radius: 16px; color: #708a81; background: #fff; font-size: 11px; }
.member-card { position: relative; overflow: hidden; margin-bottom: 14px; padding: 18px; border: 1px solid #c8e1d7; border-top: 4px solid #007157; border-radius: 18px; color: #174c3d; background: linear-gradient(145deg, #fff 0%, #f2fbf7 72%, #e4f5ed 100%); box-shadow: 0 10px 26px rgba(3,73,53,.12); }.member-card::before { position: absolute; width: 170px; height: 170px; top: -115px; right: -80px; content: ''; border: 22px solid rgba(0,107,79,.045); border-radius: 50%; }.member-card::after { position: absolute; width: 130px; height: 130px; right: -70px; bottom: -80px; content: ''; border: 18px solid rgba(0,107,79,.06); border-radius: 50%; }.member-card-top { position: relative; display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 10px; }.member-avatar { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(145deg, #006b4f, #00a174); box-shadow: 0 5px 12px rgba(0,107,79,.2); }.member-avatar .q-icon { font-size: 24px; }.member-brand strong,.member-brand span { display: block; }.member-brand strong { font-size: 11px; letter-spacing: .9px; }.member-brand span { margin-top: 3px; color: #708a81; font-size: 8px; font-weight: 600; text-transform: uppercase; }.member-tools { display: flex; align-items: center; gap: 2px; color: #007157; }.member-tools .q-btn { z-index: 2; font-size: 20px; }.member-name { position: relative; margin-top: 20px; font-size: 20px; font-weight: 800; text-transform: capitalize; }.member-nik { position: relative; margin-top: 8px; }.member-nik span,.member-details span { display: block; color: #789087; font-size: 7px; font-weight: 800; letter-spacing: .8px; }.member-nik strong { display: block; margin-top: 3px; font-size: 13px; letter-spacing: .6px; }.member-details { position: relative; display: grid; grid-template-columns: 1.35fr 1fr .8fr; gap: 12px; margin-top: 16px; }.member-details strong { display: block; overflow: hidden; margin-top: 4px; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }.member-card-footer { position: relative; display: flex; align-items: center; justify-content: space-between; margin-top: 18px; padding-top: 11px; border-top: 1px solid #d4e7df; }.member-card-footer > span { font-size: 10px; font-weight: 800; letter-spacing: .9px; }.member-card-footer :deep(.q-badge) { padding: 5px 8px; font-size: 8px; box-shadow: 0 3px 8px rgba(0,0,0,.08); }
.member-avatar img { width: 34px; height: 34px; object-fit: contain; }
.member-qr { width: 38px; height: 38px; padding: 2px; border-radius: 4px; background: #fff; object-fit: contain; }
.member-card-top { padding-bottom: 12px; border-bottom: 1px solid #b8d8cb; }
.bottom-nav { position: fixed; right: 0; bottom: 0; left: 0; z-index: 10; display: flex; justify-content: center; gap: 38px; padding: 11px 12px calc(11px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,.14); background: #006b4f; }.nav-item { display: flex; min-width: 66px; flex-direction: column; align-items: center; gap: 4px; padding: 3px 9px; border: 0; color: rgba(255,255,255,.72); background: transparent; font: inherit; font-size: 10px; cursor: pointer; }.nav-item .q-icon { font-size: 24px; }.nav-item--active { color: #fff; font-weight: 700; }
</style>
