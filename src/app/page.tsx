"use client";

import { useForm, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import logo from "@/assets/logo.png";

import Image from "next/image";
// import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
// import { AuthContext } from "@/contexts/AuthContext";

const signInFormSchema = z.object({
  username: z.string().nonempty("O nome de usuário é obrigatório."),
  password_hash: z.string().nonempty("A senha é obrigatória."),
});

type signInFormData = z.infer<typeof signInFormSchema>;

export type FormData = {
  username: string;
  password_hash: string;
};

export default function Login() {
  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signInFormData>({
    defaultValues: {
      username: "",
      password_hash: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(signInFormSchema),
  });

  // const { signIn } = useContext(AuthContext);

  // async function handleSignIn(data: signInFormData) {
  //   await signIn(data);
  //   reset();
  // }

  const onError: SubmitErrorHandler<signInFormData> = (errors) =>
    console.log(errors);

  return (
    <div className="bg-[#1B1F27] overflow-hidden">
      <div className="flex h-screen justify-center items-center">
        <div className="w-[30rem] h-[25rem] p-[2.1875rem] bg-[#181920] rounded-[10px]">
          <form
            className="flex flex-col w-full"
            // onSubmit={handleSubmit(handleSignIn, onError)}
          >
            {/* <Image src={logo} alt="Logo da empresa" className="w-[100px] h-[200px]"/> */}
            <input
              type="text"
              placeholder="Nome de usuário"
              className={`${
                errors.username ? "bg-[#F2DEDE]" : ""
              } mt-3 bg-[#252A34] border-none h-[2.8125rem] outline-none rounded-lg placeholder:text-[#CBD0F7]`}
              {...register("username")}
            />
            {errors.username && (
              <span className="text-[#F31260] text-sm mt-2">
                {errors.username.message}
              </span>
            )}
            <input
              type="password"
              placeholder="Digite sua senha"
              className="mt-3 bg-[#252A34] border-none h-[2.8125rem] outline-none rounded-lg placeholder:text-[#CBD0F7]"
              {...register("password_hash")}
            />
            {errors.password_hash && (
              <span className="text-[#F31260] text-sm mt-2">
                {errors.password_hash.message}
              </span>
            )}
            <button className="mt-3 bg-[#5568FE] border-none h-[2.8125rem] outline-none rounded-lg text-[#CBD0F7] uppercase text-xl font-bold">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
