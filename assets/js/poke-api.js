
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

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


// Função para buscar um Pokémon específico pelo nome
pokeApi.getPokemonByName = (name) => {
    // Converte o nome para minúsculas para garantir compatibilidade com a API
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

// Adicionar o evento de pesquisa ao formulário
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('pokemon-search-form');
    const searchInput = document.getElementById('search-pokemon');
    
    // Criar botão de reset com classes (inicialmente escondido)
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Início';
    resetButton.id = 'reset-button';
    resetButton.classList.add('reset-button', 'pokemon-button');
    resetButton.style.display = 'none'; // Inicialmente escondido
    
    // Adicionar o botão após o formulário
    searchForm.insertAdjacentElement('afterend', resetButton);
    
    // Função para processar a pesquisa
    function handleSearch(event) {
        event.preventDefault(); // Impede o envio tradicional do formulário
        
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // Limpa a lista de Pokémon
            pokemonList.innerHTML = '';
            
            // Mostrar mensagem de carregamento
            pokemonList.innerHTML = '<p class="loading">Procurando Pokémon...</p>';
            
            // Mostrar o botão de reset
            resetButton.style.display = 'block';
            
            // Busca o Pokémon pelo nome
            pokeApi.getPokemonByName(searchTerm)
                .then((pokemon) => {
                    // Limpar mensagem de carregamento
                    pokemonList.innerHTML = '';
                    
                    if (pokemon) {
                        // Exibe o Pokémon encontrado
                        pokemonList.innerHTML = convertPokemonToLi(pokemon);
                        
                        // Esconde o botão de carregar mais, já que estamos mostrando um resultado específico
                        loadMoreButton.style.display = 'none';
                    } else {
                        // Mostra mensagem se o Pokémon não for encontrado
                        pokemonList.innerHTML = `<p class="error-message">Pokémon "${searchTerm}" não encontrado. Corrija o nome e tente novamente.</p>`;
                    }
                });
        } else {
            alert('Por favor digite um pokemon.');
        }
    }
    
    // Adicionar evento de submit ao formulário
    searchForm.addEventListener('submit', handleSearch);
    
    // Adicionar evento ao botão de reset
    resetButton.addEventListener('click', () => {
        // Limpar o input
        searchInput.value = '';
        
        // Limpar a lista e carregar os Pokémon iniciais
        pokemonList.innerHTML = '';
        offset = 0;
        loadPokemonItens(offset, limit);
        
        // Mostrar o botão de carregar mais
        loadMoreButton.style.display = 'block';
        
        // Esconder o botão de reset após o clique
        resetButton.style.display = 'none';
    });
});