<template>
  <div class="profile-page">
    <h2>Profile</h2>

    <div v-if="user">
      <div class="profile-item">
        <label>Username</label>
        <input type="text" v-model="user.username" />
      </div>

      <div class="profile-item">
        <label>Email</label>
        <input type="email" v-model="user.email" />
      </div>

      <button @click="updateProfile" class="btn-save">Save Changes</button>
      <button @click="logout" class="btn-logout">Logout</button>

      <p v-if="message" class="success-msg">{{ message }}</p>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      message: '',
      error: '',
    }
  },
  async mounted() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        this.user = data
      } else {
        this.error = 'You are not logged in'
        this.$router.push('/user-login')
      }
    } catch (err) {
      this.error = 'Error loading profile'
    }
  },
  methods: {
    async updateProfile() {
      this.error = ''
      this.success = ''

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            username: this.user.username,
            email: this.user.email,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          this.success = 'Profile updated successfully'
        } else {
          this.error = data.message || 'Update failed'
        }
      } catch (err) {
        this.error = 'Server error'
      }
    },

    logout() {
      localStorage.removeItem('token')
      this.$router.push('/user-login')
    },
  },
}
</script>

<style scoped>
.profile-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
}
.profile-item {
  margin-bottom: 12px;
}
.btn-save {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  margin-right: 10px;
  cursor: pointer;
}
.btn-logout {
  background-color: crimson;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.success-msg {
  color: green;
  margin-top: 10px;
}
.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
