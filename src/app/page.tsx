"use client";

import { useForm, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import logo from "@/assets/logo.png";

import Image from "next/image";
// import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
// import { AuthContext } from "@/contexts/AuthContext";
import { Button, Input } from "@nextui-org/react";

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
        <div className="w-[30rem] h-[16rem] p-[2.1875rem] bg-[#181920] rounded-[10px] max-h-[16rem]">
          <form
            className="flex flex-col w-full gap-5"
            // onSubmit={handleSubmit(handleSignIn, onError)}
          >
            {/* <Image src={logo} alt="Logo da empresa" className="w-[100px] h-[200px]"/> */}
            <Input
              type="text"
              variant="bordered"
              placeholder="Nome de usuário"
              {...register("username")}
              className="text-white"
              isInvalid={errors.username ? true : false}
              errorMessage={errors.username?.message}
              isClearable
              isRequired
            />

            <Input
              type="password"
              variant="bordered"
              placeholder="Digite sua senha"
              className="text-white"
              {...register("password_hash")}
              isInvalid={errors.password_hash ? true : false}
              errorMessage={errors.password_hash?.message}
              isClearable
              isRequired
            />
            <Button
              isLoading={isSubmitting}
              type="submit"
              className="bg-[#5568FE] text-white"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
