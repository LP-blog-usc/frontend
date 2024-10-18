<template>
  <div class="background-container">
    <!-- Barra Superior -->
    <header class="header">
      <h1>Amigos Net - Author Panel</h1>
    </header>

    <!-- Contenedor principal que contiene formulario y posts -->
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
            <input type="date" id="publishDate" v-model="publishDate" required />
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
          <p><strong>Publish Date:</strong> {{ publishDate }}</p>
          <div class="form-buttons">
            <button @click="submitPost" class="action-button">Submit Post</button>
            <button @click="cancelPreview" class="action-button">Cancel</button>
          </div>
        </div>
      </section>

      <!-- Sección de posts -->
      <section class="posts-section">
  <h2>Your Posts</h2>
  <ul>
    <li v-for="post in posts" :key="post.id" class="post-item">
      <h3>{{ post.title }}</h3>
      <p class="post-body">{{ post.body }}</p>
      <p><em>Publish Date: {{ post.publishDate }}</em></p>
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
      // Campos del post
      title: '',
      body: '',
      publishDate: new Date().toISOString().substr(0, 10),
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

      // Validar que el cuerpo del post tenga al menos 20 caracteres
      if (this.body.length < 20) {
        this.errors.body = "The body must have at least 20 characters.";
        return;
      }

      this.previewMode = true;
    },
    submitPost() {
      this.isSubmitting = true;
      const authorId = parseInt(localStorage.getItem('userId')); // Obtener el ID del autor desde localStorage

      // Verificar que el authorId sea válido antes de enviar la solicitud
      if (!authorId) {
        this.errorMessage = "Invalid author ID. Please try again.";
        this.isSubmitting = false;
        return;
      }

      // Formatear la fecha a 'YYYY-MM-DD'
      const formattedDate = new Date(this.publishDate).toISOString().split('T')[0];

      axios.post('http://localhost:5017/api/Posts', {
        title: this.title,
        body: this.body,
        publishDate: formattedDate,
        authorId: authorId // Incluir el authorId en la solicitud
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
  if (!post || !post.id) {
    this.errorMessage = "Post ID is missing. Cannot delete the post.";
    setTimeout(() => {
      this.errorMessage = ""; // Limpiar el mensaje después de 5 segundos
    }, 5000);
    return;
  }

  console.log("Post seleccionado para eliminar:", post); // Debug

  this.showDeleteModal = true;
  this.postToDelete = post;
},

deletePost() {
  if (!this.postToDelete || !this.postToDelete.id) {
    this.errorMessage = "Post ID is missing. Cannot delete the post.";
    setTimeout(() => {
      this.errorMessage = ""; // Limpia el mensaje de error después de 5 segundos
    }, 5000);
    return;
  }

  axios.delete(`http://localhost:5017/api/Posts/${this.postToDelete.id}`)
    .then(() => {
      this.successMessage = "Post deleted successfully!";
      setTimeout(() => {
        this.successMessage = ""; // Limpia el mensaje de éxito después de 5 segundos
      }, 5000);
      this.fetchPosts(); // Actualiza los posts
    })
    .catch(() => {
      this.errorMessage = "Error deleting post. Please try again.";
      setTimeout(() => {
        this.errorMessage = ""; // Limpia el mensaje de error después de 5 segundos
      }, 5000);
    })
    .finally(() => {
      this.showDeleteModal = false;
      this.postToDelete = null;
    });
},

cancelDelete() {
  this.showDeleteModal = false;
  this.postToDelete = null; // Restablecer la selección de post a null
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
  padding: 1.5rem;
  text-align: center;
  color: #fff;
  z-index: 2; /* Asegura que esté en un nivel superior */
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
  position: relative; /* Asegura que los elementos dentro no se superpongan */
  z-index: 1; /* Coloca el fondo detrás de los elementos principales */
}

/* Contenedor principal para dividir secciones */
.main-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin-top: 40px;
  z-index: 3; /* Asegura que el contenido esté por encima del fondo */
  position: relative; /* Establece el contexto para el z-index dentro del contenido */
}

/* Sección de crear nuevo post (fijo en la izquierda) */
.create-post-section {
  background: rgba(28, 28, 30, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  width: 45%;
  margin-right: 20px;
  color: #fff;
  z-index: 4; /* Coloca esta sección por encima del fondo */
  position: relative; /* Asegura que esta sección esté posicionada por encima del fondo */
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
  z-index: 10; /* Aseguramos que esté en frente */
  position: relative; /* Para que el z-index tenga efecto */
}

/* Cada post en la lista */
.post-item {
  background: rgba(28, 28, 30, 0.85);
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 20; /* Este valor debe ser mayor para que esté sobre los otros */
}

/* Estilo del cuerpo del post para asegurar visibilidad */
.post-body {
  white-space: pre-wrap; /* Asegura que los saltos de línea sean respetados */
  word-wrap: break-word; /* Rompe las palabras largas para evitar que salgan del contenedor */
  color: #fff; /* Asegura que el texto sea visible en el fondo oscuro */
  margin-bottom: 10px; /* Añade un margen inferior para separar del siguiente elemento */
  position: relative; /* Aseguramos que sea parte del flujo normal */
  z-index: 25; /* Nos aseguramos que el texto esté por encima del fondo */
}
/* Texto dentro del post */
.post-item h3, .post-item p {
  position: relative;
  z-index: 20; /* Asegura que el texto esté en una capa superior */
  color: white; /* Asegúrate de que el texto sea visible sobre el fondo oscuro */
}

h2 {
  z-index: 20; /* Asegura que el título también esté visible */
  position: relative;
  color: #f39c12
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

/* Botones */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
/* Botones de los posts */
.post-buttons {
  display: flex;
  justify-content: space-between;
}

.action-button {
  width: 45%; /* Ajusta el tamaño de los botones */
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f39c12;
  color: #fff;
  font-size: 16px;
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
  z-index: 5; /* Asegura que la vista previa esté por encima de todo */
  position: relative; /* Contexto para que no se superponga */
}

/* Estilo de los posts */
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
  margin: 0 0 10px;
}

/* Estilo del modal */
.modal {
  background: rgba(28, 28, 30, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  width: 400px; /* Ajustamos el ancho */
  max-width: 90%; /* Permite que se ajuste a pantallas más pequeñas */
  margin: 0 auto; /* Asegura que esté centrado horizontalmente */
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Lo centra en la pantalla */
  z-index: 1000; /* Lo mantiene al frente de todo */
}

/* Estilo para los botones dentro del modal */
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons .action-button {
  width: 48%; /* Asegura que ambos botones ocupen el mismo espacio */
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #f39c12;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.modal-buttons .action-button:hover {
  background-color: #d35400;
  transform: scale(1.05);
}


.modal p {
  color: #fff;
  margin-bottom: 20px;
}

/* Estilo para los mensajes de error y éxito (centrado) */
.success, .error {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 8px;
  font-size: 16px; /* Tamaño de fuente consistente */
  text-align: center;
  width: 300px; /* Ancho fijo, pero adaptable */
  max-width: 90%; /* Para pantallas pequeñas */
  z-index: 1000; /* Colocado por encima del contenido */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5); /* Sombra para darle efecto flotante */
}

/* Fondo blanco y color rojo para el error */
.error {
  background-color: white;
  color: red;
  border: 2px solid red;
}

/* Fondo blanco y color verde para el éxito */
.success {
  background-color: white;
  color: green;
  border: 2px solid green;
}
/* Animación para mostrar y luego ocultar los mensajes */
@keyframes fade-in-out {
  0% {
    opacity: 0; /* Inicialmente invisible */
  }
  5% {
    opacity: 1; /* Visible después del 10% del tiempo */
  }
  10% {
    opacity: 1; /* Mantener visible hasta el 90% del tiempo */
  }
  12% {
    opacity: 0; /* Finalmente invisible al 100% */
  }
}

</style>
