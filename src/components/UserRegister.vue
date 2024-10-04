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
      <!-- Contenedor del formulario de registro -->
      <div class="register-container">
        <div class="register-box">
          <h2>Register</h2>
          <!-- Contenedor del logo ajustado -->
          <div class="logo-container">
            <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
          </div>
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="name">
                <i class="fas fa-user"></i> Name:
              </label>
              <input type="text" v-model="name" id="name" required />
            </div>
            <div class="form-group">
              <label for="lastName">
                <i class="fas fa-user"></i> Last Name:
              </label>
              <input type="text" v-model="lastName" id="lastName" required />
            </div>
            <div class="form-group">
              <label for="email">
                <i class="fas fa-envelope"></i> Email:
              </label>
              <input type="email" v-model="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="telephoneNumber">
                <i class="fas fa-phone"></i> Telephone Number:
              </label>
              <input type="text" v-model="telephoneNumber" id="telephoneNumber" required />
              <p v-if="errors.telephoneNumber" class="error">{{ errors.telephoneNumber[0] }}</p>
            </div>
            <div class="form-group">
              <label for="password">
                <i class="fas fa-lock"></i> Password:
              </label>
              <input type="password" v-model="password" id="password" required />
            </div>
            <div class="form-group">
              <label for="confirm-password">
                <i class="fas fa-lock"></i> Confirm Password:
              </label>
              <input type="password" v-model="confirmPassword" id="confirm-password" required />
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select v-model="roleId" id="role" required>
                <option value="" disabled selected>Select a role</option>
                <option value="2">Author</option>
                <option value="3">Reader</option>
              </select>
            </div>

            <!-- Contenedor para los botones -->
            <div class="form-buttons">
              <button type="submit" :disabled="isSubmitting" class="action-button">Register</button>
              <button type="button" @click="goBack" class="action-button">Back</button>
            </div>
          </form>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
      name: '',
      lastName: '',
      email: '',
      telephoneNumber: '',
      password: '',
      confirmPassword: '',
      roleId: '', // rolId basado en selección (2 para Autor, 3 para Lector)
      isSubmitting: false,
      errorMessage: '',
      errors: {} // Objeto para almacenar los errores de validación
    };
  },
  methods: {
    async register() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.errors = {}; // Limpiar errores previos

      // Validar que los campos requeridos están completos
      if (
        !this.name ||
        !this.lastName ||
        !this.email ||
        !this.telephoneNumber ||
        !this.password ||
        !this.confirmPassword ||
        !this.roleId
      ) {
        this.errorMessage = 'Please fill in all the fields.';
        this.isSubmitting = false;
        return;
      }

      // Validar que las contraseñas coincidan
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        this.isSubmitting = false;
        return;
      }

      // Datos del formulario de registro
      const registerData = {
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        telephoneNumber: this.telephoneNumber,
        password: this.password,
        roleId: this.roleId === 'Author' ? 2 : 3, // Asignar rolId en función de la selección
      };

      // Hacer solicitud POST a la API de registro
      try {
        const response = await axios.post('http://localhost:5017/api/Users', registerData);

        // Verificar respuesta exitosa
        if (response.data.success) {
          console.log('User registered:', response.data.data);
          this.$router.replace({ name: 'LoginForm' }); // Redirigir al login
        } else {
          this.errorMessage = response.data.message || 'Error registering user.';
        }
      } catch (error) {
        // En caso de error, mostrar los errores específicos de cada campo
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors; // Guardar todos los errores en el objeto 'errors'
        } else {
          this.errorMessage = 'Error registering user. Please try again.';
        }
        console.error('Register error:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    goBack() {
      this.$router.replace({ name: 'LoginForm' }); // Redirigir al login
    },
  },
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

.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  color: #f39c12;
}

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

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 20px;
}

.register-box {
  background: rgba(28, 28, 30, 0.95);
  padding: 60px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 420px;
  text-align: center;
  color: #fff;
}

.register-box h2 {
  margin-bottom: 35px;
  font-size: 28px;
  font-weight: 700;
  color: #f39c12;
}

.logo-container {
  width: 100%;
  max-width: 180px;
  margin: 0 auto 35px auto;
}

.logo-image {
  width: 100%;
  height: auto;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

.form-group label {
  font-size: 16px;
  color: #ccc;
  display: block;
  margin-bottom: 8px;
}

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

.form-group input:focus {
  border-color: #f39c12;
  outline: none;
}

/* Estilos para los botones */
.form-buttons {
  display: flex;
  justify-content: space-between;
}

.action-button {
  width: 48%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #f39c12;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.action-button:hover {
  background-color: #d35400;
  transform: scale(1.05);
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

/* Estilo para el selector de Rol */
.form-group select {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #555;
  background: #2c2c2e;
  color: #fff;
  transition: border-color 0.3s;
  font-size: 16px;
  appearance: none; 
}

.form-group select:focus {
  border-color: #f39c12;
  outline: none;
}

</style>
