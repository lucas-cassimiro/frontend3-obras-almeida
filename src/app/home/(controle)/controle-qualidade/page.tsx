"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import { getWorksAddress } from "@/services/api";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { WorkData } from "@/types/WorkType";
import { toast } from "react-toastify";

type ProductivityData = {
  id: number;
  employee_id: number;
  employees: {
    id: number;
    ra: string;
    first_name: string;
    last_name: string;
    alternative_name: string;
    admission_date: Date | string;
    salary: string;
    lunch_cost: string;
    ticket_cost: string;
    payment_id: number;
    contract_id: number;
    position_id: number;
    dinner: string;
    lunch: string;
    total_cost: string;
  };
  obra_id: number;
  place: string;
  sub_id: number;
  subservices: {
    id: number;
    macro_id: number;
    unit_id: number;
    subservice: string;
    macroservices: { id: number; macroservice: string };
  };
  quantity: number;
  weight: number;
  created_at: Date | string;
};

const nonconformity = [
  {
    label: "Sim",
    value: "Sim",
  },
  {
    label: "Não",
    value: "Não",
  },
];

export default function QualityControl() {
  const [workId, setWorkId] = useState<string>("");
  const [presenceDate, setPresenceDate] = useState<string>("");
  const [productivityData, setProductivityData] = useState<ProductivityData[]>(
    []
  );
  const [works, setWorks] = useState<WorkData[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [action, setAction] = useState<string[]>([]);

  console.log(productivityData);

  useEffect(() => {
    async function fetchData() {
      const data = await getWorksAddress();
      setWorks(data);
    }

    fetchData();
  }, []);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWorkId(event.target.value);
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresenceDate(event.target.value);
  };

  const getDados = async () => {
    try {
      const response = await fetch(
        `http://localhost:3333/productivityControl/?select=${workId}&data=${presenceDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        throw new Error(error.message);
      }

      const data = await response.json();
      setProductivityData(data);
      toast.success("Dados carregados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResultadoChange = (value: string, index: number) => {
    const novosResultados = [...result];
    novosResultados[index] = value;
    setResult(novosResultados);
  };

  const handleAcaoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const novasAcoes = [...action];
    novasAcoes[index] = event.target.value;
    setAction(novasAcoes);
  };

  const handleRegisterControl = async () => {
    const dadosRegistrados = productivityData.map((data, index) => ({
      id: data.id,
      resultado: result[index],
      acao: action[index],
    }));

    console.log(dadosRegistrados);

    try {
      const url = "http://localhost:3333/qualityControl";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosRegistrados),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success("Dados registrados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen pl-20">
      <div className="h-screen flex justify-center ">
        <div className=" pt-10 w-[1200px]">
          <h1 className="uppercase font-semibold text-[40px]">
            Controle de qualidade
          </h1>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <label htmlFor="work">Obra:</label>
              <Select
                id="work"
                onChange={handleChangeSelect}
                className="w-64"
                placeholder="Selecione uma obra"
              >
                {works.map((work) => (
                  <SelectItem value={work.id} key={work.id}>
                    {work.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <input
              type="date"
              value={presenceDate}
              onChange={handleChangeDate}
            />
          </div>
          <Button
            color="success"
            type="submit"
            onClick={getDados}
            className="mt-10 text-sm font-medium"
          >
            Carregar Lista de Funcionários
          </Button>

          <form className="mt-10">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Local</th>
                  <th>Macro Serviço</th>
                  <th>Sub Serviço</th>
                  <th>Quantidade</th>
                  <th>Resultado</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {productivityData.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.employees.alternative_name}</td>
                    <td>{data.place}</td>
                    <td>{data.subservices.macroservices.macroservice}</td>
                    <td>{data.subservices.subservice}</td>
                    <td>{data.quantity}</td>
                    <td>
                      <Select
                        label="Alguma inconformidade?"
                        onChange={(event) =>
                          handleResultadoChange(event.target.value, index)
                        }
                        value={result[index] || ""}
                      >
                        {nonconformity.map((option) => (
                          <SelectItem value={option.value} key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </td>
                    <td>
                      <Input
                        placeholder="Informe a ação"
                        value={action[index] || ""}
                        onChange={(event) => handleAcaoChange(event, index)}
                        className="w-[100px]"
                        disabled={result[index] === "Completo"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              type="button"
              color="success"
              className="mt-10 w-60 text-base font-medium"
              onClick={handleRegisterControl}
            >
              Registrar controle
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}