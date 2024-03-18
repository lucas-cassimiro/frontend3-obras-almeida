"use client"
import { useMacro } from '@/contexts/MacroservicesContext';
import { useSub } from '@/contexts/SubservicesContext';
import { SendToBack } from 'lucide-react';
import React, { useState, useEffect, use } from 'react';

function Teste() {
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: string[] }>({});
  const [constructionData, setConstructionData] = useState<any>({});
  const [constructionName, setConstructionName] = useState<string>('');
  const [constructionCep, setConstructionCep] = useState<string>('');
  const [constructionAddress, setConstructionAddress] = useState<string>('');
  const [houseQuantity, setHouseQuantity] = useState<number>(0);
  const [unitNames, setUnitNames] = useState<string[]>([]);
  const [roomQuantity, setRoomQuantity] = useState<number>(0);
  const [unitRoomNames, setUnitRoomNames] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [index, setIndex] = useState(0);
  const { data } = useMacro();
  const { subservice } = useSub();
  const [subId, setSubId] = useState<any>([])
  const [subArray, setSubArray] = useState<any>([])
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [isNextEnabled, setIsNextEnabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false)
  const [stepToStep, setStepToStep] = useState(true)
  
  useEffect(() => {
    setSelectedServices({});
  }, [index]);

  useEffect(() => {
    console.log('O estado isDisabled mudou:', isDisabled);
  }, [isDisabled]);

  
  // // Atualiza o índice quando os dados da construção são alterados
  // useEffect(() => {
  //   setIndex(0);
  // }, [constructionData]);

  const proxima = () => {
    if(index+1 === constructionData.unitRooms.length){
      setStepToStep(false)
      sendToBack()
    }
    setIsDisabled(false)
    setIndex((index + 1) % constructionData.unitRooms.length);
    setIsNextEnabled(false);
    setIsSaveEnabled(true);
  };

  const sendToBack = () => {
    console.log('SEND TO BACK')
    console.log(constructionData)
  }

  const handleStepOne = () => {
    const updatedData = {
      ...constructionData,
      name: constructionName,
      cep: constructionCep,
      address: constructionAddress
    };
    setConstructionData(updatedData);
    
    if (step === 1) {
      setStep(2);
    }
  };

  const handleStepTwo = () => {
    const constructionDataStepTwo = {
      ...constructionData,
      units: unitNames.slice(0, houseQuantity),
      roomQuantity: roomQuantity,
      unitRooms: unitRoomNames.slice(0, roomQuantity)
    };
    setConstructionData(constructionDataStepTwo);
    setStep(3);
  };

  const handleMacroCheckbox = (macroId: string) => {
    setSelectedServices(prevState => {
      if (prevState[macroId]) {
        const { [macroId]: omit, ...updatedState } = prevState;
        return updatedState;
      } else {
        return { ...prevState, [macroId]: [] };
      }
    });
  };

  const handleSubCheckbox = (macroId: string, subId: string, name:string) => {
    setSelectedServices(prevState => {
      const isSelected = prevState[macroId]?.includes(subId);
      // Atualiza o estado do subId
      setSubId((prevArray:any) => {
        if (!prevArray.includes(subId)) {
          return [...prevArray, subId]; // Adiciona o subId ao array se ele ainda não estiver presente
        } else {
          return prevArray; // Retorna o array sem modificações se o subId já estiver presente
        }
      });
      
      // Atualiza o estado do subArray
      setSubArray((prevArray:any) => {
        // Se o sub-serviço estiver sendo selecionado, adiciona ao array
        if (!isSelected) {
          // Verifica se o objeto já existe no array
          const isObjectExist = prevArray.some((obj: any) => obj.sub_id === subId);
          // Se o objeto não existir no array, adiciona-o
          if (!isObjectExist) {
            // Cria um novo objeto para cada item em constructionData.units
            constructionData.units.forEach((item:any) => {
              const newObj = {
                sub_id: subId,
                place: item,
                ambient: constructionData.unitRooms[index]
              };
              prevArray.push(newObj);
            });
          }
          return prevArray;
        } else {
          // Se o sub-serviço estiver sendo desmarcado, remove do array
          return prevArray.filter((obj: any) => obj.sub_id !== subId); // Remove o objeto do array
        }
      });
  
      // Atualiza o estado dos serviços selecionados
      if (isSelected) {
        const updatedServices = {
          ...prevState,
          [macroId]: prevState[macroId].filter(id => id !== subId)
        };
        return updatedServices;
      } else {
        const updatedServices = {
          ...prevState,
          [macroId]: [...(prevState[macroId] || []), subId]
        };
        return updatedServices;
      }
    });
  };
  
  
  

  const handleSaveData = () => {
    setIsDisabled(true)
  
    setConstructionData((prevData: any) => {
      if (prevData && prevData.unidades_repeticao) {
        return {
          ...prevData,
          unidades_repeticao: [...prevData.unidades_repeticao, ...subArray]
        };
      } else {
        return {
          ...prevData,
          unidades_repeticao: subArray
        };
      }
    });
  
    setSubArray([]);
    setIsSaveEnabled(false);
    setIsNextEnabled(true);
  };


  return (
    <main className='w-full h-screen flex flex-col items-center justify-center bg-slate-200'>
      <div className='flex flex-col w-4/6 item-center justify-center h-auto py-10 rounded-xl shadow-xl bg-white'>
      <h1 className='text-center text-4xl font-semibold mb-11'>CADASTRO DE OBRAS</h1>
      <form>
        {step === 1 && (
          <div className='flex flex-col px-8 rounded-2xl gap-4'>
            <div className='w-full flex flex-col gap-1.5'>
              <label>Nome da obra:</label>
              <input
                className='h-12 rounded-sm p-2 placeholder-gray-400 border border-gray-700'
                type="text"
                placeholder="Nome da obra"
                value={constructionName}
                onChange={e => setConstructionName(e.target.value)}
              />
            </div>
            <div className='w-full flex flex-col gap-1.5'>
              <label>CEP:</label>
              <input
                className='h-12 rounded-sm p-2 placeholder-gray-400 border border-gray-700'
                type="text"
                placeholder="CEP"
                value={constructionCep}
                onChange={e => setConstructionCep(e.target.value)}
              />
            </div>
            <div className='w-full flex flex-col gap-1.5'>
              <label>Endereço da obra:</label>
              <input
                className='h-12 rounded-sm p-2 placeholder-gray-400 border border-gray-700'
                type="text"
                placeholder="Endereço da obra"
                value={constructionAddress}
                onChange={e => setConstructionAddress(e.target.value)}
              />
            </div>
            <div className='w-full flex justify-end'>
              <button className='bg-green-500 px-5 py-2 rounded-sm' type="button" onClick={handleStepOne}>
                <p className='font-bold text-white'>AVANÇAR</p>
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <div className='h-auto flex flex-col px-8 rounded-2xl gap-4'>
            <div className='w-full flex flex-col gap-1.5'>
              <label>Quantas unidades de repetição?</label>
              <input
                className='rounded-sm p-2 placeholder-gray-400 border border-gray-700'
                type="number"
                value={houseQuantity}
                onChange={e => setHouseQuantity(parseInt(e.target.value))}
              />
            </div>
              {houseQuantity >= 1 &&
                [...Array(houseQuantity)].map((_, index) => (
                  <div className='gap-0' key={index}>
                    <input
                      className='h-12 p-2 placeholder-gray-400 border border-gray-700'
                      placeholder={`Nome da unidade ${index +1}`}
                      type="text"
                      value={unitNames[index] || ""}
                      onChange={e => {
                        const updatedNames = [...unitNames];
                        updatedNames[index] = e.target.value;
                        setUnitNames(updatedNames);
                      }}
                    />
                  </div>
                ))}
            <div className='w-full flex flex-col gap-1.5'>
              <label>Número de Locais da Unidade de Repetição:</label>
              <input
                placeholder='Nome do local'
                className='h-12 p-2 placeholder-gray-400 border border-gray-700'
                type="number"
                value={roomQuantity}
                onChange={e => setRoomQuantity(parseInt(e.target.value))}
              />
              {roomQuantity >= 1 &&
                [...Array(roomQuantity)].map((_, index) => (
                  <div key={index}>
                    <input
                      placeholder={`Nome do local ${index+1}`}
                      className='h-12 p-2 placeholder-gray-400 border border-gray-700'
                      type="text"
                      value={unitRoomNames[index] || ""}
                      onChange={e => {
                        const updatedNames = [...unitRoomNames];
                        updatedNames[index] = e.target.value;
                        setUnitRoomNames(updatedNames);
                      }}
                    />
                  </div>
                ))}
            </div>
            <div>
             <input type="number" />
            </div>
            <div className='w-full flex justify-end'>
              <button className='bg-green-500 px-5 py-2 rounded-sm' type="button" onClick={handleStepTwo}>
                <p className='font-bold text-white'>AVANÇAR</p>
              </button>
            </div>
            <div className=''></div>
            </div>

          </>
        )}
  {step === 3 && (
        stepToStep ? (<>
            <div className="flex flex-col items-center justify-center h-auto py-4">
              <h1 className="text-xl font-bold mb-4">{constructionData.unitRooms[index]}</h1>
              <div className={`max-h-64 w-6/12 overflow-y-auto mb-4 ${isDisabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {data.map((dataItem: any) => (
                  <div key={dataItem.id} className="mb-2">
                    <input
                      type="checkbox"
                      value={dataItem.id}
                      onChange={() => handleMacroCheckbox(dataItem.id)}
                      checked={!!selectedServices[dataItem.id]}
                      className="mr-2"
                    />
                    <label>{dataItem.macroservice}</label>
                    {selectedServices[dataItem.id] && subservice
                      .filter((subItem: any) => subItem.macro_id === dataItem.id)
                      .map((subItem: any) => (
                        <>
                          <div key={subItem.id} className="ml-4 mt-2">
                            <input
                              type="checkbox"
                              value={subItem.id}
                              onChange={() => handleSubCheckbox(dataItem.id, subItem.id, constructionData.unitRooms[index])}
                              checked={selectedServices[dataItem.id].includes(subItem.id)}
                              className="mr-2"
                            />
                            <label>{subItem.subservice}</label>
                            {selectedServices[dataItem.id].includes(subItem.id) && (
                              <>
                                <label className="ml-4">Peso:</label>
                                <input type="number" className="ml-1 w-14 border border-gray-400 rounded-sm px-2 py-1" />
                              </>
                            )}
                          </div>
                        </>
                      ))}
                  </div>
                ))}
              </div>
              <div className='w-full flex flex-row justify-end px-8'>
                <button disabled={!isSaveEnabled} type="button" onClick={handleSaveData} className="bg-green-500 text-white px-4 py-2 rounded-sm mb-4">
                Salvar Dados
              </button>
              <button disabled={!isNextEnabled} type="button" onClick={proxima} className="bg-blue-500 text-white px-4 py-2 rounded-sm mb-4">
                Próxima
              </button>
            </div>
          </div>
        </>) : <><div className="flex flex-col items-center justify-center h-auto py-4"><h1 className='text-xl font-bold mb-4'>ENVIADO!</h1></div></>
      )}

      </form>

      </div>
      
    </main>
  );
}

export default Teste;