const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertWeightToKg(weightInGrams) {
    return (weightInGrams / 10) + " kg";
  }

function convertHeight(Height) {
    return (Height / 10) + "m";
  }  

function convertPokemonToLi(pokemon) {
    return `
    <div>
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
        <p class="abilities">
            <span class="label">Weight:</span>
            <span class="ability">${convertWeightToKg(pokemon.weight)}</span>
            <span class="label">Height:</span>
            <span class="ability">${convertHeight(pokemon.height)}</span>
            <span class="label">Abilities:</span>
            <span class="ability" id="ability">${pokemon.ability}, ${pokemon.abilityTwo}</span>
        </p>

    </div>    
        
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})