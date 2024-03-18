import { useState } from "react";

export function UnityRoomInput({ index, onAddUnit }: any) {
    const [inputValue, setInputValue] = useState('');
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      onAddUnit(index, newValue); 
    };
  
    return (
      <div>
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite o nome da unidade"
        />
      </div>
    );
  }
