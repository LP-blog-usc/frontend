<template>
  <div class="reset-password-container">
    <h2>Restablecer Contraseña</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <button type="submit" :disabled="isSubmitting">Enviar Solicitud</button>
    </form>
    <div v-if="message" :class="{'success-message': isSuccess, 'error-message': !isSuccess}">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      isSubmitting: false,
      message: '',
      isSuccess: false
    };
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.message = '';
      try {
        const response = await axios.post('https://api.example.com/reset-password', {
          email: this.email
        });
        this.message = 'Solicitud enviada con éxito. Revisa tu correo electrónico.';
        this.isSuccess = true;
      } catch (error) {
        this.message = 'Ocurrió un error. Por favor, intenta de nuevo.';
        this.isSuccess = false;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
}

.success-message {
  margin-top: 20px;
  color: green;
  font-weight: bold;
}

.error-message {
  margin-top: 20px;
  color: red;
  font-weight: bold;
}
</style>
