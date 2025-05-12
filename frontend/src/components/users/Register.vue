<template>
  <div class="register-page">
    <h2>Register</h2>

    <form @submit.prevent="registerUser">
      <div class="reg-item">
        <label>Username</label>
        <input type="text" v-model="user.username" />
        <span class="error" v-if="errors.username">{{ errors.username }}</span>
      </div>
      <div class="reg-item">
        <label>Email</label>
        <input type="email" v-model="user.email" />
        <span class="error" v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div class="reg-item">
        <label>Password</label>
        <input type="password" v-model="user.password" />
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>
      <div class="reg-item">
        <label>Confirm Password</label>
        <input type="password" v-model="user.confirmPassword" />
        <span class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
      </div>
      <button type="submit" class="frm-submit">Register</button>
    </form>

    <div v-if="serverError" class="error-message">
      <p>{{ serverError }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      errors: {},
      serverError: '',
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.user.username) {
        this.errors.username = 'Username is required'
        isValid = false
      }

      if (!this.user.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
        this.errors.email = 'Invalid email format'
        isValid = false
      }

      if (!this.user.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.user.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      if (this.user.confirmPassword !== this.user.password) {
        this.errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      return isValid
    },

    async registerUser() {
      this.serverError = ''

      if (!this.validateForm()) {
        return
      }

      const newUser = {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })

        const data = await res.json()

        if (res.ok) {
          this.$router.push('/user-login')
        } else {
          this.serverError = data.error || 'Registration failed!'
        }
      } catch (error) {
        this.serverError = 'Server error: ' + error.message
      }
    },
  },
}
</script>

<style scoped>
.register-page {
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
  margin-top: 5px;
}
.frm-submit {
  padding: 10px 20px;
  background-color: green;
  color: white;
  cursor: pointer;
  margin-top: 15px;
  border: none;
}
.reg-item {
  margin-bottom: 10px;
}
.reg-item input {
  margin-bottom: 0;
}
</style>
