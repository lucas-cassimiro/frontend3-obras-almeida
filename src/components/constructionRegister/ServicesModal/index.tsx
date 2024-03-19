import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, children, sub, macro, sendToModal, setUnit }: any) => {
  const [selectedMacroIds, setSelectedMacroIds] = useState<string[]>([]);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [unitArray, setUnitArray] = useState<any>([])
  const [newArray, setNewArray] = useState<any>([])

  useEffect(() => {
    setUnit(newArray);
  }, [newArray]);

  if (!isOpen) return null;
  const mountToData = () => {
    console.log(unitArray)
    unitArray.forEach((item: any) => {
      item.sub_ids.forEach((sub: any) => {
        const newObj = {
          ambient: item.name,
          place: sendToModal.unity,
          sub_id: sub
        }
        setNewArray((prevNewArray: any) => [...prevNewArray, newObj]);
      })
    })
  }

  const handleMacroCheckboxChange = (macroId: string) => {
    if (selectedMacroIds.includes(macroId)) {
      setSelectedMacroIds(selectedMacroIds.filter(id => id !== macroId));
      setSelectedSubIds(selectedSubIds.filter(subId => sub.find((subItem: any) => subItem.macro_id === macroId && subItem.id !== subId)));
    } else {
      setSelectedMacroIds([...selectedMacroIds, macroId]);
    }
  };

  const handleSubCheckboxChange = (subId: string, macroId: string) => {
    if (selectedSubIds.includes(subId)) {
      setSelectedSubIds(selectedSubIds.filter(id => id !== subId));
    } else {
      setSelectedSubIds([...selectedSubIds, subId]);
    }
  };

  const goToNext = () => {

    setIsDisabled(false)
    if (selectedMacroIds.length > 0) {
      return alert('Salve os dados')
    }
    if (currentIndex == sendToModal.locals.length - 1) {
      setSelectedMacroIds([]);
      setSelectedSubIds([]);
      setCurrentIndex(0)
      mountToData()
      setUnitArray([])
      return onClose()
    } else {
      setCurrentIndex(currentIndex === sendToModal.locals.length - 1 ? 0 : currentIndex + 1);
    }
  };

  const teste = () => {
    setIsDisabled(true);
    const newObj = {
      name: sendToModal.locals[currentIndex],
      sub_ids: selectedSubIds
    };

    setUnitArray((prevUnitArray: any) => [...prevUnitArray, newObj]);

    console.log(unitArray)

    setSelectedMacroIds([]);
    setSelectedSubIds([]);
  };

  return (
    <div className="modal fixed inset-0 overflow-y-auto z-50 bg-black bg-opacity-50">
      <div className="modal-content relative mx-auto max-w-4xl p-4 bg-white mt-40" style={{ width: '80%' }}>
        <span className="close absolute top-0 right-0 p-2" onClick={onClose}>&times;</span>
        <div className='carousel-item h-96 overflow-y-auto'>
          <div className='w-100 flex justify-center '>
            <strong>{sendToModal.unity} - {sendToModal.locals[currentIndex].toUpperCase()}</strong>
          </div>
          {sendToModal.locals.map((item: any, index: number) => (
            <div key={index} className={`${index === currentIndex ? 'active' : 'hidden'}`}>
              {macro.map((macroItem: any) => (
                <div className={`${isDisabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`} key={macroItem.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedMacroIds.includes(macroItem.id)}
                      onChange={() => handleMacroCheckboxChange(macroItem.id)}
                    />
                    {macroItem.macroservice}
                  </label>
                  {selectedMacroIds.includes(macroItem.id) && (
                    <div className="ml-4">
                      {sub
                        .filter((subItem: any) => subItem.macro_id === macroItem.id)
                        .map((subItem: any) => (
                          <div key={subItem.id}>
                            <input
                              type="checkbox"
                              checked={selectedSubIds.includes(subItem.id)}
                              onChange={() => handleSubCheckboxChange(subItem.id, macroItem.id)}
                            />
                            <label htmlFor="">{subItem.subservice}</label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="carousel-buttons flex justify-end mt-4">
          <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-sm mb-4" onClick={teste}>Salvar Sub-services</button>
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-sm mb-4" onClick={goToNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
