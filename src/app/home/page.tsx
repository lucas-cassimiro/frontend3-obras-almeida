import logo from "@/assets/logo.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center">
      <Image src={logo} alt="Logo da empresa" className="m-auto"/>
    </div>
  );
}
