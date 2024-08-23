<template>
  <div>
    <!-- Barra Superior -->
    <!-- Sección de la cabecera que contiene el título "Amigos Net" -->
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
          <!-- Título del formulario de login -->
          <h2>Login</h2>
          <!-- Logo de la aplicación -->
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <!-- Formulario de login -->
          <form @submit.prevent="login">
            <div class="form-group">
              <!-- Campo para el nombre de usuario -->
              <label for="username">
                <i class="fas fa-user"></i> Username:
              </label>
              <input type="text" v-model="username" id="username" required />
            </div>
            <div class="form-group">
              <!-- Campo para la contraseña -->
              <label for="password">
                <i class="fas fa-lock"></i> Password:
              </label>
              <input type="password" v-model="password" id="password" required />
            </div>
            <div class="form-group remember-me">
              <!-- Checkbox para "Remember me" -->
              <input type="checkbox" id="remember-me" />
              <label for="remember-me">Remember me</label>
            </div>
            <!-- Botón de envío del formulario -->
            <button type="submit" :disabled="isSubmitting" class="action-button">Login</button>
            <div class="forgot-password">
              <!-- Enlace para "Forgot your password?" -->
              <a href="#">Forgot your password?</a>
            </div>
            <div class="signup">
              <!-- Enlace para "Sign Up" que usa Vue Router para redirigir -->
              New here? <router-link :to="{ name: 'UserRegister' }">Sign Up</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// El componente exportado incluye la lógica del formulario de login
export default {
  data() {
    return {
      // Variables reactivas que se usan para almacenar el nombre de usuario y la contraseña
      username: '',
      password: '',
      isSubmitting: false, // Controla el estado del botón de envío para evitar múltiples envíos
    };
  },
  methods: {
    // Método que se ejecuta al enviar el formulario
    login() {
      this.isSubmitting = true; // Desactiva el botón de envío para evitar clics múltiples
      // Lógica para el inicio de sesión iría aquí
      // Por ejemplo, enviar los datos a una API para autenticar al usuario
      this.isSubmitting = false; // Reactiva el botón después de completar la lógica
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

/* Configuración del navbar para centrar el contenido */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Alinea el logo en el centro */
.logo {
  text-align: center;
}

/* Estilos para el título (h1) de la cabecera */
.logo h1 {
  font-size: 2.5rem; /* Tamaño del h1 */
  margin: 0;
  font-weight: bold;
}

/* Estilos del contenedor de fondo */
.background-container {
  background-image: url('@/assets/fondo1.png'); /* Imagen de fondo */
  background-size: cover; /* Ajusta la imagen de fondo para cubrir todo el contenedor */
  background-position: center; /* Centra la imagen de fondo */
  background-repeat: no-repeat; /* Evita que la imagen de fondo se repita */
  width: 100%;
  height: 100vh; /* Ocupa toda la altura de la ventana */
  display: flex;
}

/* Contenedor para el formulario de login */
.login-container {
  height: 80vh; /* Ocupa el 80% de la altura de la ventana */
  width: 100vw; /* Ocupa todo el ancho de la ventana */
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  color: white;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Oculta cualquier desbordamiento */
}

/* Caja del formulario de login */
.login-box {
  background: rgba(0, 0, 0, 0.7); /* Fondo negro con transparencia */
  padding: 40px;
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Sombra alrededor del contenedor */
  width: 300px; /* Ancho fijo */
  text-align: center;
}

/* Estilo para el título del formulario de login */
.login-box h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

/* Estilo para la imagen del logo */
.logo {
  max-width: 100px; /* Ancho máximo de la imagen */
  margin: 10px 0 20px 0; /* Márgenes superior e inferior */
}

/* Estilo para el grupo de formularios */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

/* Estilo para las etiquetas del formulario */
.form-group label {
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
  color: #ccc;
}

/* Estilo para los campos de entrada del formulario */
.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #333; /* Fondo oscuro */
  color: white;
}

/* Estilo para el campo de entrada cuando está en foco */
.form-group input:focus {
  border-color: #007bff; /* Cambia el color del borde al estar en foco */
  outline: none;
}

/* Estilo para la casilla "Remember me" */
.remember-me {
  display: flex;
  align-items: center;
  font-size: 14px;
}

/* Estilo para la casilla de verificación de "Remember me" */
.remember-me input {
  margin-right: 10px;
}

/* Estilo para el botón de acción (Login) */
.action-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff; /* Color de fondo azul */
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s; /* Transición al pasar el ratón */
}

/* Estilo del botón cuando el usuario pasa el ratón por encima */
.action-button:hover {
  background-color: #0056b3; /* Cambia el color de fondo cuando se pasa el ratón */
  transform: scale(1.05); /* Efecto de aumento */
}

/* Estilo del botón cuando está deshabilitado */
button:disabled {
  background-color: #555; /* Color gris cuando está deshabilitado */
}

/* Estilo para el enlace "Forgot your password?" */
.forgot-password {
  margin-top: 10px;
}

/* Estilo para el enlace "Forgot your password?" */
.forgot-password a {
  color: #007bff;
  font-size: 14px;
}

/* Estilo para la sección "Sign Up" */
.signup {
  margin-top: 20px;
  font-size: 14px;
}

/* Estilo para el enlace "Sign Up" */
.signup a {
  color: #007bff;
  font-weight: 600; /* Hace que el texto sea más grueso */
}
</style>
