import Image from "next/image";
import OptionRooms from "../OptionsRooms";

export default function Macroservices({
    obj
}:any) {

    

  return (
    <main className="gap-20">
        Obra{obj.name}
        {
            Object.keys(obj.casas).map((item, index)=>(
                <OptionRooms key={item} name={item} room={obj.casas[item]}/>
            ))
        }
    </main>
  )
}
