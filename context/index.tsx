import { useState, createContext, useContext } from "react";

export type PropsFormat = {
  gettedPokemonIds: Number[];
  fuga?: string;
}

type PropsContextInterface = {
  data: PropsFormat;
  setPropsValues: (values: Object) => void;
}

export const PropsContext = createContext<PropsContextInterface>({} as PropsContextInterface);

export default function PropsProvider({ children }: any) {
  const [data, setData] = useState({ gettedPokemonIds: [] } as PropsFormat);

  const setPropsValues = (values: Object) => {
    setData(() => {
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
