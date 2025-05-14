<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.content }}
      </div>
    </div>

    <div class="message-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message..."
        @keydown.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL)

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      username: 'YourUsername', // Replace with actual username or get from auth
    }
  },
  mounted() {
    // Fetch message history on component mount
    fetch(`${import.meta.env.VITE_API_URL}/api/messages`)
      .then((res) => res.json())
      .then((data) => {
        this.messages = data
      })

    // Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      this.messages.push(msg)
    })
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        socket.emit('sendMessage', {
          sender: this.username,
          content: this.newMessage,
        })
        this.newMessage = '' // Clear the input field after sending
      }
    },
  },
}
</script>

<style scoped>
.chat-container {
  width: 400px;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 8px;
  padding: 5px;
  border-radius: 4px;
}

.message strong {
  color: #007bff;
}

.message-input {
  display: flex;
  gap: 10px;
}

.message-input input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.message-input button {
  padding: 8px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #0056b3;
}
</style>
