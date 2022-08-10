import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { usePropsData, STORAGE_KEY_POKEMON_IDS } from '../../context'
import { PokemonClient } from 'pokenode-ts';
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  // auto cache lib
  const api = new PokemonClient({ cacheOptions: { maxAge: 86400000 } });
  const json = await api
    .listPokemons(0, 1000);

  const pokemonIndex = json.results.map((v) => {
    const m = v.url.match('/.*\/([0-9]+)/');
    const id = Number((m || [])[1]);
    return {
      id: id,
      name: v.name,
    };
  }).filter(v => !!v.id);

  return {
    props: { pokemonIndex: pokemonIndex },
  };
};

const Pokedex: NextPage = ({ pokemonIndex }: any) => {
  const [achievement, setAchievement] = useState(false);
  const invertAchievement = () => { setAchievement(v => !v); };
  const { data, setPropsValues } = usePropsData();

  const checkAchievement = (v: any) => {
    return !data.gettedPokemonIds.includes(v);
  }

  useEffect(() => {
    setPropsValues(JSON.parse(localStorage.getItem(STORAGE_KEY_POKEMON_IDS) || '{}'));
  }, []);

  return (
    <div>
      <Head>
        <title>Pokedex</title>
      </Head>
      <main className="mx-5">
        <div className="flex flex-wrap container mx-auto my-10">
          {pokemonIndex.map((v: any) => (
            <Link key={v.id} href={{ pathname: '/pokemon/[id]', query: { id: v.id }}} passHref>
              <a className={`${(achievement && checkAchievement(v.id)) ? "pointer-events-none" : ""} flex flex-col justify-center items-center flex-1 card w-1/2 border-4 border-black mr-1 mb-1 p-2 relative`}>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${v.id}.png`}
                  alt={`No.${v.id}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  />
                <span className="w-[100px] break-words">No.{v.id} {v.name}</span>
                <div className={(achievement && checkAchievement(v.id)) ? "bg-black absolute left-0 top-0 bottom-0 right-0 text-white flex justify-center items-center text-center" : "hidden"}>not caught</div>
              </a>
            </Link>
          ))}
        </div>
        <button type="button" className="fixed bottom-6 right-4 z-20" onClick={invertAchievement}>
          {/* <section className="message -right">
            <div className="nes-balloon from-right">
              <p>Good morning. Thou hast had a good night's sleep, I hope.</p>
            </div>
          </section> */}
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png`}
            alt={`No.479`}
            width={96}
            height={96}
            className="animate-fuwa"
            loading="lazy"
            />
        </button>
      </main>
    </div>
  )
}

export default Pokedex
