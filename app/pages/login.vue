<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJaspelStore } from '~/stores/jaspelStore'

definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const store = useJaspelStore()

const username = ref('evaevianti')
const password = ref('*Eva6940#')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const config = useRuntimeConfig()
    const { data, error } = await useFetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (error.value) {
      errorMessage.value = error.value.data?.error || 'Login gagal. Periksa kembali username dan password Anda.'
    } else if (data.value?.token) {
      // In a real app we'd save this to a cookie via useCookie
      const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
      token.value = data.value.token
      
      // Store in simple state
      store.isAuthenticated.value = true
      
      // Redirect to main page
      router.push('/')
    }
  } catch (e) {
    errorMessage.value = 'Terjadi kesalahan jaringan.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <div class="glass-card">
      <div class="card-header">
        <div class="logo">🪪</div>
        <h1>SIPJASPEL</h1>
        <p>Sistem Informasi Pengelolaan Jasa Pelayanan</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Masukkan username" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <div class="input-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Masuk Aplikasi</span>
          <span v-else class="loader"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite alternate ease-in-out;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: #3b82f6;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: #8b5cf6;
  bottom: -150px;
  right: -100px;
  animation-delay: -5s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #10b981;
  top: 40%;
  left: 60%;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -50px) scale(1.1); }
  66% { transform: translate(-30px, 50px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  color: white;
}

.card-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo {
  font-size: 48px;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.card-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.card-header p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
}

.input-group input {
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  color: white;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.input-group input::placeholder {
  color: #64748b;
}

.input-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
  text-align: center;
}

.submit-btn {
  margin-top: 10px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  position: relative;
  overflow: hidden;
  height: 52px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  box-shadow: none;
  cursor: not-allowed;
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
