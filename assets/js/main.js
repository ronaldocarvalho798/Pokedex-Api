const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 2000
const limit = 200
let offset = 0;

function convertWeightToKg(weightInGrams) {
    return (weightInGrams / 10) + " kg";
  }

function convertHeight(Height) {
    return (Height / 10) + "m";
  }  

  function convertPokemonToLi(pokemon) {
    function getBarClass(percent) {
        if (percent <= 25) return 'low';
        if (percent <= 50) return 'medium';
        if (percent <= 75) return 'good';
        return 'strong';
    }

    function renderStatsInline(stats) {
        const maxStats = { hp: 255, attack: 181, defense: 230 };
        const statNames = { hp: "HP", attack: "Attack", defense: "Defense" };

        return Object.keys(stats).map(stat => {
            const value = stats[stat];
            const max = maxStats[stat];
            const percent = (value / max) * 100;
            const barClass = getBarClass(percent);

            return `
                <div class="stat">
                    <div class="stat-name">${statNames[stat]}: ${value}</div>
                    <div class="bar-container">
                        <div class="bar ${barClass}" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const stats = {
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
    };

    return `
    <div>
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>

        <div class="cont">
            <div class="slider">
                <div class="abilities page1">
                    <span class="label">Weight:</span>
                    <span class="ability">${convertWeightToKg(pokemon.weight)}</span>
                    <span class="label">Height:</span>
                    <span class="ability">${convertHeight(pokemon.height)}</span>
                    <span class="label">Abilities:</span>
                    <span class="ability" id="ability">${pokemon.ability}, ${pokemon.abilityTwo}</span>
                    <button onclick="mostrarDiv2(this)" class="btn-slide ir"><i class="bi bi-arrow-right"></i></button>
                </div>

                <div id="page2" class="abilities page2">
                    ${renderStatsInline(stats)}
                    <button onclick="voltarDiv1(this)" class="btn-slide"><i class="bi bi-arrow-left"></i></button>
                </div>
            </div>
        </div>
    </div>
    `;
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        renderStats(stats);
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    console.log("Offset atual:", offset); 
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

const slider = document.getElementById("slider");

function mostrarDiv2(button) {
    const slider = button.closest(".cont").querySelector(".slider")
    slider.style.transform = "translateX(-100%)";
  }
  
  function voltarDiv1(button) {
    const slider = button.closest(".cont").querySelector(".slider")
    slider.style.transform = "translateX(0)";
  }
  


  const maxStats = {
    hp: 255,
    attack: 181,
    defense: 230,
  };

  const statNames = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa"
  };

  function getBarClass(percent) {
    if (percent <= 25) return 'low';
    if (percent <= 50) return 'medium';
    if (percent <= 75) return 'good';
    return 'strong';
  }



 