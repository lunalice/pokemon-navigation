import { useState, createContext, useContext, useCallback, useEffect } from "react";

export type PropsFormat = {
  gettedPokemonIds: Number[];
}

type PropsContextInterface = {
  data: PropsFormat;
  setPropsValues: (values: Object) => void;
}

export const STORAGE_KEY_POKEMON_IDS = 'pokemon-navigation.vercel.app//pokemonIds'

export const PropsContext = createContext<PropsContextInterface>({} as PropsContextInterface);

export default function PropsProvider({ children }: any) {
  const [data, setData] = useState({ gettedPokemonIds: [] } as PropsFormat);

  const setPropsValues = (values: Object) => {
    setData(() => {
      localStorage.setItem(STORAGE_KEY_POKEMON_IDS, JSON.stringify({ ...data, ...values }))
      return { ...data, ...values };
    });
  };

  return (
    <PropsContext.Provider value={{ data, setPropsValues }}>
      {children}
    </PropsContext.Provider>
  );
}

export const usePropsData = () => useContext(PropsContext);
