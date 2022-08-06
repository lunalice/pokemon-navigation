import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { PokemonClient, UtilityClient } from 'pokenode-ts';
import TurnButton from '../../components/TurnButton';
import { useRouter } from 'next/router'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

defaults.font.family ='Press Start 2P';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  // Regular expressions
  if (typeof id !== 'string') {
    return { notFound: true }
  }

  const api = new PokemonClient({ cacheOptions: { maxAge: 86400000 } });
  const json = await api
    .getPokemonById(Number(id));

  if (!json) return { notFound: true };

  const utilApi = new UtilityClient({ cacheOptions: { maxAge: 86400000 } });
  const species = await utilApi
    .getResourceByUrl(json.species.url);

  if (!species) return { notFound: true };

  const pokemonList = await api
    .listPokemons(0, 1000);
  const pokemonIds = pokemonList
    .results
    .map(v => Number((v.url.match('/.*\/([0-9]+)/') || [])[1]))
    .filter(v => !!v);

  return {
    props: {
      pokemon: json,
      species: species,
      pokemonIds: pokemonIds,
    },
  };
};

function baseStats(data: any) {
  const hp = data.stats.find((v: any) => v.stat.name === 'hp').base_stat;
  const attack = data.stats.find((v: any) => v.stat.name === 'attack').base_stat;
  const defense = data.stats.find((v: any) => v.stat.name === 'defense').base_stat;
  const specialAttack = data.stats.find((v: any) => v.stat.name === 'special-attack').base_stat;
  const specialDefense = data.stats.find((v: any) => v.stat.name === 'special-defense').base_stat;
  const speed = data.stats.find((v: any) => v.stat.name === 'speed').base_stat;
  return {
    labels: ["Hp", "Attack", "Defense", "Sp.Atk", "Sp.Def", "Speed"],
    datasets: [
      {
        label: data.name,
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(20,20,20)',
        data: [hp, attack, defense, specialAttack, specialDefense, speed]
      }
    ]
  }
}

export const options = {
  indexAxis: 'y' as const,
  responsive: true,
  scales: {
    x: {
      display: true,
      min: 0,
      max: 255,
    },
    y: {
      display: false,
    }
  },
  element: {
    font: {
      size: 20,
      family: 'Press Start 2P',
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const Pokemon: NextPage = ({ pokemon, species, pokemonIds }:any) => {
  const genera = species.genera.find((v: any) => v.language.name === 'en');
  const flavor_text_entries = species.flavor_text_entries.find((v: any) => v.language.name === 'en');
  const game_indices = pokemon.game_indices.map((v: any) => v.version.name);
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <Head>
        <title>{ pokemon.name } navigation</title>
        <meta name="description" content={`This page is a detailed page about ${pokemon.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TurnButton
        id={id}
        pokemonIds={pokemonIds}
      />

      <main className="container mx-auto px-5 pt-5 mt-5 mb-32 break-all">
        <div className="lg:flex mb-8 lg:space-x-3">
          <div className="nes-container with-title mx-auto lg:flex-1">
            <p className="title">No.{pokemon.id}</p>
            <div className="flex space-x-1 justify-center items-center mb-3 flex-col sm:flex-row">
              <div className="container flex-1">
                <div className="flex justify-center items-center flex-col">
                  <Image className="animate-poyo" src={pokemon.sprites.front_default} alt={pokemon.name} width={96} height={96} />
                </div>
              </div>
              <div className="container flex-1">
                <p>{ pokemon.name }</p>
                <p>{ genera.genus }</p>
                <p>Weight { pokemon.weight / 10 } kg</p>
                <p>Height { pokemon.height / 10 } m</p>
              </div>
            </div>
            <div className="nes-container is-rounded p-3">
              <p>{ flavor_text_entries.flavor_text }</p>
            </div>
          </div>
          <div className="nes-container with-title lg:flex-1 mx-auto lg:mt-0 mt-8">
            <p className="title">Game indices</p>
            <p>{game_indices.join(" / ")}</p>
          </div>
        </div>

        <div className="nes-container with-title mb-8 pr-2 pl-2">
          <p className="title">Base stats</p>
          <Bar data={baseStats(pokemon)} options={options} />
        </div>

        <div className="nes-container with-title">
          <p className="title">Specs</p>
          <div className="nes-container with-title mt-3">
            <p className="title">Growth rate</p>
            <p>{species.growth_rate.name}</p>
          </div>
          <div className="nes-container with-title mt-3">
            <p className="title">Base experience</p>
            <p>{pokemon.base_experience}</p>
          </div>
          <div className="nes-container with-title mt-3">
            <p className="title">Ability</p>
            {pokemon.abilities.map((v: any) => (
              <p key={v.ability.name}>{v.ability.name}</p>
            ))}
          </div>
          <div className="nes-container with-title mt-3">
            <p className="title">Type</p>
            {pokemon.types.map((v: any) => (
              <span className={ `${v.type.name}-background-color py-2 px-6 rounded mr-2 mb-2 inline-block` } key={v.type.name}>{v.type.name}</span>
            ))}
          </div>
          {!!pokemon.held_items.length && (<div className="nes-container with-title mt-3">
            <p className="title">Held item</p>
            {pokemon.held_items.map((v: any) => (
              <p key={v.item.name}>{v.item.name}</p>
            ))}
          </div>)}
          <div className="nes-container with-title mt-3">
            <p className="title">Egg group</p>
            {species.egg_groups.map((v: any) => (
              <p key={v.name}>{v.name}</p>
            ))}
          </div>
          <div className="nes-container with-title mt-3">
            <p className="title">Move</p>
            {pokemon.moves.map((v: any) => (
              <p key={v.move.name}>{v.move.name}</p>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Pokemon
