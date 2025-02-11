// const fetchData = async () => {
//   const data = await fetch("./films_data.json");
//   if (data.status === 200) {
//     return await data.json();
//   }
// };

// const showData = async () => {
//   try {
//     const dom = await document.getElementById("list-films");
//     const data = await fetchData();
//     console.log(data);

//     output = ``;
//     data.forEach((film) => {
//       output += `
//         <div class="film">
//             <img
//             class="poster_film"
//             src="${film?.poster_src}"
//             alt=""
//             />
//             <h2 class="titre_film">
//             ${film?.title}
//             </h2>
//             <div class="footer_film">
//             <div class="duree_film">Duration: ${film?.runtime}</div>
//             <div class="genre_film">
//                 Genre: ${film.genres?.slice(0, 1).map((genre) => genre)}
//             </div>
//             </div>
//             <a class="btn_film" href="${film?.iframe_src}">Watch</a>
//         </div>
// `;
//     });
//     dom.innerHTML = output;
//   } catch (error) {}
// };
// showData();

const filmsPerPage = 8; // Nombre de films par page
let currentPage = 1;
let totalPages = 1;
let filmsData = [];

// Fonction pour récupérer les données
const fetchData = async () => {
  const data = await fetch("./films_data.json");
  if (data.status === 200) {
    return await data.json();
  }
};

// Fonction pour afficher les films de la page actuelle
const showData = () => {
  const dom = document.getElementById("list-films");
  if (!dom) return;

  // Déterminer les films à afficher selon la page actuelle
  const startIndex = (currentPage - 1) * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;
  const filmsToShow = filmsData.slice(startIndex, endIndex);

  let output = "";
  filmsToShow.forEach((film) => {
    output += `
      <div class="film">
          <img class="poster_film" src="${film?.poster_src}" alt="" />
          <h2 class="titre_film">${film?.title}</h2>
          <div class="footer_film">
              <div class="duree_film">Duration: ${film?.runtime}</div>
              <div class="genre_film">
                  Genre: ${film.genres?.slice(0, 1).map((genre) => genre)}
              </div>
          </div>
          <a class="btn_film" href="${film?.iframe_src}">Watch</a>
      </div>
    `;
  });

  dom.innerHTML = output;
  updatePagination();
};

// Mettre à jour la pagination (affichage des boutons)
const updatePagination = () => {
  const paginationDom = document.getElementById("pagination");
  if (!paginationDom) return;

  paginationDom.innerHTML = `
  <div class="pagination">
    <button class="prev" onclick="prevPage()" ${
      currentPage === 1 ? "disabled" : ""
    }>Précédent</button>
    <span class="">Page ${currentPage} sur ${totalPages}</span>
    <button class="next" onclick="nextPage()" ${
      currentPage === totalPages ? "disabled" : ""
    }>Suivant</button>
    </div>
  `;
};

// Aller à la page précédente
const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showData();
  }
};

// Aller à la page suivante
const nextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    showData();
  }
};

// Charger les données et initialiser la pagination
const init = async () => {
  filmsData = await fetchData();
  totalPages = Math.ceil(filmsData.length / filmsPerPage);
  showData();
};

// Démarrer le script
init();
