"use client";

import { useSub } from "@/contexts/SubservicesContext";
import { getWorksAddress } from "@/services/api";
import { WorkData } from "@/types/WorkType";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";

import { useMutation } from "@tanstack/react-query";

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

// const mutation = useMutation({
//   mutationFn: () =>
// })

interface RowData {
  selectedPlace: any;
  selectedAmbient: string;
  selectedMacroService: string;
  selectedSubService: string;
  quantity: string;
  weight: string;
}

export default function ProductivityController() {
  const [selectValue, setSelectValue] = useState("");
  const [dateValue, setDateValue] = useState("");

  const [works, setWorks] = useState<WorkData[]>([]);

  const [selectData, setSelectData] = useState<{
    employeeInWork: any;
    workManagement: any;
  } | null>(null);

  const [rowData, setRowData] = useState<any[]>([]);
  console.log(rowData);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(event.target.value);
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getWorksAddress();
      setWorks(data);
    }

    fetchData();
  }, []);

  const getDados = async () => {
    try {
      const response = await fetch(
        `http://localhost:3333/presence/?select=${selectValue}&data=${dateValue}`
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log(data);
      setSelectData(data);
      toast.success("Dados carregados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const updateRowData = (
    index: number,
    selectedPlace: string,
    selectedAmbient: string,
    selectedMacroService: string,
    selectedSubServiceId: number,
    quantity: string,
    weight: string
  ) => {
    const newDataObject = {
      selectValue,
      dateValue,
      selectedPlace,
      selectedAmbient,
      selectedMacroService,
      selectedSubServiceId,
      quantity,
      weight,
    };

    if (Object.values(newDataObject).every((value) => value !== "")) {
      setRowData((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          ...newDataObject,
        };
        return newData;
      });
    } else {
      toast.error("Todos os campos devem ser preenchidos.");
    }
  };

  const onSubmit = async () => {
    try {
      const url = "http://localhost:3333/productivityControl/";

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowData),
      });

      if (!request.ok) {
        const error = await request.json();
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success("Controle de produtividade cadastrado.");
    } catch (error) {
      console.log(error);
    }
  };

  const TableRow = ({
    employee,
    index,
    updateRowData,
  }: {
    employee: any;
    index: number;
    updateRowData: (
      index: number,
      selectedPlace: string,
      selectedAmbient: string,
      selectedMacroService: string,
      selectedSubServiceId: number,
      quantity: string,
      weight: string
    ) => void;
  }) => {
    const [selectedPlace, setSelectedPlace] = useState<string>("");
    const [selectedAmbient, setSelectedAmbient] = useState<string>("");
    const [selectedMacroService, setSelectedMacroService] =
      useState<string>("");
    const [selectedSubServiceId, setSelectedSubServiceId] = useState<number>(0);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);

    const [quantity, setQuantity] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

    const handleSelectPlace = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setSelectedPlace(value);
    };

    const handleSelectAmbient = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setSelectedAmbient(value);
    };

    const handleSelectMacroService = (
      event: ChangeEvent<HTMLSelectElement>
    ) => {
      const value = event.target.value;
      setSelectedMacroService(value);
    };

    const handleSelectSubService = (event: ChangeEvent<HTMLSelectElement>) => {
      const id = parseInt(event.target.value);
      setSelectedSubServiceId(id);
    };

    const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuantity(value);
    };

    const handleWeightChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWeight(value);
    };

    const handleUpdateRowData = () => {
      updateRowData(
        index,
        selectedPlace,
        selectedAmbient,
        selectedMacroService,
        selectedSubServiceId,
        quantity,
        weight
      );
    };

    return (
      <tr className="flex justify-between w-full">
        <td>{employee.employees.alternative_name}</td>
        <td>
          <select
            className="w-48"
            value={selectedPlace}
            onChange={handleSelectPlace}
          >
            <option value="">Selecione uma opção</option>
            {selectData?.workManagement.map((work: any) => (
              <option key={work.id} value={work.name}>
                {work.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            className="w-48"
            value={selectedAmbient}
            onChange={handleSelectAmbient}
            disabled={!selectedPlace}
          >
            <option value="">Selecione uma opção</option>
            {selectedPlace &&
              selectData?.workManagement
                .find((work: any) => work.name === selectedPlace)
                ?.ambiente.map((amb: any) => amb.ambient_name)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                )
                .map((ambientName: any) => (
                  <option key={ambientName} value={ambientName}>
                    {ambientName}
                  </option>
                ))}
          </select>
        </td>
        <td>
          <select
            className="w-48"
            value={selectedMacroService}
            onChange={handleSelectMacroService}
            disabled={!selectedAmbient}
          >
            <option value="">Selecione uma opção</option>
            {selectedAmbient &&
              selectData?.workManagement
                .find((work: any) => work.name === selectedPlace)
                ?.ambiente.find(
                  (amb: any) => amb.ambient_name === selectedAmbient
                )
                ?.subservice.map(
                  (sub: any) => sub.subservices.macroservices.macroservice
                )
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                )
                .map((macroService: any) => (
                  <option key={macroService} value={macroService}>
                    {macroService}
                  </option>
                ))}
          </select>
        </td>
        <td>
          <select
            className="w-48"
            value={selectedSubServiceId}
            onChange={handleSelectSubService}
            disabled={!selectedMacroService}
          >
            <option value={0}>Selecione uma opção</option>
            {selectedMacroService &&
              selectData?.workManagement
                .find((work: any) => work.name === selectedPlace)
                ?.ambiente.find(
                  (amb: any) => amb.ambient_name === selectedAmbient
                )
                ?.subservice.filter(
                  (sub: any) =>
                    sub.subservices.macroservices.macroservice ===
                    selectedMacroService
                )
                .map((sub: any) => sub.subservices)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.findIndex(
                      (v: any) => v.subservice === value.subservice
                    ) === index
                )
                .map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subservice}
                  </option>
                ))}
          </select>
        </td>
        <td>
          <Input
            type="text"
            placeholder="Digite a quantidade"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </td>
        <td>
          <Input
            type="text"
            placeholder="Digite o peso"
            value={weight}
            onChange={handleWeightChange}
          />
        </td>
        <td>
          <Button onClick={handleUpdateRowData}>Salvar</Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-screen h-screen pl-20">
      <div className="h-screen flex justify-center ">
        <div className=" pt-10 w-[1200px]">
          <h1 className="uppercase font-semibold text-[40px]">
            Controle de produtividade
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

            <input type="date" value={dateValue} onChange={handleChangeDate} />
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
                <tr className="flex justify-between w-full">
                  <th>Funcionário</th>
                  <th>Local</th>
                  <th>Ambiente</th>
                  <th>Macro Serviço</th>
                  <th>Sub Serviço</th>
                  <th>Quantidade</th>
                  <th>Peso</th>
                </tr>
              </thead>
              <tbody>
                {selectData?.employeeInWork.map(
                  (employee: any, index: number) => (
                    <TableRow
                      key={index}
                      employee={employee}
                      updateRowData={updateRowData}
                      index={index}
                    />
                  )
                )}
              </tbody>
            </table>
            <Button
              type="submit"
              color="success"
              className="mt-10 w-60 text-base font-medium"
              onClick={onSubmit}
            >
              Registrar controle
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
