<template>
  <div class="background-container">
    <!-- Logo de Log Out -->
    <img 
      src="@/assets/out.png" 
      alt="Log Out" 
      class="logout-logo" 
      @click="logout" 
    />
    <!-- Barra Superior -->
    <header class="header">
      <h1>Amigos Net - Moderator Dashboard</h1>
    </header>

    <!-- Contenedor principal -->
    <div class="main-content">
      <!-- Sección para crear nuevo post -->
      <section class="create-post-section">
        <h2>Create a New Post</h2>
        <form @submit.prevent="createPost">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="title" required />
            <p v-if="errors.title" class="error">{{ errors.title }}</p>
          </div>

          <div class="form-group">
            <label for="body">Body:</label>
            <textarea id="body" v-model="body" rows="6" required></textarea>
            <p v-if="errors.body" class="error">{{ errors.body }}</p>
          </div>

          <div class="form-group">
            <label for="publishDate">Publish Date:</label>
            <input type="date" id="publishDate" v-model="publishDate" class="date-picker" required />
            <p v-if="errors.publishDate" class="error">{{ errors.publishDate }}</p>
          </div>

          <!-- Botones de acción -->
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
          <p><strong>Publish Date:</strong> {{ publishDate ? new Date(publishDate).toLocaleDateString() : 'No date provided' }}</p>
          <div class="form-buttons">
            <button @click="submitPost" class="action-button">Submit Post</button>
            <button @click="cancelPreview" class="action-button">Cancel</button>
          </div>
        </div>
      </section>

      <!-- Sección de posts de todos los usuarios -->
      <section class="posts-section">
        <h2>All Posts</h2>
        <ul>
          <li v-for="post in posts" :key="post.id" class="post-item">
            <h3>{{ post.title }}</h3>
            <p class="post-body">{{ post.body }}</p>
            <p><em>Publish Date: {{ formatDate(post.publishDate) }}</em></p>
            <p><em>Author: {{ post.authorName }}</em></p>
            <p><em>Status: {{ post.status }}</em></p>
            <p><strong>Likes: {{ post.likes.length }}</strong></p>

            <!-- Mostrar comentarios -->
            <p><strong>Comments:</strong></p>
            <ul>
              <li v-for="comment in post.comments" :key="comment.id">
                <p>{{ comment.content }} - {{ formatDate(comment.createdAt) }}</p>
              </li>
            </ul>

            <div class="post-buttons">
              <button @click="editPost(post)" class="action-button">Edit</button>
              <button @click="confirmDeletePost(post)" class="action-button">Delete</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Modal para Confirmación de Eliminación -->
      <div v-if="showDeleteModal" class="modal">
        <p>Are you sure you want to delete this post?</p>
        <div class="modal-buttons">
          <button @click="deletePost" class="action-button">Yes, Delete</button>
          <button @click="cancelDelete" class="action-button">Cancel</button>
        </div>
      </div>

      <!-- Mensajes de Éxito/Error -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
      errorMessage: '',
      posts: [], // Lista de todos los posts
      showDeleteModal: false,
      postToDelete: null,
    };
  },
  methods: {
    // Función de cierre de sesión
    logout() {
      localStorage.removeItem('userId'); // Limpiar el localStorage
      this.$router.push('/'); // Redirigir a la página de inicio o login
    },
    // Crear y previsualizar el post
    createPost() {
      this.clearErrors();
      if (!this.title || !this.body || !this.publishDate) {
        if (!this.title) this.errors.title = "The title is required.";
        if (!this.body) this.errors.body = "The body is required.";
        if (!this.publishDate) this.errors.publishDate = "The publish date is required.";
        return;
      }

      // Validar que el cuerpo del post tenga al menos 20 caracteres
      if (this.body.length < 20) {
        this.errors.body = "The body must have at least 20 characters.";
        return;
      }

      this.previewMode = true;
    },
    submitPost() {
      this.isSubmitting = true;
      const moderatorId = localStorage.getItem('userId'); // Obtener el ID del moderador desde localStorage

      // Verificar que el moderatorId sea válido antes de enviar la solicitud
      if (!moderatorId) {
        this.errorMessage = "Invalid moderator ID. Please try again.";
        this.isSubmitting = false;
        return;
      }
      // Formatear la fecha a 'YYYY-MM-DD'
      const formattedDate = new Date(this.publishDate).toISOString().split('T')[0];

      axios.post('http://localhost:5017/api/Posts', {
        title: this.title,
        body: this.body,
        publishDate: formattedDate,
        authorId: moderatorId // Incluir el moderatorId en la solicitud
      })
        .then(() => {
          this.successMessage = "Post created successfully!";
          this.resetForm();
          this.fetchPosts();
        })
        .catch((error) => {
          console.error('Error creating post:', error.response?.data || error);
          this.errorMessage = error.response?.data?.message || "Error creating post. Please try again.";
        })
        .finally(() => {
          this.isSubmitting = false;
          this.previewMode = false;
        });
    },
    // Listar todos los posts
    fetchPosts() {
      axios.get('http://localhost:5017/api/Posts')
        .then(response => {
          if (response.data && response.data.success) {
            this.posts = response.data.data;
          } else {
            this.errorMessage = response.data.message || "No posts found.";
            this.posts = [];
          }
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          this.errorMessage = "Error fetching posts.";
        });
    },
    // Editar post existente
    editPost(post) {
      this.title = post.title;
      this.body = post.body;
      this.publishDate = post.publishDate;
      this.previewMode = true;
    },
    // Confirmar y eliminar post
    confirmDeletePost(post) {
      this.showDeleteModal = true;
      this.postToDelete = post;
    },
    deletePost() {
      axios.delete(`http://localhost:5017/api/Posts/${this.postToDelete.id}`)
        .then(() => {
          this.successMessage = "Post deleted successfully!";
          this.fetchPosts();
        })
        .catch(() => {
          this.errorMessage = "Error deleting post. Please try again.";
        })
        .finally(() => {
          this.showDeleteModal = false;
          this.postToDelete = null;
        });
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.postToDelete = null;
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
      this.resetForm();
      this.previewMode = false;
    },
    // Función para formatear las fechas en el frontend
    formatDate(dateString) {
      if (!dateString) return 'No date provided';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchPosts();
  }
};
</script>
<style scoped>
/* Estilo del logo de Log Out */
.logout-logo {
  width: 40px; 
  height: auto; 
  cursor: pointer;
  position: relative;
  top: 40px; 
  left: 550px;
}

/* Barra superior */
.header {
  background-color: #1c1c1e;
  padding: 1.5rem;
  text-align: center;
  color: #fff;
  z-index: 2;
  position: relative;
}

.header h1 {
  font-size: 2.5rem;
  color: #f39c12;
  margin: 0;
}

/* Contenedor de fondo */
.background-container {
  background-image: url('@/assets/fondo1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* Contenedor principal */
.main-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
  z-index: 3;
  position: relative;
}

/* Sección de creación de posts */
.create-post-section {
  background: rgba(28, 28, 30, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 45%;
  margin-right: 20px;
  color: #fff;
  z-index: 4;
  position: relative;
}

.create-post-section h2 {
  font-size: 1.8rem;
  color: #f39c12;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  font-size: 16px;
  color: #ccc;
  margin-bottom: 8px;
  display: block;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2c2c2e;
  color: #fff;
  transition: border-color 0.3s;
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #f39c12;
  outline: none;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-button {
  padding: 10px 20px;
  background-color: #f39c12;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.action-button:hover {
  background-color: #e67e22;
  transform: scale(1.05);
}

/* Vista previa del post */
.preview {
  background: rgba(28, 28, 30, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
  color: #fff;
}

.preview h3 {
  color: #f39c12;
  margin-bottom: 10px;
}

/* Sección de posts */
.posts-section {
  background: rgba(28, 28, 30, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 50%;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  z-index: 10;
  position: relative;
}

.posts-section h2 {
  font-size: 1.8rem;
  color: #f39c12;
  margin-bottom: 20px;
}

.post-item {
  background: rgba(28, 28, 30, 0.85);
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.post-item h3 {
  font-size: 20px;
  color: #f39c12;
}

.post-item p {
  color: #fff;
}

.post-buttons {
  display: flex;
  justify-content: space-between;
}

.modal {
  background: rgba(28, 28, 30, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  width: 400px;
  margin: 0 auto;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.error {
  background-color: white;
  color: red;
  border: 2px solid red;
}

.success {
  background-color: white;
  color: green;
  border: 2px solid green;
}
</style>