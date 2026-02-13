import { useState, type FormEvent } from "react";
import { authService } from "../services/auth-service";
import { Footer } from "../components/Footer";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white flex items-center justify-center py-8 md:py-12 lg:py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-jakarta">Recuperar Senha</h1>
            <p className="text-sm md:text-base font-jakarta text-black">
              Lembrou sua senha?{" "}
              <a href="/login" className="font-medium" style={{ color: "#0051DE" }}>
                Voltar ao login
              </a>
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-jakarta text-sm">
                  Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
              <a
                href="/login"
                className="inline-block bg-black text-white py-3 px-12 rounded-lg font-jakarta font-medium text-base"
              >
                VOLTAR AO LOGIN
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-jakarta">
                  {error}
                </div>
              )}

              <p className="text-sm font-jakarta text-black/60 mb-4">
                Digite seu email e enviaremos um link para redefinir sua senha.
              </p>

              <form className="space-y-2" onSubmit={handleSubmit}>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-jakarta font-medium text-base cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "ENVIANDO..." : "ENVIAR LINK"}
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
