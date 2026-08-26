<template>
  <main class="login-page">
    <div class="login-shell">
      <section class="login-hero">
        <div class="hero-glow hero-glow--top" />
        <div class="hero-glow hero-glow--bottom" />
        <div class="domino domino--one"><span /><span /></div>
        <div class="domino domino--two"><span /><span /></div>

        <div class="brand-block">
          <img
            class="brand-logo"
            src="@/assets/orado/logo-white.svg"
            alt="Logo resmi ORADO"
          />
          <p class="brand-subtitle">Club Management</p>
          <p class="brand-location">Kota Probolinggo</p>
        </div>
      </section>

      <LoginForm />
    </div>
  </main>
</template>

<script setup>
import LoginForm from './comp/LoginForm.vue'
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #f1f5f2;
}

.login-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #fff;
}

.login-hero {
  position: relative;
  display: flex;
  min-height: 43vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 56px 28px 88px;
  background:
    radial-gradient(circle at 84% 8%, rgba(75, 186, 118, 0.32), transparent 28%),
    linear-gradient(150deg, #013b2b 0%, #006844 62%, #078151 100%);
}

.brand-block {
  position: relative;
  z-index: 2;
  text-align: center;
}

.brand-logo {
  display: block;
  width: min(184px, 48vw);
  max-height: 176px;
  margin: 0 auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

.brand-subtitle {
  margin: 11px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
}

.brand-location {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.055);
}

.hero-glow--top {
  width: 220px;
  height: 220px;
  top: -115px;
  left: -72px;
}

.hero-glow--bottom {
  width: 280px;
  height: 280px;
  right: -130px;
  bottom: -155px;
}

.domino {
  position: absolute;
  display: flex;
  width: 38px;
  height: 72px;
  flex-direction: column;
  opacity: 0.08;
  border: 2px solid #fff;
  border-radius: 8px;
  transform: rotate(-24deg);
}

.domino::after {
  position: absolute;
  top: 50%;
  right: 4px;
  left: 4px;
  height: 1px;
  content: '';
  background: #fff;
}

.domino span::before,
.domino span::after {
  position: absolute;
  width: 4px;
  height: 4px;
  content: '';
  border-radius: 50%;
  background: #fff;
}

.domino span:first-child::before { top: 10px; left: 8px; }
.domino span:first-child::after { top: 24px; right: 8px; }
.domino span:last-child::before { right: 8px; bottom: 10px; }
.domino span:last-child::after { bottom: 24px; left: 8px; }
.domino--one { top: 16%; left: 8%; }
.domino--two { right: 8%; bottom: 19%; transform: rotate(25deg) scale(0.8); }

@media (min-width: 600px) {
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
  }

  .login-shell {
    width: 420px;
    min-height: min(820px, calc(100vh - 60px));
    border-radius: 28px;
    box-shadow: 0 24px 70px rgba(5, 52, 37, 0.16);
  }

  .login-hero {
    min-height: 350px;
  }
}
</style>
