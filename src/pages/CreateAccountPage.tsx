import { Footer } from "../components/Footer";

export function CreateAccountPage() {
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

          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Nome completo"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>

              <div>
                <label htmlFor="data-nascimento" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  id="data-nascimento"
                  placeholder="01/01/1999"
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
              </div>

              <div>
                <label htmlFor="confirme-senha" className="block text-sm font-jakarta text-black mb-0.5 ml-3">
                  Confirme sua Senha
                </label>
                <input
                  type="password"
                  id="confirme-senha"
                  placeholder="******"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 md:mt-6">
              <button
                type="submit"
                className="bg-black text-white py-3 px-16 md:px-32 rounded-lg font-jakarta font-medium text-sm md:text-base cursor-pointer"
              >
                CRIAR CONTA
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
