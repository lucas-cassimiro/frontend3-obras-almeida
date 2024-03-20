"use client";
import { TbCircleCheckFilled } from "react-icons/tb";
import CreateUnipDropdown from "@/components/constructionRegister/CreateUnityDropdown";
import { useConstruction } from "@/contexts/ConstructionsContext";
import { toast } from '@/components/ui/use-toast';
import { useMacro } from "@/contexts/MacroservicesContext";
import { useSub } from "@/contexts/SubservicesContext";
import { postConstruction } from "@/requests/teste";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from 'react';
import Link from "next/link";

interface Unit {
  place: string;
  id: string;
  name: string;
  ambient: string;
  macro_name: string;
  quantidade: number;
  peso: number;
  isDisabled: boolean;
  sub_id: any;
}

export default function Newpage() {
  const { constructionData, mountBody } = useConstruction();
  const { subservice } = useSub();
  const { data } = useMacro();
  const [groupedDataIndividual, setGroupedDataIndividual] = useState<{ [key: string]: Unit[] }>({});
  const [groupedDataRepeticao, setGroupedDataRepeticao] = useState<{ [key: string]: Unit[] }>({});
  const [storedData, setStoredData] = useState<Unit[]>([]);
  const [sended, setSended] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: any) => postConstruction(formData),
    onSuccess: (data) => {
      toast({
        title: "Tudo ok!",
        description: "Obra cadastrada com sucesso",
      })
      setSended(true)
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (constructionData && constructionData.unidades_individual && subservice && data) {
      const updatedUnidades = constructionData.unidades_individual.map((unit: any) => {
        const matchingSub = subservice.find((sub: any) => sub.id === unit.sub_id);
        const matchingMacro = data.find((macro: any) => macro.id === (matchingSub ? matchingSub.macro_id : null));
        if (matchingSub && matchingMacro) {
          return {
            ...unit,
            name: matchingSub.subservice,
            macro_name: matchingMacro.macroservice,
            quantidade: 0,
            peso: 0,
            isDisabled: false,
          };
        } else {
          return unit;
        }
      });

      const grouped: { [key: string]: Unit[] } = {};
      updatedUnidades.forEach((item: any) => {
        const place = item.place;
        if (!grouped[place]) {
          grouped[place] = [];
        }
        grouped[place].push(item);
      });

      setGroupedDataIndividual(grouped);
    }
  }, [constructionData, subservice, data]);

  useEffect(() => {
    if (constructionData && constructionData.unidades_repeticao && subservice && data) {
      const updatedUnidades = constructionData.unidades_repeticao.map((unit: any) => {
        const matchingSub = subservice.find((sub: any) => sub.id === unit.sub_id);
        const matchingMacro = data.find((macro: any) => macro.id === (matchingSub ? matchingSub.macro_id : null));
        if (matchingSub && matchingMacro) {
          return {
            ...unit,
            name: matchingSub.subservice,
            macro_name: matchingMacro.macroservice,
            quantidade: 0,
            peso: 0,
            isDisabled: false,
          };
        } else {
          return unit;
        }
      });

      const grouped: { [key: string]: Unit[] } = {};
      updatedUnidades.forEach((item: any) => {
        const ambient = item.ambient;
        if (!grouped[ambient]) {
          grouped[ambient] = [];
        }
        grouped[ambient].push(item);
      });

      setGroupedDataRepeticao(grouped);
    }
  }, [constructionData, subservice, data]);

  const handleOKClickIndividual = (unit: Unit, place: string, quantidade: number, peso: number) => {
    const updatedUnit: Unit = {
      ...unit,
      quantidade: quantidade,
      peso: peso,
      isDisabled: true,
    };

    const updatedGroupedData: { [key: string]: Unit[] } = { ...groupedDataIndividual };
    updatedGroupedData[place] = updatedGroupedData[place].map((item: Unit) =>
      item === unit ? updatedUnit : item
    );
    setGroupedDataIndividual(updatedGroupedData);

    setStoredData((prevStoredData: Unit[]) => [...prevStoredData, updatedUnit]);
  };

  const handleOKClickRepeticao = (unit: Unit, ambient: string, quantidade: number, peso: number) => {
    const updatedUnit: Unit = {
      ...unit,
      quantidade: quantidade,
      peso: peso,
      isDisabled: true,
    };

    const updatedGroupedData: { [key: string]: Unit[] } = { ...groupedDataRepeticao };
    updatedGroupedData[ambient] = updatedGroupedData[ambient].map((item: Unit) =>
      item === unit ? updatedUnit : item
    );

    // Remove o item de um lugar e adiciona em outro
    const newStoredData = storedData.filter((storedUnit) => storedUnit !== unit);
    setStoredData((prevStoredData: Unit[]) => [...newStoredData, updatedUnit]);

    setGroupedDataRepeticao(updatedGroupedData);
  };

  useEffect(() => {
    console.log(storedData);
  }, [storedData]);

  const teste = () => {
    const newConstructionData = {
      ...constructionData,
      unidades_repeticao: storedData,
    };
    mountBody(newConstructionData);
    mutation.mutate(newConstructionData);
  };

  return (
    <>
      {
        !sended ?
          <div className="w-screen h-auto flex justify-center items-center p-20">
            <div className="w-full max-w-screen-lg">
              <CreateUnipDropdown
                title='Escolher quantidade e peso de unidades individuais'
              >
                <div>
                  <p className="text-center mb-4">Unidades individuais agrupadas por local</p>
                  {Object.entries(groupedDataIndividual).map(([place, units], index) => (
                    <div key={index}>
                      <h2 className="text-center mb-2">{`Local: ${place}`}</h2>
                      <table className="w-full mb-4 border">
                        <thead>
                          <tr>
                            <th>Ambiente</th>
                            <th>Macro Service</th>
                            <th>Subservice</th>
                            <th>Quantidade</th>
                            <th>Unidade</th>
                            <th>Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {units &&
                            units.map((item: Unit, idx: number) => (
                              <tr key={idx} className={item.isDisabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}>
                                <td className="border">{item.ambient}</td>
                                <td className="border">{item.macro_name}</td>
                                <td className="border">{item.name}</td>
                                <td className="border">
                                  <input
                                    type="number"
                                    defaultValue={item.quantidade}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      setGroupedDataIndividual((prevGroupedData) => {
                                        const updatedGroupedData: { [key: string]: Unit[] } = { ...prevGroupedData };
                                        updatedGroupedData[place][idx].quantidade = value;
                                        return updatedGroupedData;
                                      });
                                    }}
                                  />
                                </td>
                                <td className="border">
                                  <input
                                    type="number"
                                    defaultValue={item.peso}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      setGroupedDataIndividual((prevGroupedData) => {
                                        const updatedGroupedData: { [key: string]: Unit[] } = { ...prevGroupedData };
                                        updatedGroupedData[place][idx].peso = value;
                                        return updatedGroupedData;
                                      });
                                    }}
                                  />
                                </td>
                                <td className="border">
                                  <button className={`${!item.isDisabled ? 'bg-green-500' : 'bg-white'} w-full h-full`} onClick={() => handleOKClickIndividual(item, place, item.quantidade, item.peso)}><p className="text-white font-extrabold">OK</p></button>
                                </td>
                              </tr>
                            ))}

                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </CreateUnipDropdown>
              <CreateUnipDropdown
                title='Escolher quantidade e peso de unidades repetição'
              >
                <div>
                  <p className="text-center mb-4">Unidades de repetição agrupadas por ambiente</p>
                  {Object.entries(groupedDataRepeticao).map(([ambient, units], index) => (
                    <div key={index}>
                      <h2 className="text-center mb-2">{`Ambiente: ${ambient}`}</h2>
                      <table className="w-full mb-4 border">
                        <thead>
                          <tr>
                            <th>Macro Service</th>
                            <th>Subservice</th>
                            <th>Quantidade</th>
                            <th>Unidade</th>
                            <th>Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {units &&
                            units.map((item: Unit, idx: number) => {
                              if (idx > 0 && units[idx - 1].name === item.name) {
                                return null;
                              }
                              return (
                                <tr key={idx} className={item.isDisabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}>
                                  <td className="border">{item.macro_name}</td>
                                  <td className="border">{item.name}</td>
                                  <td className="border">
                                    <input
                                      type="number"
                                      defaultValue={item.quantidade}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setGroupedDataRepeticao((prevGroupedData) => {
                                          const updatedGroupedData: { [key: string]: Unit[] } = { ...prevGroupedData };
                                          updatedGroupedData[ambient][idx].quantidade = value;
                                          return updatedGroupedData;
                                        });
                                      }}
                                    />
                                  </td>
                                  <td className="border">
                                    <input
                                      type="number"
                                      defaultValue={item.peso}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setGroupedDataRepeticao((prevGroupedData) => {
                                          const updatedGroupedData: { [key: string]: Unit[] } = { ...prevGroupedData };
                                          updatedGroupedData[ambient][idx].peso = value;
                                          return updatedGroupedData;
                                        });
                                      }}
                                    />
                                  </td>
                                  <td className="border">
                                    <button className={`bg-green-500 w-full h-full`} onClick={() => handleOKClickRepeticao(item, ambient, item.quantidade, item.peso)}>OK</button>
                                  </td>
                                </tr>
                              );
                            })}

                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </CreateUnipDropdown>
              <div className='w-full flex justify-end'>
                <button className='bg-green-500 px-5 py-2 rounded-sm' type="button" onClick={teste}>
                  <p className='font-bold text-white'>Salvar sub-services</p>
                </button>
              </div>
            </div>
          </div>

          :

          <div className="w-screen h-screen h-auto flex justify-center items-center p-20 flex flex-col">
            <div className="flex flex-col justify-center items-center mb-10">
              <p>Obra cadastrada com sucesso.</p>
              <TbCircleCheckFilled className="text-9xl text-green-500"/>
            </div>
            <strong>
              <Link href="/home/cadastro/obras">
                Continuar cadastrando uma obra.
              </Link>
            </strong>
            <p>ou</p>
              <Link href="/home">
                Voltar para a página principal.
              </Link>
          </div>
      }
    </>
  );
}
