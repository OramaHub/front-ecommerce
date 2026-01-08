import { Footer } from "../components/Footer";
import { useState } from "react";
import blackCap from "../assets/black-cap.png";

export function Cart() {
  const [artVerification, setArtVerification] = useState(false);
  const [cep, setCep] = useState("");
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Boné Liso Preto",
      color: "Preto",
      size: "Único",
      quantity: 2,
      price: 33.90,
      image: blackCap
    },
    {
      id: 2,
      name: "Boné Liso Preto",
      color: "Azul",
      size: "Único",
      quantity: 1,
      price: 33.90,
      image: blackCap
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const artVerificationPrice = artVerification ? 20.00 : 0;
  const total = subtotal + artVerificationPrice;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8">
          <div className="flex items-center gap-2 text-xs md:text-sm font-jakarta text-gray-600 mb-3 md:mb-4">
            <span className="text-black font-medium">Carrinho</span>
            <span>/</span>
            <span>Endereço</span>
            <span>/</span>
            <span>Pagamento</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta mb-3 md:mb-4">Carrinho</h1>

          <div className="border border-gray-300 rounded-lg p-4 md:p-6 mb-3 md:mb-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 font-jakarta">Seu carrinho está vazio</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-3 md:gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-jakarta font-medium text-black text-sm md:text-base">{item.name}</h3>
                          <p className="text-xs md:text-sm font-jakarta text-gray-600">Cor: {item.color}</p>
                          <p className="text-xs md:text-sm font-jakarta text-gray-600">Tamanho: {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors md:hidden"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between md:justify-start md:gap-4">
                        <div className="flex items-center gap-1 md:gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 md:px-3 py-1 font-jakarta font-medium text-sm hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 font-jakarta text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 md:px-3 py-1 font-jakarta font-medium text-sm hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-jakarta font-bold text-base md:text-lg">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors hidden md:block"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-gray-300 rounded-lg p-4 md:p-6 mb-3 md:mb-4">
            <label className="flex items-start gap-2 md:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={artVerification}
                onChange={(e) => setArtVerification(e.target.checked)}
                className="mt-1 w-4 h-4 md:w-5 md:h-5 cursor-pointer flex-shrink-0"
              />
              <div>
                <p className="font-jakarta font-medium text-black text-sm md:text-base">
                  Verificação de arte (+R$ 20,00/pedido)
                </p>
                <p className="text-xs md:text-sm font-jakarta text-gray-600 mt-1">
                  Um designer profissional do nosso time fará uma análise e pode intervir em suas artes para garantir melhor qualidade final na impressão
                </p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            <div className="border border-gray-300 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold font-jakarta mb-3 md:mb-4">Frete</h2>
              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
                <button className="bg-black text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base rounded-lg font-jakarta font-medium cursor-pointer">
                  Simular
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold font-jakarta mb-3 md:mb-4">Preço</h2>
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between font-jakarta text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-jakarta font-bold text-base md:text-lg">
                  <span>Preço</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2.5 md:py-3 text-sm md:text-base rounded-lg font-jakarta font-medium cursor-pointer hover:bg-green-700 transition-colors">
                Continuar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
