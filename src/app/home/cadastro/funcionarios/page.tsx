"use client";

import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getContracts, getPayments, getPositions } from "@/services/api";

import { useHookFormMask } from "use-mask-input";
import { PaymentsData } from "@/types/PaymentsType";
import { PositionsData } from "@/types/PositionsType";
import { ContractsData } from "@/types/ContractsType";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatDate";

const createEmployeeFormSchema = z.object({
  employee: z.object({
    ra: z.string().nonempty("O RA é obrigatório."),
    first_name: z.string().nonempty("O nome é obrigatório."),
    last_name: z.string().nonempty("O sobrenome é obrigatório."),
    alternative_name: z.string().nonempty("O apelido é obrigatório."),
    admission_date: z.string().nonempty("A data de admissão é obrigatória."),
    salary: z.coerce.number().min(1, "Campo obrigatório."),
    lunch_cost: z.coerce.number().min(1, "Campo obrigatório."),
    ticket_cost: z.coerce.number().min(1, "Campo obrigatório."),
    payment_id: z.coerce.number(),
    contract_id: z.coerce.number(),
    position_id: z.coerce.number(),
    dinner: z.string().nonempty("Campo obrigatório."),
    lunch: z.string().nonempty("Campo obrigatório."),
    total_cost: z.coerce.number().min(1, "Campo obrigatório."),
  }),
});

type createEmployeeFormData = z.infer<typeof createEmployeeFormSchema>;

export default function Employee() {
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<createEmployeeFormData>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(createEmployeeFormSchema),
  });

  const [contracts, setContracts] = useState<ContractsData[]>([]);
  console.log(contracts);
  const [payments, setPayments] = useState<PaymentsData[]>([]);
  const [positions, setPositions] = useState<PositionsData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [contractsData, paymentsData, positionsData] = await Promise.all([
        getContracts(),
        getPayments(),
        getPositions(),
      ]);

      setContracts(contractsData);
      setPayments(paymentsData);
      setPositions(positionsData);
    }

    fetchData();
  }, []);

  const registerWithMask = useHookFormMask(register);

  const createEmployee: SubmitHandler<createEmployeeFormData> = async (
    data: createEmployeeFormData
  ) => {
    try {
      const formattedDate = formatDate(data.employee.admission_date);

      const requestData = {
        ...data,
        employee: {
          ...data.employee,
          admission_date: formattedDate,
        },
      };

      console.log(requestData);

      const url = "http://localhost:3333/employees";

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!request.ok) {
        const error = await request.json();
        setError("employee.ra", { type: "manual", message: error.message });
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

  const onError: SubmitErrorHandler<createEmployeeFormData> = (errors) => {
    console.log(errors);
  };

  return (
    <div className="w-[1510px] h-screen flex justify-center">
      <div className="flex flex-col items-center mt-10 gap-10">
        <h1 className="text-3xl font-medium">Cadastro de Funcionários</h1>
        <div className=" w-[500px] h-[400px]">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(createEmployee, onError)}
          >
            <Input
              label="RA"
              {...register("employee.ra")}
              variant="bordered"
              isInvalid={errors.employee?.ra ? true : false}
              errorMessage={errors.employee?.ra?.message}
              isClearable
              isRequired
            />
            <Input
              label="Nome"
              {...register("employee.first_name")}
              variant="bordered"
              isInvalid={errors.employee?.first_name ? true : false}
              errorMessage={errors.employee?.first_name?.message}
              isClearable
              isRequired
            />
            <Input
              label="Sobrenome"
              {...register("employee.last_name")}
              variant="bordered"
              isInvalid={errors.employee?.last_name ? true : false}
              errorMessage={errors.employee?.last_name?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Apelido"
              {...register("employee.alternative_name")}
              variant="bordered"
              isInvalid={errors?.employee?.alternative_name ? true : false}
              errorMessage={errors?.employee?.alternative_name?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Data de admissão"
              {...registerWithMask("employee.admission_date", ["99/99/9999"], {
                required: true,
              })}
              placeholder="__/__/____"
              variant="bordered"
              isInvalid={errors?.employee?.admission_date ? true : false}
              errorMessage={errors?.employee?.admission_date?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Salário"
              {...register("employee.salary")}
              variant="bordered"
              isInvalid={errors?.employee?.salary ? true : false}
              errorMessage={errors?.employee?.salary?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Alimentação"
              {...register("employee.salary")}
              variant="bordered"
              isInvalid={errors?.employee?.salary ? true : false}
              errorMessage={errors?.employee?.salary?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Transporte"
              {...register("employee.salary")}
              variant="bordered"
              isInvalid={errors?.employee?.salary ? true : false}
              errorMessage={errors?.employee?.salary?.message}
              isClearable
              isRequired
            />
            <Input
              type="text"
              label="Custo total"
              {...register("employee.total_cost")}
              variant="bordered"
              isInvalid={errors?.employee?.total_cost ? true : false}
              errorMessage={errors?.employee?.total_cost?.message}
              isClearable
              isRequired
            />
            <Select
              {...register("employee.contract_id")}
              variant="bordered"
              label="Tipo do contrato"
              isRequired
            >
              {contracts.map((contract) => (
                <SelectItem
                  value={contract.id}
                  key={contract.id}
                  variant="bordered"
                >
                  {contract.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              {...register("employee.payment_id")}
              variant="bordered"
              label="Forma de pagamento"
              isRequired
            >
              {payments.map((payment) => (
                <SelectItem
                  value={payment.id}
                  key={payment.id}
                  variant="bordered"
                >
                  {payment.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              {...register("employee.position_id")}
              variant="bordered"
              label="Cargo"
              isRequired
            >
              {positions.map((position) => (
                <SelectItem
                  value={position.id}
                  key={position.id}
                  variant="bordered"
                >
                  {position.name}
                </SelectItem>
              ))}
            </Select>
            <Button color="success" isLoading={isSubmitting} type="submit">
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
