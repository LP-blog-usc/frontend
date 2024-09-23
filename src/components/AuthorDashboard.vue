<template>
  <div>
    <!-- Barra Superior -->
    <header class="header">
      <nav class="navbar">
        <div class="logo">
          <h1>Amigos Net - Create Post</h1>
        </div>
      </nav>
    </header>

    <!-- Contenido Principal -->
    <div class="background-container">
      <!-- Contenedor del formulario de creación de post -->
      <div class="post-container">
        <div class="post-box">
          <h2>Create a New Post</h2>
          <form @submit.prevent="createPost">
            <div class="form-group">
              <label for="title">
                <i class="fas fa-heading"></i> Title:
              </label>
              <input type="text" id="title" v-model="title" required />
              <p v-if="errors.title" class="error">{{ errors.title }}</p>
            </div>

            <div class="form-group">
              <label for="body">
                <i class="fas fa-align-left"></i> Body:
              </label>
              <textarea id="body" v-model="body" rows="6" required></textarea>
              <p v-if="errors.body" class="error">{{ errors.body }}</p>
            </div>

            <div class="form-group">
              <label for="publishDate">
                <i class="fas fa-calendar-alt"></i> Publish Date:
              </label>
              <input type="date" id="publishDate" v-model="publishDate" required />
              <p v-if="errors.publishDate" class="error">{{ errors.publishDate }}</p>
            </div>

            <!-- Botones -->
            <div class="form-buttons">
              <button type="submit" :disabled="isSubmitting" class="action-button">Preview</button>
              <button type="button" @click="goBack" class="action-button">Back</button>
            </div>
          </form>

          <!-- Vista previa del post -->
          <div v-if="previewMode" class="preview">
            <h3>Post Preview</h3>
            <p><strong>Title:</strong> {{ title }}</p>
            <p><strong>Body:</strong> {{ body }}</p>
            <p><strong>Publish Date:</strong> {{ publishDate }}</p>
            <div class="form-buttons">
              <button @click="submitPost" class="action-button">Submit Post</button>
              <button @click="cancelPreview" class="action-button">Cancel</button>
            </div>
          </div>

          <!-- Mensajes de éxito o error -->
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
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
      title: '',
      body: '',
      publishDate: '',
      errors: {},
      isSubmitting: false,
      previewMode: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    createPost() {
      this.clearErrors();

      // Validaciones de campos
      if (!this.title) {
        this.errors.title = "The title is required.";
      }
      if (!this.body) {
        this.errors.body = "The body is required.";
      }
      if (!this.publishDate) {
        this.errors.publishDate = "The publish date is required.";
      }

      // Si hay errores, no se permite continuar
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      // Activar el modo vista previa
      this.previewMode = true;
    },
    submitPost() {
      this.isSubmitting = true;

      const postData = {
        title: this.title,
        body: this.body,
        publishDate: this.publishDate
      };

       axios.post('https://tu-api-backend.com/api/posts', postData)
       // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.successMessage = "Post created successfully!";
          this.resetForm();
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.errorMessage = "Error creating post. Please try again.";
        })
        .finally(() => {
          this.isSubmitting = false;
          this.previewMode = false;
        });
    },
    clearErrors() {
      this.errors = {};
      this.successMessage = '';
      this.errorMessage = '';
    },
    resetForm() {
      this.title = '';
      this.body = '';
      this.publishDate = '';
    },
    cancelPreview() {
      this.previewMode = false;
    },
    goBack() {
      this.$router.push({ name: 'AuthorDashboard' });
    }
  }
};
</script>

<style scoped>
/* Estilos para mantener la consistencia con el formulario de login */

/* Barra superior */
.header {
  background-color: #1c1c1e;
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
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

/* Contenedor del formulario de post */
.post-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 20px;
}

.post-box {
  background: rgba(28, 28, 30, 0.95);
  padding: 60px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 500px;
  text-align: center;
  color: #fff;
}

.post-box h2 {
  margin-bottom: 35px;
  font-size: 28px;
  font-weight: 700;
  color: #f39c12;
}

/* Grupos de formulario */
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #555;
  background: #2c2c2e;
  color: #fff;
  transition: border-color 0.3s;
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus {
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

/* Estilo de los mensajes de error y éxito */
.error {
  color: red;
}

.success {
  color: green;
}

.preview {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
