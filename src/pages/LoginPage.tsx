import { Footer } from "../components/Footer";

export function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white flex items-center justify-center py-8 md:py-12 lg:py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-jakarta">Entrar na sua Conta</h1>
            <p className="text-sm md:text-base font-jakarta text-black">
              Não tem uma conta?{" "}
              <a href="/cadastro" className="font-medium" style={{ color: '#0051DE' }}>
                Cadastre-se aqui
              </a>
            </p>
          </div>

          <form className="space-y-2">
            <div>
              <label htmlFor="email" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@dominio.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
              />
              <a href="/recuperar-senha" className="text-sm font-jakarta text-black/60 hover:text-black inline-block mt-1 transition-colors">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-jakarta font-medium text-base cursor-pointer mt-4"
            >
              ENTRAR
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
