import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { usePropsData } from '../../context'
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
  return (
    <div>
      <Head>
        <title>Pokedex</title>
      </Head>
      <main className="mx-5">
        <div className="flex flex-wrap container mx-auto my-10">
          {pokemonIndex.map((v: any) => (
            <Link key={v.id} href={{ pathname: '/pokemon/[id]', query: { id: v.id }}} passHref>
              <a className="flex flex-col justify-center items-center flex-1 card w-1/2 border-4 border-black mr-1 mb-1 p-2">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${v.id}.png`}
                  alt={`No.${v.id}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  />
                <span className="w-[100px] break-words">No.{v.id} {v.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Pokedex
