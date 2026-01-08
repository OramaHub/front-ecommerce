export function Details() {
  const details = [
    { title: "OS MELHORES PREÇOS", subtitle: "em produtos personalizados." },
    { title: "ENTREGA RÁPIDA", subtitle: "para todo o Brasil." },
    { title: "ALTA QUALIDADE", subtitle: "em todos os nossos produtos." },
    { title: "ATÉ 4X SEM JUROS", subtitle: "no cartão de crédito." },
    { title: "ALTA VARIEDADE", subtitle: "em todos os nossos produtos." },
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-[1400px] mx-auto flex justify-center items-center gap-x-14">
        {details.map((item, index) => (
          <>
            <div key={item.title} className="text-center">
              <h3 className="text-lg font-bold text-zinc-900 font-jakarta tracking-wider whitespace-nowrap">
                {item.title}
              </h3>
              <p className="text-zinc-600 text-sm whitespace-nowrap">{item.subtitle}</p>
            </div>
            {index < details.length - 1 && (
              <div className="h-14 w-0.5 bg-black/65 my-[4.6875rem]"></div>
            )}
          </>
        ))}
      </div>
    </section>
  );
}
