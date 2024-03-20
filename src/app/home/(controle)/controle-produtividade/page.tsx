"use client";

import { getWorksAddress } from "@/services/api";
import { WorkData } from "@/types/WorkType";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface RowData {
  selectedPlace: any;
  selectedAmbient: string;
  selectedMacroService: string;
  selectedSubService: string;
  quantity: string;
  weight: string;
}

type EmployeeInWorkData = {
  id: string;
  obra_id: number;
  employee_id: number;
  presence_date: Date | string;
  arrival_time: Date;
  employees: {
    id: number;
    ra: string;
    first_name: string;
    last_name: string;
    alternative_name: string;
    admission_date: string;
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
};

type Subservice = {
  id: number;
  sub_id: number;
  quantity: number;
  weight: number;
  subservices: {
    id: number;
    macro_id: number;
    unit_id: number;
    subservice: string;
    macroservices: {
      id: number;
      macroservice: string;
    };
  };
};

type Ambiente = {
  ambient_name: string;
  subservice: Subservice[];
};

type WorkManagementData = {
  name: string;
  ambiente: Ambiente[];
};

export default function ProductivityController() {
  const [workId, setWorkId] = useState<string>("");
  const [presenceDate, setPresenceDate] = useState<string>("");

  const [works, setWorks] = useState<WorkData[]>([]);

  const [selectData, setSelectData] = useState<{
    employeeInWork: any;
    workManagement: any;
  } | null>(null);

  const [rowData, setRowData] = useState<any[]>([]);
  console.log(rowData);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWorkId(event.target.value);
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresenceDate(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const data: WorkData[] = await getWorksAddress();
      setWorks(data);
    }

    fetchData();
  }, []);

  const getDados = async () => {
    try {
      const response = await fetch(
        `http://191.101.70.229:3333/presence/?select=${workId}&data=${presenceDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        // toast.error("Informe a obra e a data");
        throw new Error(error.message);
      }

      const data = await response.json();
      setSelectData(data);

      toast.success("Dados carregados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const updateRowData = (
    index: number,
    employees: any,
    place: string,
    ambient: string,
    selectedMacroService: string,
    subId: number,
    quantity: string,
    weight: string
  ) => {
    const newDataObject = {
      workId,
      presenceDate,
      employees,
      place,
      ambient,
      selectedMacroService,
      subId,
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
      const url = "http://191.101.70.229:3333/productivityControl";

      const modifiedRowData = rowData.map((row: any) => {
        const { selectedMacroService, ...rowDataWithoutMacroService } = row;
        return rowDataWithoutMacroService;
      });

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedRowData),
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
      employees: any,
      place: string,
      ambient: string,
      selectedMacroService: string,
      subId: number,
      quantity: string,
      weight: string
    ) => void;
  }) => {
    const [place, setPlace] = useState<string>("");
    const [ambient, setAmbient] = useState<string>("");
    const [selectedMacroService, setSelectedMacroService] =
      useState<string>("");
    const [subId, setSubId] = useState<number>(0);
    const [quantity, setQuantity] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [employeeArray, setEmployeeArray] = useState<any[]>([]);
    console.log(employeeArray);

    const handleSelectPlace = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setPlace(value);
    };

    const handleSelectAmbient = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setAmbient(value);
    };

    const handleSelectMacroService = (
      event: ChangeEvent<HTMLSelectElement>
    ) => {
      const value = event.target.value;
      setSelectedMacroService(value);
    };

    const handleSelectSubService = (event: ChangeEvent<HTMLSelectElement>) => {
      const id = parseInt(event.target.value);
      setSubId(id);
    };

    const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuantity(value);
    };

    const handleWeightChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWeight(value);
    };

    useEffect(() => {
      setEmployeeArray((prevData) => {
        const newData = [...prevData];
        newData[index] = { employee_id: employee.employees.id };
        return newData;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateRowData = () => {
      updateRowData(
        index,
        employeeArray[index].employee_id,
        place,
        ambient,
        selectedMacroService,
        subId,
        quantity,
        weight
      );
    };

    return (
      <tr className="flex justify-between w-full">
        <td>{employee.employees.alternative_name}</td>
        <td>
          <select className="w-48" value={place} onChange={handleSelectPlace}>
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
            value={ambient}
            onChange={handleSelectAmbient}
            disabled={!place}
          >
            <option value="">Selecione uma opção</option>
            {place &&
              selectData?.workManagement
                .find((work: any) => work.name === place)
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
            disabled={!ambient}
          >
            <option value="">Selecione uma opção</option>
            {ambient &&
              selectData?.workManagement
                .find((work: any) => work.name === place)
                ?.ambiente.find((amb: any) => amb.ambient_name === ambient)
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
            value={subId}
            onChange={handleSelectSubService}
            disabled={!selectedMacroService}
          >
            <option value={0}>Selecione uma opção</option>
            {selectedMacroService &&
              selectData?.workManagement
                .find((work: any) => work.name === place)
                ?.ambiente.find((amb: any) => amb.ambient_name === ambient)
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
            type="number"
            placeholder="Digite a quantidade"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </td>
        <td>
          <Input
            type="number"
            placeholder="Digite o peso"
            value={weight}
            onChange={handleWeightChange}
          />
        </td>

        <Button onClick={handleUpdateRowData}>Salvar</Button>
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
                isRequired
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
