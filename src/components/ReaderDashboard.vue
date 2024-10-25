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
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </head>
    <div class="posts-section">
      <h2>Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-body">{{ post.body }}</p>
          <p><em>Author: {{ post.authorName }}</em></p>
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
  background: rgba(28, 28, 30, 0.85);
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 20;
}

/* Estilo del cuerpo del post */
.post-body {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #fff;
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
  color: #fff;
}

/* Estilo del título de la sección de posts */
h2 {
  z-index: 20;
  position: relative;
  color: #f39c12;
}
</style>
