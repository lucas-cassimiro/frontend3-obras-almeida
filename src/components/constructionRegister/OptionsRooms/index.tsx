import { useMacro } from "@/contexts/MacroservicesContext";
import { useSub } from "@/contexts/SubservicesContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OptionRooms({
    name,
    room
}: any) {
    const [selectedServices, setSelectedServices] = useState<{ [key: string]: string[] }>({});
    const { data } = useMacro();
    const { subservice } = useSub();

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

    const handleSubCheckbox = (macroId: string, subId: string) => {
        setSelectedServices(prevState => {
            const isSelected = prevState[macroId]?.includes(subId);

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

    useEffect(() => {
        console.log("Selected Services:", selectedServices);
    }, [selectedServices]);

    return (
        <main className="flex">
            <div className="flex flex-row">
                <div><h1 className="text-red-500">{name}</h1></div>
                <div>
                    {room.map((roomItem: string) => (
                        <div key={roomItem}>
                            <p>{roomItem}</p>
                            {data.map((dataItem: any) => (
                                <div key={dataItem.macroservice}>
                                    <input 
                                        type="checkbox" 
                                        value={dataItem.id} 
                                        onChange={() => handleMacroCheckbox(dataItem.id)}
                                        checked={!!selectedServices[dataItem.id]}
                                    />
                                    <label>{dataItem.macroservice}</label>
                                    {selectedServices[dataItem.id] && subservice
                                        .filter((subItem:any)=> subItem.macro_id === dataItem.id)
                                        .map((subItem:any) => (
                                            <div key={subItem.id}>
                                                <input 
                                                    type="checkbox" 
                                                    value={subItem.id} 
                                                    onChange={() => handleSubCheckbox(dataItem.id, subItem.id)}
                                                    checked={selectedServices[dataItem.id].includes(subItem.id)}
                                                />
                                                <label>{subItem.subservice}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
