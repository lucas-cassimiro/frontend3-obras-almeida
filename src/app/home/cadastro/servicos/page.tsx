import Image from "next/image"
import EmployeeImage from "../../../../assets/plate.jpeg"
export default function InConstructionPage(){
    return(
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Página em construção.</h1>
            <Image
                src={EmployeeImage}
                alt='Funcionários'
            />
        </div>
    )
}