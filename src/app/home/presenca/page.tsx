"use client";

import React, { useEffect, useState } from "react";
import {
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useHookFormMask, useInputMask } from "use-mask-input";
import { getEmployee, getWorksAddress } from "@/services/api";
import { EmployeeData } from "@/types/EmployeeType";
import { WorkData } from "@/types/WorkType";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";

const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/");
  const formatDate = `${year}-${month}-${day}`;
  return formatDate;
};

const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

const registerPresenceFormSchema = z.object({
  presenceDate: z.string().nonempty("Campo obrigatório."),
  work: z.coerce.number(),
  employees: z.array(z.coerce.number()), // Array de IDs de funcionários
  arrival_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // Hora de chegada
});

type registerPresenceFormData = z.infer<typeof registerPresenceFormSchema>;

export default function PresenceControl() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<registerPresenceFormData>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(registerPresenceFormSchema),
  });

  const registerWithMask = useHookFormMask(register);

  const [employee, setEmployee] = useState<EmployeeData[]>([]);
  const [work, setWork] = useState<WorkData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [employeesData, worksData] = await Promise.all([
        getEmployee(),
        getWorksAddress(),
      ]);
      setEmployee(employeesData);
      setWork(worksData);
    }

    fetchData();
  }, []);

  const registerPresenceControl: SubmitHandler<
    registerPresenceFormData
  > = async (data: registerPresenceFormData) => {
    try {
      const formattedDate = formatDate(data.presenceDate);
      const formattedTime = formatTime(data.arrival_time);

      const requestData = {
        presenceDate: formattedDate,
        work: data.work,
        employees: data.employees,
        arrival_time: formattedTime,
      };

      console.log(requestData);

      const url = "http://localhost:3333/presence";

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!request.ok) {
        const error = await request.json();
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

  const onError: SubmitErrorHandler<registerPresenceFormData> = (errors) => {
    console.log(errors);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-10">
      <h1 className="text-3xl font-medium">Folha de Presença</h1>
      <div className=" w-[500px] h-[400px]">
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(registerPresenceControl, onError)}
        >
          <Input
            label="Data de Presença"
            {...registerWithMask("presenceDate", ["99/99/9999"], {
              required: true,
            })}
            placeholder="__/__/____"
            variant="bordered"
            isInvalid={errors.presenceDate ? true : false}
            errorMessage={errors.presenceDate?.message}
            isClearable
            isRequired
          />
          <Select
            {...register("work")}
            variant="bordered"
            label="Obra"
            isRequired
          >
            {work.map((work) => (
              <SelectItem value={work.id} key={work.id} variant="bordered">
                {work.name}
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Funcionários:</span>
            {employee.map((employee) => (
              <div key={employee.id}>
                <input
                  type="checkbox"
                  value={employee.id}
                  {...register("employees")}
                />
                {employee.alternative_name}
              </div>
            ))}
          </div>
          <Input
            type="time"
            label="Horário de chegada"
            {...register("arrival_time")}
            variant="bordered"
            isInvalid={errors.arrival_time ? true : false}
            errorMessage={errors.arrival_time?.message}
            isClearable
            isRequired
          />
          <Button color="success" isLoading={isSubmitting} type="submit">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
