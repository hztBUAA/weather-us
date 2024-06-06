<template>
  <div class="chat-box">
    <div ref="messageHistory" class="message-history">
      <el-card v-for="(message, index) in messages" :key="index" class="message-card">
        <p :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          {{ message.content }}
        </p>
      </el-card>
    </div>
    <el-input
      v-model="userInput"
      placeholder="输入消息..."
      class="input-area"
      @keyup.enter="sendMessage"
    />
    <el-button type="primary" class="send-button" @click="sendMessage">发送</el-button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      userInput: '',
      messages: []
    }
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() === '') return
      // Add user message to the history
      this.messages.push({ content: this.userInput, isUser: true })

      // Scroll to the bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // Get the bot's response
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: this.userInput,
            appid: 'YOUR_API_KEY', // Replace with your API key
            units: 'metric'
          }
        })
        const weatherData = response.data
        const botMessage = `温度：${weatherData.main.temp} °C\n天气：${weatherData.weather[0].description}\n湿度：${weatherData.main.humidity}%\n风速：${weatherData.wind.speed} m/s`
        this.messages.push({ content: botMessage, isUser: false })
      } catch (error) {
        this.messages.push({ content: '获取天气信息失败，请检查城市名是否正确', isUser: false })
      }

      // Clear user input
      this.userInput = ''

      // Scroll to the bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      const messageHistory = this.$refs.messageHistory
      messageHistory.scrollTop = messageHistory.scrollHeight
    }
  }
}
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-history {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message-card {
  margin-bottom: 10px;
}

.user-message {
  text-align: right;
  color: #409EFF;
}

.bot-message {
  text-align: left;
  color: #606266;
}

.input-area {
  margin-bottom: 10px;
}

.send-button {
  width: 100%;
}
</style>
