const fetchData = async () => {
  const data = await fetch("./films_data.json");
  if (data.status === 200) {
    return await data.json();
  }
};

const showData = async () => {
  try {
    const dom = await document.getElementById("list-films");
    const data = await fetchData();
    console.log(data);

    output = ``;
    data.forEach((film) => {
      output += `
        <div class="film">
            <img
            class="poster_film"
            src="${film?.poster_src}"
            alt=""
            />
            <h2 class="titre_film">
            ${film?.title}
            </h2>
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
  } catch (error) {}
};
showData();
