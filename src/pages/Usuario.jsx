import React, { useState, useEffect } from "react";
import api from "../api";

const Usuario = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'criar' | 'vetorizar' | null
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  const handleSend = () => {
    if (!input.trim() && !selectedFile) return;

    const newMessage = {
      from: "user",
      text: input,
      file: selectedFile ? selectedFile.name : null,
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setSelectedFile(null);

    // Aqui depois conectaremos ao n8n
  };

  const closeModal = () => {
    setOpenModal(null);
    setMessages([]);
    setInput("");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0708] text-white p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Painel do Usuário
      </h1>

      {user && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl">Bem-vindo, {user.name}!</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      )}

      {/* Botões principais */}
      <div className="flex gap-6">
        <button
          onClick={() => setOpenModal("criar")}
          className="px-6 py-3 bg-white text-black rounded-lg shadow font-bold hover:opacity-90 transition"
        >
          Criar Imagem 🎨
        </button>
        <button
          onClick={() => setOpenModal("vetorizar")}
          className="px-6 py-3 bg-white text-black rounded-lg shadow font-bold hover:opacity-90 transition"
        >
          Vetorizar Imagem 🧩
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl shadow-lg p-6 relative border border-pink-500/50">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              {openModal === "criar"
                ? "Chat - Criar Imagem"
                : "Chat - Vetorizar Imagem"}
            </h2>

            <div className="h-80 overflow-y-auto border border-gray-700 p-3 rounded-lg bg-[#0a0708]">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  Comece enviando uma mensagem...
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`my-2 p-2 rounded-lg ${
                      msg.from === "user"
                        ? "bg-pink-900/50 text-right"
                        : "bg-gray-800 text-left"
                    }`}
                  >
                    {msg.text}
                    {msg.file && (
                      <div className="text-sm text-gray-400 mt-1">
                        📎 {msg.file}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Campo de entrada */}
            <div className="mt-4 flex flex-col gap-2">
              {openModal === "vetorizar" && (
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 text-pink-500 hover:underline">
                    📎 Anexar imagem
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-gray-400">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border border-white/50 rounded-lg p-2 !text-white outline-none placeholder-[#ccc] focus:border-white focus:ring-2 focus:ring-white/50"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:opacity-90 transition"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuario;

