import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { authService } from "../services/auth-service";
import { Footer } from "../components/Footer";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.errorMessage || "Token inválido ou expirado. Solicite um novo link.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 bg-white flex items-center justify-center py-8 md:py-12 lg:py-16 px-4">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-jakarta text-sm">
                Link inválido. Solicite um novo link de recuperação.
              </p>
            </div>
            <a
              href="/recuperar-senha"
              className="inline-block bg-black text-white py-3 px-12 rounded-lg font-jakarta font-medium text-base"
            >
              SOLICITAR NOVO LINK
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white flex items-center justify-center py-8 md:py-12 lg:py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-jakarta">Nova Senha</h1>
            <p className="text-sm md:text-base font-jakarta text-black">
              Digite sua nova senha abaixo.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-jakarta text-sm">
                  Senha redefinida com sucesso! Faça login com sua nova senha.
                </p>
              </div>
              <a
                href="/login"
                className="inline-block bg-black text-white py-3 px-12 rounded-lg font-jakarta font-medium text-base"
              >
                IR PARA O LOGIN
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-jakarta">
                  {error}
                </div>
              )}

              <form className="space-y-2" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    placeholder="******"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                    Confirme a Nova Senha
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-jakarta font-medium text-base cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "REDEFININDO..." : "REDEFINIR SENHA"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
