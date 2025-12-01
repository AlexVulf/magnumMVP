import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // ícone de lixeira
import api from "../api";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", formData);
      setUsers([...users, response.data]);
      setFormData({ name: "", email: "", password: "", role: "USER" });
    } catch (error) {
      alert("Falha ao adicionar usuário.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      alert("Falha ao atualizar a permissão do usuário.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        alert("Falha ao excluir o usuário.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0708] text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Painel do Administrador
      </h1>

      {/* Formulário de cadastro */}
      <form
        onSubmit={handleAddUser}
        className="bg-transparent shadow-md rounded-lg p-6 max-w-md mx-auto mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Cadastrar Novo Usuário</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nome do usuário"
            value={formData.name}
            onChange={handleChange}
            className="bg-transparent border border-white/50 rounded-lg p-2 w-full !text-white outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50 autofill:shadow-[inset_0_0_0px_1000px_rgb(26,26,26)] autofill:!text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email do usuário"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent border border-white/50 rounded-lg p-2 w-full !text-white outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50 autofill:shadow-[inset_0_0_0px_1000px_rgb(26,26,26)] autofill:!text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold mb-2">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            className="bg-transparent border border-white/50 rounded-lg p-2 w-full !text-white outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50 autofill:shadow-[inset_0_0_0px_1000px_rgb(26,26,26)] autofill:!text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-bold mb-2">Permissão</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-transparent border border-white/50 rounded-lg p-2 w-full !text-white outline-none focus:border-white focus:ring-2 focus:ring-white/50 autofill:shadow-[inset_0_0_0px_1000px_rgb(26,26,26)] autofill:!text-white"
          >
            <option value="USER" className="bg-[#1a1a1a]">Usuário</option>
            <option value="ADMIN" className="bg-[#1a1a1a]">Administrador</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white text-black py-2 px-4 rounded font-bold hover:opacity-90 transition"
          >
            Adicionar Usuário
          </button>
        </div>
      </form>

      {/* Lista de usuários */}
      <div className="bg-transparent shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Lista de Usuários</h2>

        {users.length === 0 ? (
          <p className="text-gray-400 text-center">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-white">Nome</th>
                <th className="border border-gray-700 p-2 text-white">Email</th>
                <th className="border border-gray-700 p-2 text-white">Permissão</th>
                <th className="border border-gray-700 p-2 text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="text-center hover:bg-gray-700 transition"
                >
                  <td className="border border-gray-700 p-2">{user.name}</td>
                  <td className="border border-gray-700 p-2">{user.email}</td>
                  <td className="border border-gray-700 p-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-transparent border border-white/50 rounded-lg p-1 !text-white outline-none focus:border-white focus:ring-2 focus:ring-white/50 autofill:shadow-[inset_0_0_0px_1000px_rgb(26,26,26)] autofill:!text-white"
                    >
                      <option value="USER">Usuário</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                  <td className="border border-gray-700 p-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Excluir usuário"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
