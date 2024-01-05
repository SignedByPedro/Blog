// Função para carregar os dados dos arquivos JSON
var allPosts = [];
var allusersData = []; // Array global para armazenar todos os posts
function carregarDados() {
    // Carregar posts.json
    fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json")
        .then(function (response) { return response.json(); })
        .then(function (postsData) {
        // Carregar users.json
        fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json")
            .then(function (response) { return response.json(); })
            .then(function (usersData) {
            // Exibir detalhes dos posts
            displayPostsDetails(postsData, usersData);
            allusersData = usersData;
        })
            .catch(function (error) { return console.error("Erro ao carregar users.json:", error); });
    })
        .catch(function (error) { return console.error("Erro ao carregar posts.json:", error); });
}
// Função para encontrar o nome do usuário pelo ID
function findUserNameById(userId, usersData) {
    var user = usersData.find(function (user) { return user.id === userId; });
    return user ? user.name : "Usuário não encontrado";
}
// Função para encontrar a foto de perfil do usuário pelo ID
function findUserProfilePicById(userId, usersData) {
    var user = usersData.find(function (user) { return user.id === userId; });
    return user ? user.picture : "default.jpg";
}
// Função para exibir os detalhes dos posts
function displayPostsDetails(postsData, usersData) {
    allPosts = postsData;
    var postList = document.getElementById("postList");
    // Inverte a ordem dos posts (do mais recente para o mais antigo)
    postsData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    postsData.forEach(function (post) {
        var formattedDate = new Date(post.createdAt).toLocaleString("pt", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        var postElement = document.createElement("li"); // Cria um elemento li para cada post
        postElement.classList.add("post");
        postElement.innerHTML = "\n          <h3>".concat(post.title, "</h3> <!-- T\u00EDtulo do post -->\n    \n          <p><strong>Data de cria\u00E7\u00E3o:</strong> ").concat(formattedDate, "</p>\n          <p>").concat(post.body, "</p> <!-- Conte\u00FAdo do post -->\n          <p><strong>Likes:</strong> ").concat(post.likes.length, "</p>\n          <p><strong>N\u00FAmero de coment\u00E1rios:</strong> ").concat(post.comments.length, "</p>\n          <p><strong>Coment\u00E1rios:</strong></p>\n          <ul style=\"list-style: none; padding-left: 0;\">\n            ").concat(post.comments
            .map(function (comment) { return "\n                  <li style=\"display: flex; align-items: center; margin-bottom: 10px;\">\n                    <img src=\"".concat(findUserProfilePicById(comment.userId, usersData), "\" alt=\"Foto de perfil\" style=\"width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;\">\n                    <span>").concat(findUserNameById(comment.userId, usersData), ": ").concat(comment.body, "</span>\n                  </li>"); })
            .join(""), "\n          </ul>\n          <hr>\n        ");
        // Adiciona o novo post no início da lista
        postList.insertBefore(postElement, postList.firstChild);
    });
}
// Função para criar a barra de pesquisa de posts
function criarBarraPesquisa() {
    var postCount = document.createElement("div");
    postCount.setAttribute("id", "postCount");
}
// Função para pesquisar posts
function search() {
    var input = document.getElementById("searchInput");
    var searchText = input.value.trim().toLowerCase();
    fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json")
        .then(function (response) { return response.json(); })
        .then(function (postsData) {
        var filteredPosts = allPosts.filter(function (post) {
            return post.title.toLowerCase().includes(searchText);
        });
        // Inverte a ordem dos posts (do mais recente para o mais antigo)
        var sortedPosts = filteredPosts.sort(function (a, b) {
            return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        // Atualiza a contagem de posts encontrados
        var postCount = document.getElementById("postCount");
        postCount.innerHTML = "".concat(filteredPosts.length, " posts encontrados");
        // Limpa a lista de posts antes de exibir os resultados da pesquisa
        var postList = document.getElementById("postList");
        postList.innerHTML = "";
        filteredPosts.forEach(function (post) {
            var formattedDate = new Date(post.createdAt).toLocaleString("pt", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            var postElement = document.createElement("li");
            postElement.innerHTML = "\n              <h2>".concat(post.title, "</h2>\n              <p>").concat(post.body, "</p> <!-- Conte\u00FAdo do post -->\n              <p><strong>Data de cria\u00E7\u00E3o:</strong> ").concat(formattedDate, "</p>\n              <p><strong>Likes:</strong> ").concat(post.likes.length, "</p>\n              <p><strong>N\u00FAmero de coment\u00E1rios:</strong> ").concat(post.comments.length, "</p>\n              <p><strong>Coment\u00E1rios:</strong></p>\n              <ul style=\"list-style: none; padding-left: 0;\">\n                ").concat(post.comments
                .map(function (comment) { return "\n                      <li style=\"display: flex; align-items: center; margin-bottom: 10px;\">\n                        <img src=\"".concat(findUserProfilePicById(comment.userId, allusersData), "\" alt=\"Foto de perfil\" style=\"width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;\">\n                        <span>").concat(findUserNameById(comment.userId, allusersData), ": ").concat(comment.body, "</span>\n                      </li>"); })
                .join(""), "\n              </ul>\n              <hr>\n              \n            ");
            postList.appendChild(postElement);
        });
        if (filteredPosts.length === 0) {
            var noResultsElement = document.createElement("li");
            noResultsElement.textContent = "Nenhum resultado encontrado";
            postList.appendChild(noResultsElement);
        }
    })
        .catch(function (error) { return console.error("Erro ao carregar posts.json:", error); });
}
function addPost() {
    var postTitleInput = document.getElementById("postTitle");
    var postContentInput = document.getElementById("postContent");
    var postTitle = postTitleInput.value;
    var postContent = postContentInput.value;
    var newPost = {
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
    var postList = document.getElementById("postList");
    // Código para exibir o novo post (similar ao anterior)
    var formattedDate = new Date(post.createdAt).toLocaleString("pt", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    var postElement = document.createElement("li");
    postElement.classList.add("post");
    postElement.innerHTML = "\n      <h3>".concat(post.title, "</h3>\n      <p><strong>Data de cria\u00E7\u00E3o:</strong> ").concat(formattedDate, "</p>\n      <p>").concat(post.body, "</p>\n      <p><strong>Likes:</strong> ").concat(post.likes.length, "</p>\n      <p><strong>N\u00FAmero de coment\u00E1rios:</strong> ").concat(post.comments.length, "</p>\n      <hr>\n    ");
    postList.prepend(postElement);
}
document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    criarBarraPesquisa();
});
