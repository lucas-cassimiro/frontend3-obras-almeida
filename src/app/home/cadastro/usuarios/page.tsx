"use client";

import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getPermissions } from "@/services/api";
import { PermissionsData } from "@/types/PermissionsType";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from "react-toastify";

const createUserFormSchema = z
  .object({
    username: z.string().nonempty("O nome de usuário é obrigatório."),
    first_name: z
      .string()
      .nonempty("Campo obrigatório.")
      .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas.")
      .transform((name) => {
        return name.trim().replace(/^\w/, (c) => c.toLocaleUpperCase());
      }),
    last_name: z
      .string()
      .nonempty("Campo obrigatório.")
      .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas.")
      .transform((name) => {
        return name.trim().replace(/^\w/, (c) => c.toLocaleUpperCase());
      }),
    password_hash: z
      .string()
      .nonempty("A senha é obrigatória.")
      .min(6, "Verifique se a sua senha tem pelo menos 6 caracteres."),
    confirm_password: z.string().nonempty("Informe a senha novamente."),
    permission_id: z.coerce.number(),
  })
  .refine(
    ({ password_hash, confirm_password }) => password_hash === confirm_password,
    {
      message: "As senhas informadas não correspondem. Tente novamente.",
      path: ["confirm_password"],
    }
  );

type createUserFormData = z.infer<typeof createUserFormSchema>;

export default function Users() {
  const [permissions, setPermissions] = useState<PermissionsData[]>([]);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<createUserFormData>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(createUserFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getPermissions();
      setPermissions(data);
    }

    fetchData();
  }, []);

  const createUser: SubmitHandler<createUserFormData> = async (
    data: createUserFormData
  ) => {
    try {
      console.log(data);

      const { confirm_password, ...postData } = data;

      const url = "http://191.101.70.229:3333/users";

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!request.ok) {
        const error = await request.json();
        setError("username", { type: "manual", message: error.message });
        toast.error(error.message);
        throw new Error(error.message);
      }

      const response = await request.json();
      console.log(response);
      reset();
      toast.success(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-full pl-20 flex flex-col items-center mt-10 gap-10">
      <h1 className="text-3xl font-medium">Cadastro de Usuários</h1>
      <div className=" w-[500px] h-[400px]">
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(createUser)}
        >
          <Input
            label="Nome de usuário"
            {...register("username")}
            variant="bordered"
            isInvalid={errors.username ? true : false}
            errorMessage={errors.username?.message}
            isClearable
          />
          <Input
            label="Nome"
            {...register("first_name")}
            variant="bordered"
            isInvalid={errors.first_name ? true : false}
            errorMessage={errors.first_name?.message}
            isClearable
          />
          <Input
            label="Sobrenome"
            {...register("last_name")}
            variant="bordered"
            isInvalid={errors.last_name ? true : false}
            errorMessage={errors.last_name?.message}
            isClearable
          />
          <Input
            type="password"
            label="Senha"
            {...register("password_hash")}
            variant="bordered"
            isInvalid={errors.password_hash ? true : false}
            errorMessage={errors.password_hash?.message}
            isClearable
          />
          <Input
            type="password"
            label="Confirmação de senha"
            {...register("confirm_password")}
            variant="bordered"
            isInvalid={errors.confirm_password ? true : false}
            errorMessage={errors.confirm_password?.message}
            isClearable
          />
          <Select
            {...register("permission_id")}
            variant="bordered"
            label="Nível de acesso"
          >
            {permissions.map((permission) => (
              <SelectItem
                value={permission.id}
                key={permission.id}
                variant="bordered"
              >
                {permission.access_name}
              </SelectItem>
            ))}
          </Select>
          <Button color="success" isLoading={isSubmitting} type="submit">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
