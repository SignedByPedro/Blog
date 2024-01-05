interface User {
  id: number;
  name: string;
  picture: string;
}

interface Comment {
  userId: number;
  body: string;
}

interface Post {
  title: string;
  body: string;
  userId: number;
  createdAt: string;
  likes: any[]; // You might want to specify a type for likes as well
  comments: Comment[];
}

// Função para carregar os dados dos arquivos JSON

let allPosts: Post[] = [];
let allusersData: User[] = []; // Array global para armazenar todos os posts

function carregarDados() {
  // Carregar posts.json
  fetch(
    "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json"
  )
    .then((response) => response.json())
    .then((postsData: Post[]) => {
      // Carregar users.json
      fetch(
        "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json"
      )
        .then((response) => response.json())
        .then((usersData: User[]) => {
          // Exibir detalhes dos posts
          displayPostsDetails(postsData, usersData);
          allusersData = usersData;
        })
        .catch((error) => console.error("Erro ao carregar users.json:", error));
    })
    .catch((error) => console.error("Erro ao carregar posts.json:", error));
}

// Função para encontrar o nome do usuário pelo ID
function findUserNameById(userId: number, usersData: User[]) {
  const user = usersData.find((user) => user.id === userId);
  return user ? user.name : "Usuário não encontrado";
}

// Função para encontrar a foto de perfil do usuário pelo ID
function findUserProfilePicById(userId: number, usersData: User[]) {
  const user = usersData.find((user) => user.id === userId);
  return user ? user.picture : "default.jpg";
}

// Função para exibir os detalhes dos posts
function displayPostsDetails(postsData: Post[], usersData: User[]) {
  allPosts = postsData;
  const postList = document.getElementById("postList")!;

  // Inverte a ordem dos posts (do mais recente para o mais antigo)
  postsData.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  postsData.forEach((post) => {
    const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const postElement = document.createElement("li"); // Cria um elemento li para cada post
    postElement.classList.add("post");
    postElement.innerHTML = `
          <h3>${post.title}</h3> <!-- Título do post -->
    
          <p><strong>Data de criação:</strong> ${formattedDate}</p>
          <p>${post.body}</p> <!-- Conteúdo do post -->
          <p><strong>Likes:</strong> ${post.likes.length}</p>
          <p><strong>Número de comentários:</strong> ${post.comments.length}</p>
          <p><strong>Comentários:</strong></p>
          <ul style="list-style: none; padding-left: 0;">
            ${post.comments
              .map(
                (comment) => `
                  <li style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${findUserProfilePicById(
                      comment.userId,
                      usersData
                    )}" alt="Foto de perfil" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                    <span>${findUserNameById(comment.userId, usersData)}: ${
                  comment.body
                }</span>
                  </li>`
              )
              .join("")}
          </ul>
          <hr>
        `;

    // Adiciona o novo post no início da lista
    postList!.insertBefore(postElement, postList!.firstChild);
  });
}

// Função para criar a barra de pesquisa de posts
function criarBarraPesquisa() {
  const postCount = document.createElement("div");
  postCount.setAttribute("id", "postCount");
}

// Função para pesquisar posts
function search() {
  const input = document.getElementById("searchInput") as HTMLInputElement;
  const searchText = input.value.trim().toLowerCase();

  fetch(
    "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json"
  )
    .then((response) => response.json())
    .then((postsData: Post[]) => {
      const filteredPosts = allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchText)
      );
      // Inverte a ordem dos posts (do mais recente para o mais antigo)
      const sortedPosts = filteredPosts.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      // Atualiza a contagem de posts encontrados
      const postCount = document.getElementById("postCount");

      postCount!.innerHTML = `${filteredPosts.length} posts encontrados`;

      // Limpa a lista de posts antes de exibir os resultados da pesquisa
      const postList = document.getElementById("postList");
      postList!.innerHTML = "";

      filteredPosts.forEach((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const postElement = document.createElement("li");
        postElement.innerHTML = `
              <h2>${post.title}</h2>
              <p>${post.body}</p> <!-- Conteúdo do post -->
              <p><strong>Data de criação:</strong> ${formattedDate}</p>
              <p><strong>Likes:</strong> ${post.likes.length}</p>
              <p><strong>Número de comentários:</strong> ${
                post.comments.length
              }</p>
              <p><strong>Comentários:</strong></p>
              <ul style="list-style: none; padding-left: 0;">
                ${post.comments
                  .map(
                    (comment) => `
                      <li style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img src="${findUserProfilePicById(
                          comment.userId,
                          allusersData
                        )}" alt="Foto de perfil" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                        <span>${findUserNameById(
                          comment.userId,
                          allusersData
                        )}: ${comment.body}</span>
                      </li>`
                  )
                  .join("")}
              </ul>
              <hr>
              
            `;
        postList!.appendChild(postElement);
      });

      if (filteredPosts.length === 0) {
        const noResultsElement = document.createElement("li");
        noResultsElement.textContent = "Nenhum resultado encontrado";
        postList!.appendChild(noResultsElement);
      }
    })
    .catch((error) => console.error("Erro ao carregar posts.json:", error));
}

function addPost() {
  const postTitleInput = document.getElementById(
    "postTitle"
  )! as HTMLInputElement;
  const postContentInput = document.getElementById(
    "postContent"
  )! as HTMLInputElement;

  const postTitle = postTitleInput.value;
  const postContent = postContentInput.value;

  const newPost = {
    title: postTitle,
    body: postContent,
    userId: 101, // ID do novo usuário
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  };

  // Exibir o novo post localmente
  displayNewPost(newPost);

  // Clear the input fields
  postTitleInput.value = "";
  postContentInput.value = "";
}

function displayNewPost(post) {
  allPosts.unshift(post);
  const postList = document.getElementById("postList")!;
  // Código para exibir o novo post (similar ao anterior)

  const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const postElement = document.createElement("li");
  postElement.classList.add("post");
  postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>Data de criação:</strong> ${formattedDate}</p>
      <p>${post.body}</p>
      <p><strong>Likes:</strong> ${post.likes.length}</p>
      <p><strong>Número de comentários:</strong> ${post.comments.length}</p>
      <hr>
    `;
  postList.prepend(postElement);
}
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
  criarBarraPesquisa();
});
