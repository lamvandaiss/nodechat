<template>
  <div class="login-page">
    <h2>Login</h2>

    <form @submit.prevent="loginUser">
      <div class="login-item">
        <label>Email</label>
        <input type="email" v-model="email" />
        <span class="error" v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div class="login-item">
        <label>Password</label>
        <input type="password" v-model="password" />
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit" class="login-btn">Login</button>
    </form>

    <div v-if="serverError" class="error-message">
      <p>{{ serverError }}</p>
    </div>

    <p>Don’t have an account? <router-link to="/user-register">Register</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {},
      serverError: '',
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.errors.email = 'Invalid email format'
        isValid = false
      }

      if (!this.password) {
        this.errors.password = 'Password is required'
        isValid = false
      }

      return isValid
    },

    async loginUser() {
      this.serverError = ''
      if (!this.validateForm()) return

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          // Save token or session info
          localStorage.setItem('token', data.token)
          this.$router.push('/dashboard') // Redirect to dashboard or chat
        } else {
          this.serverError = data.error || 'Login failed'
        }
      } catch (err) {
        this.serverError = 'Server error: ' + err.message
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
input {
  width: 100%;
  padding: 8px;
}
.error {
  color: red;
  font-size: 13px;
  margin-bottom: 8px;
}
.error-message {
  color: red;
  margin-top: 15px;
}
.login-btn {
  padding: 10px 20px;
  background-color: green;
  border: none;
  margin-top: 15px;
  margin-bottom: 5px;
  color: white;
  cursor: pointer;
}
.login-item {
}
</style>
