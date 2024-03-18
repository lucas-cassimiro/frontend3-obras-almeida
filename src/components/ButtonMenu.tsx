"use client";

import Image from "next/image";
import React, { useState } from "react";

import { FaHome } from "react-icons/fa";
import { FaCashRegister } from "react-icons/fa6";
import { FaSheetPlastic } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa6";
import { IoArrowBackCircle } from "react-icons/io5";
import { CgController } from "react-icons/cg";
import { IoIosCreate } from "react-icons/io";

import Link from "next/link";

import menuImg from "@/assets/menu.svg";

export default function ButtonMenu() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [control, setControl] = useState<boolean>(false);
  const [database, setDatabase] = useState<boolean>(false);
  const [planning, setPlanning] = useState<boolean>(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;

      const triggerScrollPosition = 200;

      if (scrollPosition >= triggerScrollPosition) {
        setMenuOpen(false);
      }
    });
  }

  return (
    <>
      <div
        className={`${
          menuOpen ? "w-60" : ""
        } py-6 flex flex-col items-center h-full w-20 overflow-hidden bg-[#374e25] transition-all duration-1000 ease-in-out fixed z-20`}
      >
        <button
          className="bg-none border-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image src={menuImg} alt="Ícone de menu" />
        </button>

        <nav className="flex-1 w-full h-full">
          <ul className="h-full flex flex-col justify-center gap-6">
            <li>
              <Link
                href="/home"
                className="w-fit relative px-7 flex items-center gap-8 text-white"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome size="2rem" />
                <span>Início</span>
              </Link>
            </li>
            <li>
              <a
                className="w-fit relative px-7 flex items-center gap-8 text-white cursor-pointer"
                onClick={() => setRegister(!register)}
              >
                <FaCashRegister size="2rem" />
                <span>Cadastro</span>
              </a>
            </li>
            <li>
              <Link
                href="/home/presenca"
                className="w-fit relative px-7 flex items-center gap-8 text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaSheetPlastic size="2rem" />
                <span className="w-screen">Folha de Presença</span>
              </Link>
            </li>
            <li>
              <a
                className="w-fit relative px-7 flex items-center gap-8 text-white cursor-pointer"
                onClick={() => setPlanning(!planning)}
              >
                <IoIosCreate size="2rem" />
                <span className="w-screen">Planejamento</span>
              </a>
            </li>
            <li>
              <a
                className="w-fit relative px-7 flex items-center gap-8 text-white cursor-pointer"
                onClick={() => setControl(!control)}
              >
                <CgController size="2rem" />
                <span className="w-screen">Controles</span>
              </a>
            </li>
            <li>
              <a
                className="w-fit relative px-7 flex items-center gap-8 text-white cursor-pointer"
                onClick={() => setDatabase(!database)}
              >
                <FaDatabase size="2rem" />
                <span className="w-screen">Banco de Dados</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div
        className={`${
          register ? "fixed  w-[240px] h-screen" : ""
        } w-0 transition-all duration-1000 ease-in-out pt-3 bg-[#374e25] overflow-hidden z-20 fixed`}
      >
        <IoArrowBackCircle
          size="2rem"
          className="text-white cursor-pointer ml-3"
          onClick={() => setRegister(!register)}
        />
        <div className="flex flex-col items-center gap-5 mt-20">
          <Link
            href="/home/cadastro/obras"
            className="text-white max-w-[143px] min-w-[143px]"
            onClick={() => {
              setMenuOpen(false);
              setRegister(!register);
            }}
          >
            Cadastro de Obras
          </Link>
          <Link
            href="/home/cadastro/servicos"
            className="text-white max-w-[163px] min-w-[163px]"
            onClick={() => {
              setMenuOpen(false);
              setRegister(!register);
            }}
          >
            Cadastro de Serviços
          </Link>
          <Link
            href="/home/cadastro/funcionarios"
            className="text-white max-w-[194px] min-w-[194px]"
            onClick={() => {
              setMenuOpen(false);
              setRegister(!register);
            }}
          >
            Cadastro de Funcionários
          </Link>
          <Link
            href="/home/cadastro/usuarios"
            className="text-white max-w-[153px] min-w-[153px]"
            onClick={() => {
              setMenuOpen(false);
              setRegister(!register);
            }}
          >
            Cadastro de Acesso
          </Link>
        </div>
      </div>
      <div
        className={`${
          control ? "fixed w-[240px] h-screen" : ""
        } w-0 transition-all duration-1000 ease-in-out pt-3 bg-[#374e25] overflow-hidden z-20 fixed`}
      >
        <IoArrowBackCircle
          size="2rem"
          className="text-white cursor-pointer ml-3"
          onClick={() => setControl(!control)}
        />
        <div className="flex flex-col items-center gap-5 mt-20">
          <Link
            href="/home/controle-produtividade"
            className="text-white max-w-[199px] min-w-[199px]"
            onClick={() => {
              setMenuOpen(false);
              setControl(!control);
            }}
          >
            Controle de Produtividade
          </Link>
          <Link
            href="/home/controle-qualidade"
            className="text-white max-w-[170px] min-w-[170px]"
            onClick={() => {
              setMenuOpen(false);
              setControl(!control);
            }}
          >
            Controle de Qualidade
          </Link>
        </div>
      </div>
      <div
        className={`${
          database ? "fixed w-[240px] h-screen" : ""
        } w-0 transition-all duration-1000 ease-in-out pt-3 bg-[#374e25] overflow-hidden z-20 fixed`}
      >
        <IoArrowBackCircle
          size="2rem"
          className="text-white cursor-pointer ml-3"
          onClick={() => setDatabase(!database)}
        />
        <div className="flex flex-col items-center gap-5 mt-20">
          <Link
            href="/home/lista-funcionarios"
            className="text-white max-w-[161px] min-w-[161px]"
            onClick={() => {
              setMenuOpen(false);
              setDatabase(!database);
            }}
          >
            Lista de Funcionários
          </Link>
          <Link
            href="/home/lista-servicos"
            className="text-white max-w-[130px] min-w-[130px]"
            onClick={() => {
              setMenuOpen(false);
              setDatabase(!database);
            }}
          >
            Lista de Serviços
          </Link>
        </div>
      </div>
      <div
        className={`${
          planning ? "fixed w-[240px] h-screen" : ""
        } w-0 transition-all duration-1000 ease-in-out pt-3 bg-[#374e25] overflow-hidden z-20 fixed`}
      >
        <IoArrowBackCircle
          size="2rem"
          className="text-white cursor-pointer ml-3"
          onClick={() => setPlanning(!planning)}
        />
        <div className="flex flex-col items-center gap-5 mt-20">
          <Link
            href="/home/planejamento-diario"
            className="text-white max-w-[149px] min-w-[149px]"
            onClick={() => {
              setMenuOpen(false);
              setPlanning(!planning);
            }}
          >
            Planejamento diário
          </Link>
          <Link
            href="/home/planejamento-semanal"
            className="text-white max-w-[170px] min-w-[170px]"
            onClick={() => {
              setMenuOpen(false);
              setPlanning(!planning);
            }}
          >
            Planejamento semanal
          </Link>
        </div>
      </div>
    </>
  );
}
