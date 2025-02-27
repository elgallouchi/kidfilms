const filmsPerPage = 20; // Nombre de films par page
let currentPage = 1;
let totalPages = 1;
let filmsData = [];
let selectedGenre = null; // Genre actuellement filtré (null = pas de filtre)

// Fonction pour récupérer les données
const fetchData = async () => {
  const data = await fetch("./films_data.json");
  if (data.status === 200) {
    return await data.json();
  }
};

// Fonction pour afficher les films en fonction du genre et de la pagination
const showData = () => {
  const dom = document.getElementById("list-films");
  if (!dom) return;

  // Filtrer les films par genre si un genre est sélectionné
  let filteredFilms = selectedGenre
    ? filmsData.filter((film) => film.genres.includes(selectedGenre))
    : filmsData;

  // Mettre à jour le nombre total de pages
  totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
  if (currentPage > totalPages) currentPage = 1; // Réinitialiser si dépassement

  // Sélectionner les films pour la page actuelle
  const startIndex = (currentPage - 1) * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;
  const filmsToShow = filteredFilms.slice(startIndex, endIndex);
  filmsToShow.reverse()
  console.log(filmsToShow)
  let output = "";
  filmsToShow.forEach((film) => {
    output += `
      <div class="film">
          <img class="poster_film" src="${film?.poster_src}" alt="" />
          <h2 class="titre_film">${film?.title}</h2>
          <div class="footer_film">
              <div class="duree_film">Duration: ${film?.runtime}</div>
              <div class="genre_film">
                  Genre: ${film.genres
                    .map(
                      (genre) =>
                        `<span class="genre-item" onclick="filterByGenre('${genre}')">${genre}</span>`
                    )
                    .join(", ")}
              </div>
          </div>
          <a class="btn_film" href="${film?.iframe_src}">Watch</a>
      </div>
    `;
  });

  dom.innerHTML = output;
  updatePagination();

  // 🔥 Scroll en haut après changement de page 🔥
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Fonction pour filtrer les films par genre
// const filterByGenre = (genre) => {
//   selectedGenre = genre;
//   currentPage = 1; // Réinitialiser à la première page
//   showData();
// };

// Fonction pour réinitialiser le filtre
// const resetFilter = () => {
//   selectedGenre = null;
//   currentPage = 1;
//   showData();
// };

// Mettre à jour la pagination
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
    ${
      selectedGenre
        ? `<button onclick="resetFilter()">Réinitialiser</button>`
        : ""
    }
  </div>`;
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
  showData();
};

// Démarrer le script
init();
