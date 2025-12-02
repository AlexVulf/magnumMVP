import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (error) {
      alert("Falha no registro. Verifique os dados inseridos.");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#0a0708] text-white"> {/* Fundo escuro e texto branco */}
      <img src="/logo.png" alt="Logo da Empresa" className="w-[600px] h-auto mb-[60px]" /> {/* Mantém a logo */}
      <div className="w-[min(450px,60vw)] h-[min(450px,60vw)] rounded-full bg-[#0a0708] flex justify-center items-center shadow-[0_0_15px_rgba(255,0,80,0.2),_0_0_40px_rgba(255,0,80,0.15),_0_0_70px_rgba(255,0,80,0.1)]">
        <div className="register-box w-1/2 text-center">
          <h2 className="text-2xl font-semibold mb-12 -mt-8">Registrar Novo Usuário</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/50 rounded-lg p-1 text-white mb-3 outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/50 rounded-lg p-1 text-white mb-3 outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50"
            />

            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/50 rounded-lg p-1 text-white mb-3 outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50"
            />

            <button
              type="submit"
              className="w-full bg-white text-black p-1 border-none rounded-md cursor-pointer font-bold transition-all duration-200 hover:opacity-90"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
