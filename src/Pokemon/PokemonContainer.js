import React, { useState, useEffect } from 'react';

function App() {
  const [pokemonId, setPokemonId] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [weightFilter, setWeightFilter] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results))
      .catch((error) => console.log(error));
  }, []);

  const fetchPokemonData = () => {
    if (pokemonId === '' && searchName === '') {
      setError('Please enter a valid Pokémon ID or name.');
      return;
    }

    let apiUrl = '';
    if (pokemonId !== '') {
      apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    } else {
      apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchName.toLowerCase()}`;
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data.');
        }
        return response.json();
      })
      .then((data) => {
        setPokemonData(data);
        setError('');
      })
      .catch((error) => {
        setPokemonData(null);
        setError(error.message);
      });
  };

  const handleInputChange = (event) => {
    setPokemonId(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setWeightFilter(event.target.value);
  };

  const filterPokemonsByWeight = () => {
    if (weightFilter === '') {
      setError('Please enter a valid weight filter.');
      return;
    }

    const filteredPokemons = pokemonList.filter((pokemon) => {
      return (
        pokemon.weight === parseInt(weightFilter) ||
        pokemon.weight === parseFloat(weightFilter)
      );
    });

    setPokemonList(filteredPokemons);
  };

  return (
    <div>
      <h1>Pokémon!!</h1>
      <div>
        <label htmlFor="pokemonId">Pokémon ID:</label>
        <input
          type="number"
          id="pokemonId"
          value={pokemonId}
          onChange={handleInputChange}
        />
        <button onClick={fetchPokemonData}>Get Pokémon</button>
      </div>
      <div>
        <label htmlFor="searchName">Find Pokémon by Name:</label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={handleSearchInputChange}
        />
        <button onClick={fetchPokemonData}>Get Pokémon</button>
      </div>
      <div>
        <label htmlFor="weightFilter">Pokémon by Weight:</label>
        <input
          type="number"
          id="weightFilter"
          value={weightFilter}
          onChange={handleFilterChange}
        />
        <button onClick={filterPokemonsByWeight}>Get Pokémon</button>
      </div>
      {error && <p>{error}</p>}
      {pokemonData && (
        <div>
          <h2>{pokemonData.name}</h2>
          <p>ID: {pokemonData.id}</p>
          <p>Experience: {pokemonData.base_experience}</p>
          <p>Height: {pokemonData.height}</p>
          <p>Weight: {pokemonData.weight}</p>
          <h3>Abilities:</h3>
          <ul>
            {pokemonData.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
          <h3>Type:</h3>
          <ul>
            {pokemonData.types.map((type, index) => (
              <li key={index}>{type.type.name}</li>
            ))}
          </ul>
          <h3>Pictures:</h3>
          <div>
            <img src={pokemonData.sprites.front_default} alt="Front Sprite" />
            <img src={pokemonData.sprites.back_default} alt="Back Sprite" />
          </div>
        </div>
      )}
      <h2>List</h2>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <li key={index}>
            {pokemon.name} - ID: {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
