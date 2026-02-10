import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "../components/Footer";

export function CreateAccountPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password, cpf, phone });
      navigate("/login");
    } catch (err: any) {
      console.error("Erro no registro:", err);
      const message = err.response?.data?.message || err.message || "Erro ao criar conta. Tente novamente.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white flex items-center justify-center py-8 md:py-12 lg:py-16 px-4">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-jakarta">Crie sua conta</h1>
            <p className="text-sm md:text-base font-jakarta text-black">
              Já tem uma conta?{" "}
              <a href="/login" className="font-medium" style={{ color: '#0051DE' }}>
                faça seu login aqui
              </a>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-jakarta max-w-2xl mx-auto">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  placeholder="***.***.***-**"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="email@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="confirme-senha" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Confirme sua Senha
                </label>
                <input
                  type="password"
                  id="confirme-senha"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 md:mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white py-3 px-16 md:px-32 rounded-lg font-jakarta font-medium text-sm md:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "CRIANDO..." : "CRIAR CONTA"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
