<template>
  <div>
    <!-- Barra Superior -->
    <header class="header">
      <nav class="navbar">
        <div class="logo">
          <h1>Amigos Net - Panel de Autor</h1>
        </div>
      </nav>
    </header>

    <!-- Crear Nuevo Post -->
    <section class="post-section">
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
          <input type="date" id="publishDate" v-model="publishDate" required />
          <p v-if="errors.publishDate" class="error">{{ errors.publishDate }}</p>
        </div>

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
    </section>

    <!-- Listado de Posts -->
    <section class="posts-section">
      <h2>Your Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.body }}</p>
          <p><em>Publish Date: {{ post.publishDate }}</em></p>
          <button @click="editPost(post)" class="action-button">Edit</button>
          <button @click="confirmDeletePost(post)" class="action-button">Delete</button>
        </li>
      </ul>
    </section>

    <!-- Modal para Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="modal">
      <p>Are you sure you want to delete this post?</p>
      <button @click="deletePost" class="action-button">Yes, Delete</button>
      <button @click="cancelDelete" class="action-button">Cancel</button>
    </div>

    <!-- Mensajes de Éxito/Error -->
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // Campos del post
      title: '',
      body: '',
      publishDate: '',
      errors: {},
      isSubmitting: false,
      previewMode: false,
      successMessage: '',
      errorMessage: '',
      posts: [], // Lista de posts del autor
      showDeleteModal: false,
      postToDelete: null,
    };
  },
  methods: {
    // Crear y previsualizar el post
    createPost() {
      this.clearErrors();
      if (!this.title || !this.body || !this.publishDate) {
        if (!this.title) this.errors.title = "The title is required.";
        if (!this.body) this.errors.body = "The body is required.";
        if (!this.publishDate) this.errors.publishDate = "The publish date is required.";
        return;
      }
      this.previewMode = true;
    },
    submitPost() {
      this.isSubmitting = true;
      axios.post('http://localhost:5017/api/Posts', {
        title: this.title,
        body: this.body,
        publishDate: this.publishDate
      })
        .then(() => {
          this.successMessage = "Post created successfully!";
          this.resetForm();
          this.fetchPosts();
        })
        .catch(() => {
          this.errorMessage = "Error creating post. Please try again.";
        })
        .finally(() => {
          this.isSubmitting = false;
          this.previewMode = false;
        });
    },
  // Listar posts del autor
  fetchPosts() {
  const userId = localStorage.getItem('userId');
  const roleId = localStorage.getItem('roleId');
  
  if (roleId !== "1") { // Si no es autor, mostrar un error o redirigir
    this.errorMessage = "You do not have permission to access this page.";
    return;
  }
  
  axios.get(`http://localhost:5017/api/Posts/author/${parseInt(userId)}`)
    .then(response => {
      if (response.data && response.data.success) {
        this.posts = response.data.data;
      } else {
        this.errorMessage = response.data.message || "No posts found for this author.";
      }
    })
    .catch(error => {
      console.error(error);
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
      this.$router.push({ name: 'AuthorDashboard' });
    }
  },
  mounted() {
    this.fetchPosts();
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

.header .logo h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  color: #f39c12;
}

/* Sección principal para formularios y listas */
.post-section,
.posts-section {
  background: rgba(28, 28, 30, 0.95);
  margin: 20px auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 600px;
  color: #fff;
  text-align: center;
}

.post-section h2,
.posts-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #f39c12;
  margin-bottom: 20px;
}

/* Estilos del formulario */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  font-size: 15px;
  color: #ccc;
  display: block;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #555;
  background: #2c2c2e;
  color: #fff;
  transition: border-color 0.3s;
  font-size: 15px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #f39c12;
  outline: none;
}

/* Botones de acción */
.action-button {
  width: 48%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f39c12;
  color: #fff;
  font-size: 16px;
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

/* Vista previa del post */
.preview {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.1);
}

.preview h3 {
  color: #f39c12;
  margin-bottom: 10px;
}

/* Listado de posts */
.posts-section ul {
  list-style-type: none;
  padding: 0;
}

.posts-section li {
  background: rgba(28, 28, 30, 0.85);
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.posts-section h3 {
  font-size: 20px;
  color: #f39c12;
  margin: 0 0 10px;
}

/* Modal de confirmación de eliminación */
.modal {
  background: rgba(28, 28, 30, 0.95);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  width: 300px;
  margin: 50px auto;
  text-align: center;
}

.modal p {
  color: #fff;
  margin-bottom: 20px;
}

/* Mensajes de error y éxito */
.error {
  color: red;
}

.success {
  color: green;
}
</style>

