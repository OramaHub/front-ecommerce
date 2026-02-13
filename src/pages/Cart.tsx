import { Footer } from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../services/order-service";
import blackCap from "../assets/black-cap.png";
import truckerBlack from "../assets/trucker-black.png";
import tShortBlack from "../assets/t-short-black.png";

function getFallbackImage(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("trucker")) return truckerBlack;
  if (name.includes("camiseta") || name.includes("camisa")) return tShortBlack;
  return blackCap;
}

export function Cart() {
  const { cart, items, total, loading, updateQuantity, removeItem, isLocalCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [artVerification, setArtVerification] = useState(false);
  const [cep, setCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [isNordeste, setIsNordeste] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="font-jakarta text-gray-500">Carregando carrinho...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const artVerificationPrice = artVerification ? 20.00 : 0;
  const shippingCost = items.length > 0 && shippingCalculated ? (isNordeste ? 0 : 60.00) : 0;
  const finalTotal = total + artVerificationPrice + shippingCost;

  const handleCalculateShipping = () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("CEP inválido. Digite um CEP com 8 dígitos.");
      return;
    }
    setError("");
    const prefix = parseInt(cleanCep.substring(0, 2), 10);
    const nordeste = prefix >= 40 && prefix <= 65;
    setIsNordeste(nordeste);
    setShippingCalculated(true);
  };

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + "-" + digits.slice(5);
    }
    setCep(formatted);
    if (shippingCalculated) {
      setShippingCalculated(false);
      setIsNordeste(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(cartItemId, newQuantity);
    } catch {
      setError("Erro ao atualizar quantidade.");
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeItem(cartItemId);
    } catch {
      setError("Erro ao remover item.");
    }
  };

  const handleContinue = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!cart) return;
    setCreatingOrder(true);
    setError("");
    try {
      await createOrder(cart.id, artVerification ? 0 : undefined);
      navigate("/minha-conta");
    } catch {
      setError("Erro ao criar pedido. Tente novamente.");
    } finally {
      setCreatingOrder(false);
    }
  };

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

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 font-jakarta text-sm">
              {error}
            </div>
          )}

          <div className="border border-gray-300 rounded-lg p-4 md:p-6 mb-3 md:mb-4">
            {items.length === 0 ? (
              <p className="text-gray-500 font-jakarta">Seu carrinho está vazio</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-3 md:gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={getFallbackImage(item.productName)} alt={item.productName} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-jakarta font-medium text-black text-sm md:text-base">{item.productName}</h3>
                          <p className="text-xs md:text-sm font-jakarta text-gray-600">
                            R$ {item.unitPrice.toFixed(2).replace('.', ',')} /un
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
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
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 md:px-3 py-1 font-jakarta font-medium text-sm hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 font-jakarta text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 md:px-3 py-1 font-jakarta font-medium text-sm hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-jakarta font-bold text-base md:text-lg">
                          R$ {item.subtotal.toFixed(2).replace('.', ',')}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
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
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCalculateShipping()}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-black font-jakarta"
                />
                <button
                  onClick={handleCalculateShipping}
                  className="bg-black text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base rounded-lg font-jakarta font-medium cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  Calcular
                </button>
              </div>
              {shippingCalculated && (
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-jakarta text-sm md:text-base text-gray-600">
                    {isNordeste ? "Região Nordeste" : "Demais regiões"}
                  </span>
                  <span className={`font-jakarta font-bold text-sm md:text-base ${isNordeste ? "text-green-600" : ""}`}>
                    {isNordeste ? "Grátis" : "R$ 60,00"}
                  </span>
                </div>
              )}
            </div>

            <div className="border border-gray-300 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold font-jakarta mb-3 md:mb-4">Preço</h2>
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between font-jakarta text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                {artVerification && (
                  <div className="flex justify-between font-jakarta text-sm md:text-base">
                    <span>Verificação de arte</span>
                    <span>R$ 20,00</span>
                  </div>
                )}
                {shippingCalculated && (
                  <div className="flex justify-between font-jakarta text-sm md:text-base">
                    <span>Frete</span>
                    <span className={isNordeste ? "text-green-600" : ""}>
                      {isNordeste ? "Grátis" : "R$ 60,00"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-jakarta font-bold text-base md:text-lg">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <button
                onClick={handleContinue}
                disabled={items.length === 0 || creatingOrder}
                className="w-full bg-green-600 text-white py-2.5 md:py-3 text-sm md:text-base rounded-lg font-jakarta font-medium cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingOrder ? "Criando pedido..." : isLocalCart ? "Fazer login e continuar" : "Continuar Compra"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
