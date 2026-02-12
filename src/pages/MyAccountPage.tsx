import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getClient, updateClient, changePassword } from "../services/client-service";
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefault } from "../services/address-service";
import { getClientOrders } from "../services/order-service";
import type { Address } from "../types/address";
import type { Order } from "../types/order";

export function MyAccountPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<"perfil" | "senha" | "enderecos" | "pedidos">("perfil");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressMsg, setAddressMsg] = useState("");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "", number: "", complement: "", district: "", zipCode: "", defaultAddress: false, cityId: 1,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    setProfileLoading(true);
    getClient(user.id)
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    if (activeSection === "enderecos" && isAuthenticated) {
      setAddressesLoading(true);
      getAddresses()
        .then(setAddresses)
        .catch(() => {})
        .finally(() => setAddressesLoading(false));
    }
  }, [activeSection, isAuthenticated]);

  useEffect(() => {
    if (activeSection === "pedidos" && isAuthenticated && user) {
      setOrdersLoading(true);
      getClientOrders(user.id)
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [activeSection, isAuthenticated, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await updateClient(user.id, { name, email, phone });
      setProfileMsg("Perfil atualizado com sucesso!");
    } catch {
      setProfileMsg("Erro ao atualizar perfil.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setPasswordMsg("As senhas não coincidem.");
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg("");
    try {
      await changePassword(user.id, currentPassword, newPassword);
      setPasswordMsg("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMsg("Erro ao alterar senha. Verifique a senha atual.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setAddressMsg("");
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
      } else {
        await createAddress(addressForm);
      }
      const updated = await getAddresses();
      setAddresses(updated);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({ street: "", number: "", complement: "", district: "", zipCode: "", defaultAddress: false, cityId: 1 });
    } catch {
      setAddressMsg("Erro ao salvar endereço.");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setAddressMsg("Erro ao remover endereço.");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefault(id);
      const updated = await getAddresses();
      setAddresses(updated);
    } catch {
      setAddressMsg("Erro ao definir endereço padrão.");
    }
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      number: address.number,
      complement: address.complement,
      district: address.district,
      zipCode: address.zipCode,
      defaultAddress: address.defaultAddress,
      cityId: address.cityId,
    });
    setShowAddressForm(true);
  };

  if (!isAuthenticated) return null;

  const sections = [
    { key: "perfil" as const, label: "Meus Dados" },
    { key: "senha" as const, label: "Alterar Senha" },
    { key: "enderecos" as const, label: "Endereços" },
    { key: "pedidos" as const, label: "Meus Pedidos" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta mb-6">Minha Conta</h1>

          <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`px-4 py-2 rounded-lg font-jakarta text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === s.key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {activeSection === "perfil" && (
            <div className="max-w-lg">
              {profileLoading ? (
                <p className="font-jakarta text-gray-500">Carregando...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-jakarta font-medium mb-1">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-jakarta font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-jakarta font-medium mb-1">Telefone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                    />
                  </div>
                  {profileMsg && (
                    <p className={`text-sm font-jakarta ${profileMsg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                      {profileMsg}
                    </p>
                  )}
                  <button
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    className="bg-black text-white px-8 py-3 rounded-lg font-jakarta font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === "senha" && (
            <div className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-jakarta font-medium mb-1">Senha atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-jakarta font-medium mb-1">Nova senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-jakarta font-medium mb-1">Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                />
              </div>
              {passwordMsg && (
                <p className={`text-sm font-jakarta ${passwordMsg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                  {passwordMsg}
                </p>
              )}
              <button
                onClick={handleChangePassword}
                disabled={passwordSaving}
                className="bg-black text-white px-8 py-3 rounded-lg font-jakarta font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {passwordSaving ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          )}

          {activeSection === "enderecos" && (
            <div>
              {addressMsg && (
                <p className={`text-sm font-jakarta mb-4 ${addressMsg.includes("Erro") ? "text-red-600" : "text-green-600"}`}>
                  {addressMsg}
                </p>
              )}

              {!showAddressForm && (
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ street: "", number: "", complement: "", district: "", zipCode: "", defaultAddress: false, cityId: 1 });
                    setShowAddressForm(true);
                  }}
                  className="bg-black text-white px-6 py-2 rounded-lg font-jakarta font-medium text-sm mb-6 hover:bg-gray-900 transition-colors"
                >
                  Adicionar Endereço
                </button>
              )}

              {showAddressForm && (
                <div className="border border-gray-300 rounded-lg p-6 mb-6 max-w-lg">
                  <h3 className="font-jakarta font-bold text-lg mb-4">
                    {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Rua"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Número"
                        value={addressForm.number}
                        onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="Complemento"
                        value={addressForm.complement}
                        onChange={(e) => setAddressForm({ ...addressForm, complement: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="CEP"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                      />
                      <input
                        type="number"
                        placeholder="ID da Cidade"
                        value={addressForm.cityId}
                        onChange={(e) => setAddressForm({ ...addressForm, cityId: Number(e.target.value) })}
                        className="px-4 py-3 border border-gray-300 rounded-lg font-jakarta focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAddress}
                        className="bg-black text-white px-6 py-2 rounded-lg font-jakarta font-medium text-sm hover:bg-gray-900 transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-jakarta font-medium text-sm hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {addressesLoading ? (
                <p className="font-jakarta text-gray-500">Carregando endereços...</p>
              ) : addresses.length === 0 ? (
                <p className="font-jakarta text-gray-500">Nenhum endereço cadastrado.</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-300 rounded-lg p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-jakarta font-medium">
                            {address.street}, {address.number}
                            {address.complement && ` - ${address.complement}`}
                          </p>
                          <p className="font-jakarta text-sm text-gray-600">
                            {address.district} - CEP: {address.zipCode}
                          </p>
                          {address.cityName && (
                            <p className="font-jakarta text-sm text-gray-600">{address.cityName}</p>
                          )}
                          {address.defaultAddress && (
                            <span className="inline-block mt-2 text-xs font-jakarta font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                              Endereço padrão
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!address.defaultAddress && (
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="text-xs font-jakarta text-blue-600 hover:underline"
                            >
                              Definir padrão
                            </button>
                          )}
                          <button
                            onClick={() => openEditAddress(address)}
                            className="text-xs font-jakarta text-gray-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-xs font-jakarta text-red-600 hover:underline"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "pedidos" && (
            <div>
              {ordersLoading ? (
                <p className="font-jakarta text-gray-500">Carregando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className="font-jakarta text-gray-500">Nenhum pedido realizado.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-300 rounded-lg p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <p className="font-jakarta font-bold text-lg">Pedido #{order.orderNumber}</p>
                          <p className="font-jakarta text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <p className="font-jakarta font-bold text-lg mt-2 md:mt-0">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm font-jakarta">
                            <span>
                              {item.productName} x{item.quantity}
                            </span>
                            <span>R$ {item.subtotal.toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                      </div>
                      {order.discount > 0 && (
                        <p className="mt-2 text-sm font-jakarta text-green-600">
                          Desconto: -R$ {order.discount.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
