const pokemonList = document.getElementById("pokemon-list")
const pokemonDetail = document.getElementById("pokemon-detail")
const pokemonInfo = document.getElementById("pokemon-info")
const backButton = document.getElementById("back-button")

const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")

const prevButton = document.getElementById("prev-button")
const nextButton = document.getElementById("next-button")

let currentPage = 1
const itemsPerPage = 50
const totalPokemons = 1025

async function fetchPokemonData(pokemonId) {
    const response = await fetch(`http://127.0.0.1:3000/api/pokemon/${pokemonId}`)
    const pokemon = await response.json()
    return pokemon
}

async function viewStatusPokemon(pokemon_id) {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/pokemon/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                pokemon_id:pokemon_id,
                view:true,
                catch:false,
                in_team:false
            })
        })
        console.log(response)
        const pokemonView = await response.json()
        return pokemonView
    } catch (error) {
        console.error(error)
    }
}

async function catchStatusPokemon(pokemon_id,viewStatus) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/pokemon/catch/${pokemon_id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                pokemon_id:pokemon_id,
                view:viewStatus,
                catch:false,
                in_team:false
            })
        })
        const pokemonView = await response.json()
        return pokemonView
    } catch (error) {
        console.error(error)
    }
}
function displayPokemon(pokemon){
    const pokemonCard = document.createElement("div")
    pokemonCard.classList.add("pokemon-card")
    pokemonCard.innerHTML = `
    <img src = "${pokemon.image}" alt="${pokemon.name}">
    <h3>${pokemon.name.toUpperCase()}</h3>
    <p>ID: ${pokemon.pokemon_id}</p>
    `
    //linea para mostrar detalle de pokemon
    pokemonCard.addEventListener("click",()=> showPokemonDetail(pokemon))
    pokemonList.appendChild(pokemonCard)
    return
}
backButton.addEventListener("click",()=>{
    pokemonDetail.style.display = "none"
    pokemonList.style.display = "grid"
})
function showPokemonDetail(pokemon){
    pokemonList.style.display = "none"
    pokemonDetail.style.display = "block"
    pokemonInfo.innerHTML =`
    <h2>${pokemon.name}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name}" >
    <p>ID: ${pokemon.pokemon_id} </p>
    <p>Altura: ${pokemon.height} m</p>
    <p>Peso: ${pokemon.weight} kg</p>
    <p>Tipos: ${pokemon.types}</p>
    <p>Visto: ${pokemon.view}</p>
    <p>Capturado: ${pokemon.catch}</p>
    <p>En el equipo: ${pokemon.inTeam}</p>
    `
    const viewStatusButton = document.createElement("button")
    viewStatusButton.innerHTML = "Pokemon visto"
    viewStatusButton.addEventListener("click",()=>viewStatusPokemon(pokemon.pokemon_id))
    pokemonInfo.appendChild(viewStatusButton)

    const catchStatusButton = document.createElement("button")
    catchStatusButton.innerHTML ="Captura el pokemon"
    catchStatusButton.addEventListener("click",()=>catchStatusPokemon(pokemon.pokemon_id,pokemon.view))
    pokemonInfo.appendChild(catchStatusButton)
    return
}


async function loadPokedex(page) {
    pokemonList.innerHTML=""
    const start = (page -1)*itemsPerPage +1
    const end = page*itemsPerPage
    for (let i=start; i<=end; i++){
        const pokemon = await fetchPokemonData(i)
        displayPokemon(pokemon)
    }
    updatePaginationButtons(page)
    return
}


async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim()
    if(query){
        try {
            const pokemon = await fetchPokemonData(query)
            pokemonList.style.display = "none"
            showPokemonDetail(pokemon)
        } catch (error) {
            alert("Pokémon no encontrado, intentelo nuevamente")
        }
    }else{
        alert("Ingresar un nombre o un id de pokemon")
    }
}
searchButton.addEventListener("click",searchPokemon)

function updatePaginationButtons(page){
    prevButton.disabled = page == 1
    nextButton.disabled = page == Math.floor(totalPokemons/itemsPerPage) 
}

nextButton.addEventListener("click",()=>{
    currentPage++
    loadPokedex(currentPage)
})

prevButton.addEventListener("click",()=>{
    if(currentPage > 1){
        currentPage--
        loadPokedex(currentPage)
    }
})
loadPokedex(currentPage)
