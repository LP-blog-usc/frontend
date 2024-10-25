<template>
  <div class="background-container">
    <!-- Logo de cierre de sesión -->
    <img 
        src="@/assets/out.png" 
        alt="Log Out" 
        class="logout-logo" 
        @click="logout" 
      />
    <!-- Título de la página -->
    <header class="header">
      <h1>Amigos Net - Reader Dashboard</h1>
    </header>
    <div class="posts-section">
      <h2>Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <!-- Título del post -->
          <h3 class="post-title">{{ post.title }}</h3>
          <!-- Cuerpo del post -->
          <p class="post-body">{{ post.body }}</p>
          <!-- Autor del post -->
          <p><em>Author: {{ post.authorName }}</em></p>
          <!-- Fecha de actualización del post -->
          <p><em>Updated at: {{ post.updatedAt }}</em></p>

          <!-- Mostrar estado del post -->
          <p><strong>Status:</strong> {{ post.status }}</p>

          <!-- Mostrar comentarios si existen -->
          <div v-if="post.comments.length > 0">
            <h4>Comments:</h4>
            <ul>
              <li v-for="comment in post.comments" :key="comment.createdAt">
                {{ comment.content }} - <em>{{ comment.createdAt }}</em>
              </li>
            </ul>
          </div>

          <!-- Mostrar número de likes -->
          <p><strong>Likes:</strong> {{ post.likes.length }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      posts: [], // Lista de posts
    };
  },
  methods: {
    // Función de cierre de sesión
    logout() {
      localStorage.removeItem('userId'); // Limpiar el localStorage
      this.$router.push('/'); // Redirigir a la página de inicio o login
    },
    // Obtener todos los posts
    fetchPosts() {
      axios.get('http://localhost:5017/api/Posts')
        .then(response => {
          if (response.data && response.data.success) {
            this.posts = response.data.data;
          } else {
            console.error('No posts found.');
          }
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    },
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

/* Resto de tus estilos... */
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

/* Cada post en la lista */
.post-item {
  background: rgba(40, 40, 40, 0.9); /* Cambié el color de fondo a más sólido */
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 20;
  color: #fff; /* Asegurarse de que el texto sea blanco para que sea legible */
}

/* Estilo del cuerpo del post */
.post-body {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #f0f0f0;
  margin-bottom: 10px;
  position: relative;
  z-index: 25;
}

/* Estilo del título del post */
h3.post-title {
  color: #f39c12 !important;
  z-index: 20;
}

.post-item p {
  position: relative;
  z-index: 20;
  color: #ddd; /* Hacer el texto un poco más claro */
}

.post-item h4 {
  color: #f39c12; /* Color para los títulos de comentarios */
}

/* Estilo del título de la sección de posts */
h2 {
  z-index: 20;
  position: relative;
  color: #f39c12;
}

/* Ajustes para mejorar visibilidad */
ul {
  padding-left: 20px;
}

li {
  list-style: disc;
  margin-bottom: 10px;
  color: #fff;
}
</style>
