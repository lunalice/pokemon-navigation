import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { usePropsData, STORAGE_KEY_POKEMON_IDS } from '../../context'
import { PokemonClient, UtilityClient } from 'pokenode-ts';
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  // auto cache lib
  const api = new PokemonClient({ cacheOptions: { maxAge: 86400000 } });
  const json = await api
    .listPokemons(0, 1000);

  const pokemonIndex = json.results.map((v) => {
    return v.url;
  }).filter(v => !!v);

  return {
    props: { pokemonIndex: pokemonIndex },
  };
};

const Catch: NextPage = ({ pokemonIndex }: any) => {
  const [pokemon, setPokemon] = useState({} as any);
  const [messages, setMessages] = useState(['select command'] as string[]);
  const [stoneCount, setStoneCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const { data, setPropsValues } = usePropsData();

  const ball = () => {
    const consoleMessages = ['threw the ball!!'];
    if (calcCapture()) {
      const ids = new Set([...data.gettedPokemonIds, pokemon.id]);
      setPropsValues({ gettedPokemonIds: Array.from(ids) });
      consoleMessages.push(`caught a ${pokemon.name}!!`);
      randomPokemon();
    } else if (calcEscaped()){
      consoleMessages.push(`${pokemon.name} ran away!!`);
      randomPokemon();
    } else {
      consoleMessages.push(`${pokemon.name} is vigilant...!!`);
    }
    consoleOutput(consoleMessages);
  }

  const feed = () => {
    const consoleMessages = ['threw the bait!!']
    setFeedCount(v => v + 1);
    if (calcEscaped()){
      consoleMessages.push(`${pokemon.name} ran away!!`);
      randomPokemon();
    } else {
      consoleMessages.push(`${pokemon.name} is vigilant...!!`);
    }
    consoleOutput(consoleMessages);
  }

  const stone = () => {
    const consoleMessages = ['threw a stone!!']
    setStoneCount(v => v + 1);
    if (calcEscaped()){
      consoleMessages.push(`${pokemon.name} ran away!!`);
      randomPokemon();
    } else {
      consoleMessages.push(`${pokemon.name} is vigilant...!!`);
    }
    consoleOutput(consoleMessages);
  }

  const run = () => {
    const consoleMessages = []
    if (!calcEscaped()){
      consoleMessages.push('i ran away!!');
      randomPokemon();
    } else {
      consoleMessages.push(`I can't escape!!`);
    }
    consoleOutput(consoleMessages);
  }

  const consoleOutput = (consoleMessages: any) => {
    setMessages(v => v = [...messages, ...consoleMessages]);
  }

  const calcCapture = () => {
    const stat = pokemon.stats?.map((v: any) => v.base_stat).reduce((a: number, b: number) => a + b);
    const stoneCorrection = Math.max(0.1, 1 - 0.25 * stoneCount);
    const rand = Math.floor(Math.random() * 100);
    return rand >= ((100 * (stat / 1000)) * stoneCorrection);
  }

  const calcEscaped = () => {
    const stat = pokemon.stats?.map((v: any) => v.base_stat).reduce((a: number, b: number) => a + b);
    const feedCorrection = Math.max(0.1, 1 - 0.25 * feedCount);
    const rand = Math.floor(Math.random() * 100);
    return rand <= ((100 * (stat / 1000) * 0.9) * feedCorrection);
  }

  const randomPokemon = async () => {
    const random = Math.floor(Math.random() * (pokemonIndex.length + 1));
    const select = await pokemonIndex[random];
    const utilApi = new UtilityClient({ cacheOptions: { maxAge: 86400000 } });
    const resource = await utilApi
      .getResourceByUrl(select);
    if (!!resource) {
      setPokemon(resource);
    }
  }

  const calcHp = () => {
    const hp = 100 * Math.max(0.1, 1 - 0.25 * stoneCount);
    return hp.toString() || '100';
  }

  useEffect(() => {
    const el: any = document.getElementById('messageBox');
    el?.scrollTo(0, el.scrollHeight);
  }, [messages]);

  useEffect(() => {
    setStoneCount(0);
    setFeedCount(0);
  }, [pokemon]);

  useEffect(() => {
    randomPokemon();
    setPropsValues(JSON.parse(localStorage.getItem(STORAGE_KEY_POKEMON_IDS) || '{}'));
  }, []);

  const battle = (e: any) => {
    switch (e.target.value) {
      case 'ball':
        ball();
        break;
      case 'feed':
        feed();
        break;
      case 'stone':
        stone();
        break;
      case 'run':
        run();
        break;
      default:
        throw new Error('command does not exist');
    }
  }

  const randomImage = useMemo(() => {
    return (
      <Image
        className="animate-poyo"
        src={pokemon?.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`}
        alt="pokemon"
        width={192}
        height={192} />
    );
  }, [pokemon]);

  const renderMessages = useMemo(() => {
    return messages.map((v: any, index: any) => (
        <span className="w-full animate-fade" key={index}>{v}</span>
      ));
  }, [messages]);

  return (
    <div>
      <Head>
        <title>Catch</title>
      </Head>
      <main className='mx-5'>
        <div className="container mx-auto my-10 mb-32 max-w-2xl">
          <div className="container">
            <div className="flex justify-center">
              <div className="flex-1 flex-col">
                <div>{pokemon.name}</div>
                <span>Stat {pokemon.stats?.map((v: any) => v.base_stat).reduce((a: number, b: number) => a + b)}</span>
                <progress className="nes-progress h-5" value={calcHp()} max="100"></progress>
              </div>
              <div className="flex-1 text-right">
                {randomImage}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center nes-container break-all is-rounded">
            <label className="md:w-1/2 w-full">
              <input type="radio" className="nes-radio" name="select" value="ball" onChange={battle} onClick={battle} />
              <span>Ball</span>
            </label>

            <label className="md:w-1/2 w-full">
              <input type="radio" className="nes-radio" name="select" value="feed" onChange={battle} onClick={battle} />
              <span>Feed</span>
            </label>

            <label className="md:w-1/2 w-full">
              <input type="radio" className="nes-radio" name="select" value="stone" onChange={battle} onClick={battle} />
              <span>Stone</span>
            </label>

            <label className="md:w-1/2 w-full">
              <input type="radio" className="nes-radio" name="select" value="run" onChange={battle} onClick={battle} />
              <span>Run away</span>
            </label>
          </div>

          <div id="messageBox" className="nes-container is-rounded max-h-24 overflow-y-scroll !mt-5">
            <div className="flex flex-wrap flex-col break-all">
              {renderMessages}
            </div>
          </div>

          <div className="text-right py-2">
            <Link href="/pokedex">
              <a>pokedex</a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Catch
