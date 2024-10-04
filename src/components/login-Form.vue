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
      <!-- Contenedor del formulario de login -->
      <div class="login-container">
        <div class="login-box">
          <h2>Login</h2>
          <!-- Contenedor del logo ajustado -->
          <div class="logo-container">
            <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
          </div>
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">
                <i class="fas fa-user"></i> email:
              </label>
              <input type="text" v-model="email" id="email" required />
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
              New here? <router-link :to="{ name: 'UserRegister' }">Sign Up</router-link>
            </div>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '', // El campo para el email del usuario
      password: '', // El campo para la contraseña del usuario
      isSubmitting: false, // Estado para deshabilitar el botón mientras se procesa
      errorMessage: '', // Para almacenar mensajes de error en caso de fallo
    };
  },
  methods: {
    // Método que se ejecuta cuando el formulario es enviado
    async login() {
      // Validamos que ambos campos estén completos antes de enviar la solicitud
      if (!this.email || !this.password) {
        this.errorMessage = 'Please provide both email and password.';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';

      // Datos del formulario (email y contraseña)
      const loginData = {
        email: this.email,
        password: this.password,
      };

      // Hacemos la solicitud POST a la API de login
      try {
        const response = await axios.post('http://localhost:5017/api/Auth/login', loginData);
        
        // Verificamos si la respuesta fue exitosa
        if (response.data.success) {
          const { roleId, userId } = response.data.data;
          console.log(`User ID: ${userId}, Role ID: ${roleId}`);
          
          // Guardamos los datos del usuario en el localStorage
          localStorage.setItem('userId', userId);
          localStorage.setItem('roleId', roleId);
          
          // Redirigimos al usuario a la página correspondiente según su rol
          if (roleId === 2) {
            this.$router.replace({ name: 'AuthorDashboard' });
          } else if (roleId === 3) {
            this.$router.replace({ name: 'ReaderDashboard' });
          } else if (roleId === 1) {
            this.$router.replace({ name: 'ModeratorDashboard' });
          } else {
            this.errorMessage = 'Unknown role. Please contact support.';
          }
        } else {
          // Si el login falla, mostramos el mensaje de error del backend
          this.errorMessage = response.data.message || 'Login failed. Please check your credentials.';
          this.password = '';
        }
      } catch (error) {
        // En caso de error en la solicitud, mostramos un mensaje genérico
        if (error.response && error.response.status === 400) {
          this.errorMessage = 'Invalid email or password.';
          this.password = '';
        } else {
          this.errorMessage = 'Error logging in. Please try again later.';
          this.password = '';
        }
        console.error('Login error:', error);
      } finally {
        this.isSubmitting = false; // Restauramos el estado para habilitar el botón de login
        this.password = '';
      }
    }
  }
};
</script>

<style scoped>
/* Barra superior */
.header {
  background-color: #1c1c1e;
  padding: 1.5rem 2.5rem; 
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

/* Estilos del navbar */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo h1 {
  font-size: 3rem; /* Aumento del tamaño de la fuente */
  margin: 0;
  font-weight: 700;
  color: #f39c12;
}

/* Contenedor de fondo */
.background-container {
  background-image: url('@/assets/fondo1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; 
}

/* Contenedor del formulario de login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 20px;
}

/* Caja del formulario de login */
.login-box {
  background: rgba(28, 28, 30, 0.95); /* Aumenta la opacidad para mayor contraste */
  padding: 60px; /* Aumenta el padding para más espacio interno */
  border-radius: 15px; /* Bordes más redondeados */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); /* Sombra más pronunciada */
  width: 100%;
  max-width: 420px; /* Aumenta el ancho máximo */
  text-align: center;
  color: #fff;
}

/* Título del formulario */
.login-box h2 {
  margin-bottom: 35px; /* Aumenta el espacio inferior */
  font-size: 28px; /* Aumenta el tamaño de la fuente */
  font-weight: 700;
  color: #f39c12;
}

/* Contenedor del logo */
.logo-container {
  width: 100%;
  max-width: 180px; /* Aumenta el tamaño máximo del contenedor del logo */
  margin: 0 auto 35px auto; /* Centra y ajusta el margen inferior */
}

/* Imagen del logo */
.logo-image {
  width: 100%; /* Asegura que el logo ocupe el 100% del contenedor */
  height: auto; /* Mantiene la proporción del logo */
}

/* Grupos de formulario */
.form-group {
  margin-bottom: 25px;
  text-align: left;
}

/* Etiquetas de los formularios */
.form-group label {
  font-size: 16px; 
  color: #ccc;
  display: block;
  margin-bottom: 8px;
}

/* Entradas del formulario */
.form-group input {
  width: 100%;
  padding: 14px; 
  border-radius: 8px; 
  border: 1px solid #555;
  background: #2c2c2e;
  color: #fff;
  transition: border-color 0.3s;
  font-size: 16px; 
}

/* Entrada en foco */
.form-group input:focus {
  border-color: #f39c12;
  outline: none;
}

/* Casilla "Remember me" */
.remember-me {
  display: flex;
  align-items: center;
  font-size: 25px; /* Aumenta ligeramente el tamaño de la fuente */
  color: #ccc;
  margin-top: 20px;
}

.remember-me input {
  margin-right: 10px; 
  width: 23px; 
  height: 23px;
}

/* Botón de acción (Login) */
.action-button {
  width: 100%;
  padding: 14px; /* Aumenta el padding */
  border: none;
  border-radius: 8px; /* Bordes más redondeados */
  background-color: #f39c12;
  color: #fff;
  font-size: 18px; /* Mantiene el tamaño de la fuente consistente */
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 20px; /* Aumenta el espacio superior */
}

/* Hover en botón */
.action-button:hover {
  background-color: #d35400;
  transform: scale(1.05); /* Aumenta ligeramente el efecto de escala */
}

/* Botón deshabilitado */
button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

/* Enlace "Forgot your password?" */

.forgot-password {
  margin-top: 15px; /* Añade espacio superior */
  margin-bottom: 15px; /* Añade espacio inferior */
}

.forgot-password a {
  color: #f39c12;
  font-size: 20px;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: #d35400;
}

/* Enlace "Sign Up" */
.signup a {
  color: #f39c12;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s;
  margin-top: 15px;
}

.signup a:hover {
  color: #d35400;
}
.error {
  color: red;
}

.success {
  color: green;
}
</style>