const filmsPerPage = 4; // Nombre de films par page
let currentPage = 1;
let totalPages = 1;
let filmsData = [];
let selectedGenre = null; // Genre actuellement filtré (null = pas de filtre)

// Fonction pour récupérer les données
const fetchData = async () => {
  const data = await fetch("./films_data.json");
  if (data.status === 200) {
    const dataFinale = await data.json();
    return await dataFinale.reverse();
  }
};

const showMoreData = (id) => {
  const sectionMoreDataDom = document.getElementById("section-more-data");
  const film = filmsData.find((film) => film.id === id);
  let output = `
  <div class="more-data">
        <div id="close-more-data" onclick="closeMenuData()">X</div>
        ${
          film?.poster_src
            ? `<img
          src="${film?.poster_src}"
          alt="Abner le chien magique"
        />`
            : ""
        }
        ${film?.title ? `<h3>${film?.title}</h3>` : ""}
        ${film?.description ? `<p>Description : ${film.description}</p>` : ""}
        ${film?.release_year ? `<p>Annee : ${film?.release_year}</p>` : ""}
        ${film?.runtime ? `<p>Temps : ${film?.runtime}</p> ` : ""}
        ${
          film?.genres
            ? `<p>Genres : ${film?.genres.map((genre) => genre)}</p>`
            : ""
        }
        ${film?.audio ? `<p>Audio : ${film?.audio}</p>` : ""}
        ${film?.quality ? `<p>Qualité : ${film?.quality}</p>` : ""}
        ${film?.country ? `<p>Pays : ${film?.country}</p>` : ""}
        ${film?.director ? `<p>Directeur : ${film?.director}</p>` : ""}
        ${film?.actors.length > 1 ? `<p>Acteurs : ${film?.actors}</p>` : ""}
      </div>
  `;
  sectionMoreDataDom.innerHTML = output;
  sectionMoreDataDom.style.display = "flex";
};
const closeMenuData = () => {
  const sectionMoreDataDom = document.getElementById("section-more-data");
  sectionMoreDataDom.style.display = "none";
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

  let output = "";
  filmsToShow.forEach((film) => {
    // console.log(film);
    let genre = film.genres[0];
    output += `
      <div class="film">
      <div class="badge-film"  onclick="showMoreData('${film?.id}')">
        <img class="badge-img" src="./more.png" alt="menu" />
      </div>
          <img class="poster_film" src="${film?.poster_src}" alt="" />
          <h2 class="titre_film">${film?.title}</h2>
          <div class="footer_film">
              <div class="duree_film">Duration: ${film?.runtime}</div>
              <div class="genre_film">
                  Genre: <span class="genre-item" onclick="filterByGenre('${genre}')">${genre}</span>
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
const filterByGenre = (genre) => {
  selectedGenre = genre;
  currentPage = 1; // Réinitialiser à la première page
  showData();
};

// Fonction pour réinitialiser le filtre
const resetFilter = () => {
  selectedGenre = null;
  currentPage = 1;
  showData();
};

// search
const searchData = () => {
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value.toLowerCase();
  const filmsToShow = filmsData.filter((film) =>
    film.title.toLowerCase().includes(searchValue)
  );
  totalPages = Math.ceil(filmsToShow.length / filmsPerPage);
  if (currentPage > totalPages) currentPage = 1; // Réinitialiser si dépassement

  const dom = document.getElementById("list-films");
  if (!dom) return;

  let output = "";
  filmsToShow.forEach((film) => {
    let genre = film.genres[0];
    output += `
      <div class="film">
      <div class="badge-film" onclick="showMoreData('${film?.id}')">
        <img class="badge-img" src="./more.png" alt="menu" />
      </div>
          <img class="poster_film" src="${film?.poster_src}" alt="" />
          <h2 class="titre_film">${film?.title}</h2>
          <div class="footer_film">
              <div class="duree_film">Duration: ${film?.runtime}</div>
              <div class="genre_film">
                  Genre: <span class="genre-item" onclick="filterByGenre('${genre}')">${genre}</span>
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

// Mettre à jour la pagination
const updatePagination = () => {
  const paginationDom = document.getElementById("pagination");
  if (!paginationDom) return;
  paginationDom.innerHTML = `
  <div class="home-btn" onclick="resetFilter()">
  <img class="home-img" src="./home.png" alt="Home" />
  </div>
  <div id="search-bar">
    <input type="text" id="search-input" placeholder="Rechercher un film..." />
    <input type="button" id="search-button" value="Rechercher" onclick="searchData()" />
  </div>
  <div class="pagination">
    <button class="prev" onclick="prevPage()" ${
      currentPage === 1 ? "disabled" : ""
    }>Précédent</button>
    <span class="">Page ${currentPage} sur ${totalPages}</span>
    <button class="next" onclick="nextPage()" ${
      currentPage === totalPages ? "disabled" : ""
    }>Suivant</button>
    </div>`;
  //  ${
  //     selectedGenre
  //       ? `<button onclick="resetFilter()" class="reset-filter">Réinitialiser</button>`
  //       : ""
  //   }
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
