export function StudioSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16 text-center">

      <h2 className="font-jakarta font-bold text-[2rem] md:text-[3rem] lg:text-[4rem] leading-[1.05] tracking-tight text-black">
        Transforme Sua Ideia<br />
        em Produto Real
      </h2>

      <p className="font-jakarta font-normal text-[0.875rem] md:text-[1rem] text-black/70 mt-4 max-w-[30rem] mx-auto leading-relaxed">
        Coloque sua logo, visualize em 3D e veja com seus próprios olhos como o seu boné vai ficar.
      </p>

      <div
        className="mt-10 md:mt-12 lg:mt-14 max-w-[1200px] mx-auto rounded-2xl px-8 md:px-16 py-12 md:py-16"
        style={{ background: "radial-gradient(ellipse at 25% 100%, #1a3a8f 0%, #000000 65%)" }}
      >
        <h3 className="font-jakarta font-bold text-[3rem] md:text-[4rem] lg:text-[5rem] text-white leading-[1]">
          Studio
        </h3>

        <p className="font-jakarta font-normal text-[0.875rem] md:text-[1rem] text-white/80 mt-4 max-w-[28rem] mx-auto leading-relaxed">
          Se você tem sua logo pronta, crie agora o seu produto com a nossa ferramenta!
        </p>

        <button className="mt-8 px-8 py-2.5 md:px-16 md:py-3 rounded-full bg-[#4A7BF7] font-jakarta text-[0.65rem] md:text-[0.7rem] font-normal tracking-widest uppercase text-white transition-all duration-200 hover:bg-[#3a6be7] hover:scale-105 cursor-pointer">
          Desejo Personalizar Agora
        </button>
      </div>

    </section>
  );
}
