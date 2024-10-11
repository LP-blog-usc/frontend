<template>
  <div class="background-container">
    <div class="posts-section">
      <h2>Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.body }}</p>
          <!-- Botón de Like -->
          <button @click="toggleLike(post)">
            <i :class="post.liked ? 'fa fa-heart liked' : 'fa fa-heart'"></i>
          </button>
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
    // Obtener todos los posts
    fetchPosts() {
      axios.get('http://localhost:5017/api/Posts')
        .then(response => {
          this.posts = response.data.map(post => ({
            ...post,
            liked: false // Añadimos una propiedad para manejar los likes
          }));
        })
        .catch(error => {
          console.error('Error al cargar los posts:', error);
        });
    },
    // Función para alternar el like de un post
    toggleLike(post) {
      if (post.liked) {
        this.removeLike(post);
      } else {
        this.addLike(post);
      }
    },
    // Añadir un like al post
    addLike(post) {
      axios.post('http://localhost:5017/api/Likes', {
        postId: post.id,
        userId: 2 // Aquí pondrías el ID del usuario autenticado
      })
      .then(() => {
        post.liked = true;
      })
      .catch(error => {
        console.error('Error al dar like:', error);
      });
    },
    // Quitar un like al post
    removeLike(post) {
      axios.delete('http://localhost:5017/api/Likes', {
        data: {
          postId: post.id,
          userId: 2 // Aquí pondrías el ID del usuario autenticado
        }
      })
      .then(() => {
        post.liked = false;
      })
      .catch(error => {
        console.error('Error al quitar el like:', error);
      });
    },
  },
  mounted() {
    this.fetchPosts(); // Cargar los posts cuando el componente se monte
  }
};
</script>

<style scoped>
/* Estilos del botón de Like */
.fa-heart {
  font-size: 24px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.fa-heart.liked {
  color: red;
}

/* Resto de los estilos */
.background-container {
  background-image: url('@/assets/fondo1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

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

h2 {
  font-size: 24px;
  font-weight: 700;
  color: #f39c12;
  margin-bottom: 20px;
}
</style>
