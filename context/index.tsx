import { useState, createContext, useContext } from "react";

export type PropsFormat = {
  hoge?: string;
  fuga?: string;
}

type PropsContextInterface = {
  data: PropsFormat;
  setFormValues: (values: Object) => void;
}

export const PropsContext = createContext<PropsContextInterface>({} as PropsContextInterface);

export default function FormProvider({ children }: any) {
  const [data, setData] = useState({} as PropsFormat);

  const setFormValues = (values: Object) => {
    setData(() => {
      return { ...data, ...values };
    });
  };

  return (
    <PropsContext.Provider value={{ data, setFormValues }}>
      {children}
    </PropsContext.Provider>
  );
}

export const usePropsData = () => useContext(PropsContext);
