"use client";

import { getWorksAddress } from "@/services/api";
import { WorkData } from "@/types/WorkType";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function WeeklyPlanning() {
  const [works, setWorks] = useState<WorkData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data: WorkData[] = await getWorksAddress();
      setWorks(data);
    }

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen pl-20">
      <div className="h-screen flex justify-center ">
        <div className=" pt-10 w-[1200px]">
          <h1 className="uppercase font-semibold text-[40px]">
            PLANEJAMENTO SEMANAL
          </h1>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <label htmlFor="work">Obra:</label>
              {
                <Select
                  id="work"
                  className="w-64"
                  placeholder="Selecione uma obra"
                >
                  {works.map((work) => (
                    <SelectItem value={work.id} key={work.id}>
                      {work.name}
                    </SelectItem>
                  ))}
                </Select>
              }
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col gap-3">
                <label>Data Inicial</label>
                <input type="date" className="w-[200px]" />
              </div>
              <div className="flex flex-col gap-3">
                <label>Data Final</label>
                <input type="date" className="w-[200px]" />
              </div>
            </div>
          </div>
          <form className="mt-10">
            <table className="w-full">
              <thead>
                <tr className="flex justify-between w-full">
                  <th>Local</th>
                  <th>Macro Serviço</th>
                  <th>Sub Serviço</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {/* { {selectData?.employeeInWork.map(
                      (employee: any, index: number) => (
                        <TableRow
                          key={index}
                          employee={employee}
                          updateRowData={updateRowData}
                          index={index}
                        />
                      )
                    )} } */}
              </tbody>
            </table>
            <Button
              type="submit"
              color="success"
              className="mt-10 w-72 text-base font-medium"
              /* onClick={onSubmit} */
            >
              Registrar planejamento semanal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
