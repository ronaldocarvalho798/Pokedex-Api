
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.hp = pokeDetail.stats[0].base_stat
    pokemon.attack = pokeDetail.stats[1].base_stat
    pokemon.defense = pokeDetail.stats[2].base_stat
    pokemon.ability = pokeDetail.abilities[0]?.ability.name || "";
    
    pokemon.abilityTwo = pokeDetail.abilities.length > 1 ? pokeDetail.abilities[1].ability.name : "";

    pokemon.weight = pokeDetail.weight
    pokemon.height = pokeDetail.height

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default || pokeDetail.sprites.other["official-artwork"].front_default;
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


pokeApi.getPokemonByName = (name) => {
    const pokemonName = name.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Pokémon não encontrado');
            }
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch((error) => {
            console.error('Erro na pesquisa:', error);
            return null;
        });
};


document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('pokemon-search-form');
    const searchInput = document.getElementById('search-pokemon');
    
   
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Início';
    resetButton.id = 'reset-button';
    resetButton.classList.add('reset-button', 'pokemon-button');
    resetButton.style.display = 'none'; 
    
  
    searchForm.insertAdjacentElement('afterend', resetButton);
    
    
    function handleSearch(event) {
        event.preventDefault(); 
        
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            
            pokemonList.innerHTML = '';
            
            
            pokemonList.innerHTML = '<p class="loading">Procurando Pokémon...</p>';
            
            
            resetButton.style.display = 'block';
            
            
            pokeApi.getPokemonByName(searchTerm)
                .then((pokemon) => {
                    
                    pokemonList.innerHTML = '';
                    
                    if (pokemon) {
                        
                        pokemonList.innerHTML = convertPokemonToLi(pokemon);
                        
                        
                        loadMoreButton.style.display = 'none';
                    } else {
                        
                        pokemonList.innerHTML = `<p class="error-message">Pokémon "${searchTerm}" não encontrado. Corrija o nome e tente novamente.</p>`;
                    }
                });
        } else {
            alert('Por favor digite um pokemon.');
        }
    }
    
    
    searchForm.addEventListener('submit', handleSearch);
    
   
    resetButton.addEventListener('click', () => {
        
        searchInput.value = '';
        
        
        pokemonList.innerHTML = '';
        offset = 0;
        loadPokemonItens(offset, limit);
        
        
        loadMoreButton.style.display = 'block';
        
        
        resetButton.style.display = 'none';
    });
});