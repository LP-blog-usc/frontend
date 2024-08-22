<template>
    <div class="background-container">
      <!-- Contenedor del fondo -->
      <div class="login-container">
        <!-- Contenedor del formulario de inicio de sesión -->
        <div class="login-box">
          <h2>Login</h2>
          <!-- Logo debajo del título -->
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="username">
                <i class="fas fa-user"></i> Username:
              </label>
              <input type="text" v-model="username" id="username" required />
            </div>
            <div class="form-group">
              <label for="password">
                <i class="fas fa-lock"></i> Password:
              </label>
              <input type="password" v-model="password" id="password" required />
            </div>
            <div class="form-group remember-me">
              <input type="checkbox" id="remember-me" />
              <label for="remember-me">Remember me</label>
            </div>
            <button type="submit" :disabled="isSubmitting">Login</button>
            <div class="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
            <div class="signup">
              New here? <a href="#">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        isSubmitting: false,
      };
    },
    methods: {
      login() {
        this.isSubmitting = true;
        // Lógica para el inicio de sesión
        // ...
        this.isSubmitting = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilo global para asegurar que el fondo cubra todo */
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  /* Eliminar espacio en blanco adicional */
  body {
    display: flex;
    justify-content: baseline;
    align-items: baseline;
  }
  
  /* Estilo del fondo */
  .background-container {
    background-image: url('@/assets/fondo1.png');
    width: 100%;
    height: auto; /* Mantiene la proporción original de la imagen */
    display: flex; /* Elimina el espacio en blanco debajo de la imagen */
    max-width: 3000px; /* Para limitar el tamaño máximo de la imagen */
  }
  
  /* Estilo del contenedor del login */
  .login-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  /* Caja del formulario */
  .login-box {
    background: rgba(0, 0, 0, 0.7);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    width: 300px;
    text-align: center;
  }
  
  .login-box h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }
  
  /* Logo debajo del título */
  .logo {
    max-width: 100px;
    margin: 10px 0 20px 0;
  }
  
  /* Estilo de los campos del formulario */
  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }
  
  .form-group label {
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
    color: #ccc;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background: #333;
    color: white;
  }
  
  .form-group input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  /* Estilo del checkbox */
  .remember-me {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  
  .remember-me input {
    margin-right: 10px;
  }
  
  /* Botón de inicio de sesión */
  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #555;
  }
  
  /* Estilo del enlace "Forgot your password?" */
  .forgot-password {
    margin-top: 10px;
  }
  
  .forgot-password a {
    color: #007bff;
    font-size: 14px;
  }
  
  /* Estilo del enlace "Sign Up" */
  .signup {
    margin-top: 20px;
    font-size: 14px;
  }
  
  .signup a {
    color: #007bff;
    font-weight: 600;
  }
  </style>
  
  