<template>
  <div>
    <!-- Barra Superior -->
    <header class="header">
      <nav class="navbar">
        <div class="logo">
          <h1>Amigos Net</h1>
        </div>
      </nav>
    </header>

    <!-- Contenido Principal -->
    <div class="background-container">
      <div class="login-container">
        <div class="login-box">
          <h2>Login</h2>
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
            <button type="submit" :disabled="isSubmitting" class="action-button">Login</button>
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
    }
  }
}
</script>

<style scoped>
/* Estilos de la barra superior */
.header {
  background-color: #333;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo {
  text-align: center;
}

.logo h1 {
  font-size: 2.5rem; /* Tamaño del h1 */
  margin: 0;
  font-weight: bold;
}

.background-container {
  background-image: url('@/assets/fondo1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
}

.login-container {
  height: 80vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

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

.logo {
  max-width: 100px;
  margin: 10px 0 20px 0;
}

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

.remember-me {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.remember-me input {
  margin-right: 10px;
}

.action-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.action-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

button:disabled {
  background-color: #555;
}

.forgot-password {
  margin-top: 10px;
}

.forgot-password a {
  color: #007bff;
  font-size: 14px;
}

.signup {
  margin-top: 20px;
  font-size: 14px;
}

.signup a {
  color: #007bff;
  font-weight: 600;
}
</style>
