import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import SearchBox from '../components/SearchBox'
import { PokemonClient } from 'pokenode-ts';
import { useState, useEffect, useMemo } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  // auto cache lib
  const api = new PokemonClient({ cacheOptions: { maxAge: 86400000 } });
  const json = await api
    .listPokemons(0, 1000);

  return {
    props: { optionList: json.results },
  };
};

const Home: NextPage = (props: any) => {
  const [pokemonId, setPokemonId] = useState(1);
  const randomPokemon = async () => {
    const random = Math.floor(Math.random() * (props.optionList.length + 1));
    const select = await props.optionList[random];
    const m = await select?.url?.match('/.*\/([0-9]+)/');
    if (!m) {
      setPokemonId(1);
    } else {
      setPokemonId(m[1]);
    }
    setTimeout(randomPokemon.bind(self),30000);
  }

  useEffect(() => {
    randomPokemon();
  }, []);

  const randomImage = useMemo(() => {
    return (
      <Image className="animate-poyo" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`} alt="pokemon" width={288} height={288} />
    );
  }, [pokemonId]);

  return (
    <div>
      <Head>
        <title>Pokemon Navigation</title>
      </Head>
      <main>
        <div className="container mx-auto px-5 mt-10 mb-10">
          <h1 className="text-2xl md:text-5xl mx-auto text-center">Pokemon<br/>Navigation</h1>
          <div id="randomPokemon" className="flex justify-center my-2">
            {randomImage}
          </div>
          <SearchBox optionList={props.optionList} />
        </div>
      </main>
    </div>
  )
}

export default Home
