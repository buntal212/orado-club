import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

export const useAnggotaStore = defineStore('anggota', {
  state: () => ({
    loading: false,
    saving: false,
    anggota: [],
    search: '',
    ageGroup: '',
    gender: '',
    form: {
      name: '',
      email: '',
      nik: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      no_hp: '',
    },
  }),
  actions: {
    async getData() {
      this.loading = true
      try {
        const response = await api.get('/v2/club/anggota', {
          params: {
            search: this.search || undefined,
            age_group: this.ageGroup || undefined,
            gender: this.gender || undefined,
          },
        })
        this.anggota = response.data?.data ?? []
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Data anggota gagal dimuat.',
        })
      } finally {
        this.loading = false
      }
    },

    async saveData() {
      this.saving = true
      try {
        const response = await api.post('/v2/club/anggota', this.form)
        Notify.create({
          type: 'positive',
          message: response.data?.message || 'Anggota berhasil disimpan.',
        })
        this.resetForm()
        return true
      } catch (error) {
        const errors = error.response?.data?.errors
        Notify.create({
          type: 'negative',
          message:
            errors?.name?.[0] ||
            errors?.email?.[0] ||
            errors?.nik?.[0] ||
            errors?.tanggal_lahir?.[0] ||
            errors?.jenis_kelamin?.[0] ||
            errors?.no_hp?.[0] ||
            error.response?.data?.message ||
            'Anggota gagal disimpan.',
        })
        return false
      } finally {
        this.saving = false
      }
    },

    resetForm() {
      this.form.name = ''
      this.form.email = ''
      this.form.nik = ''
      this.form.tanggal_lahir = ''
      this.form.jenis_kelamin = ''
      this.form.no_hp = ''
    },
  },
})
