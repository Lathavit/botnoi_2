import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [showPokemon, setShowPokemon] = useState(false); // สร้าง state เพื่อแสดงข้อมูล Pokemon หลังจากกดปุ่ม

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const pokemonList = data.results;

        // Fetch details of each Pokémon
        const promises = pokemonList.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          if (!pokemonResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const pokemonData = await pokemonResponse.json();
          return {
            name: pokemonData.name.toUpperCase(), // Convert name to uppercase
            type1: pokemonData.types[0] ? pokemonData.types[0].type.name : '', // Type 1
            type2: pokemonData.types[1] ? pokemonData.types[1].type.name : '-', // Type 2
            baseStats: pokemonData.stats.map((stat) => ({
              name: stat.stat.name,
              value: stat.base_stat,
            })),
            pictureFront: pokemonData.sprites.front_default,
            pictureBack: pokemonData.sprites.back_default,
          };
        });

        const pokemonDetails = await Promise.all(promises);
        setPokemonData(pokemonDetails);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (showPokemon) {
      fetchPokemonData(); // เรียกใช้งานเมื่อ state showPokemon เป็น true
    }
  }, [showPokemon]); // กำหนดให้ useEffect เรียกใช้ทุกครั้งที่ showPokemon เปลี่ยนแปลง

  // ฟังก์ชันที่เรียกเมื่อคลิกปุ่ม "Get Pokedex"
  const handleGetPokedexClick = () => {
    setShowPokemon(true); // กำหนดให้แสดงข้อมูล Pokemon เมื่อคลิกปุ่ม
  };

  return (
    <div>
      <strong className='title'>API Pokemon</strong> <br />
      <div className='button-container'>
        <button onClick={handleGetPokedexClick} className='button'>Get Pokedex</button>
      </div>
      {pokemonData ? (
        <ul>
          {pokemonData.map((pokemon, index) => (
            <div key={index} className='card'>
              <img src={pokemon.pictureFront} alt={`Front of ${pokemon.name}`} />
              <img src={pokemon.pictureBack} alt={`Back of ${pokemon.name}`} />
              <br />
              <strong>Name : </strong>{pokemon.name}
              <br />
              <strong>Type 1 : </strong> {pokemon.type1}
              <br />
              <strong>Type 2 : </strong> {pokemon.type2}
              <br />
              <strong>Base stats :</strong>
              <ul>
                {pokemon.baseStats.map((stat, index) => (
                  <li key={index}>
                    {stat.name}: {stat.value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      ) : (
        <p>{showPokemon ? 'Loading...' : ''}</p>
      )}
    </div>
  );
}

export default App;
