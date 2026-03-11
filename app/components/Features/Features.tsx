import { ShieldCheck, Truck, Wrench } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 stroke-[1px]" />,
            title: "Garantía Original",
            desc: "Repuestos certificados para Bajaj y TVS."
        },
        {
            icon: <Truck className="w-8 h-8 stroke-[1px]" />,
            title: "Entrega Rápida",
            desc: "Envíos directos a tu taller en tiempo récord."
        },
       
    ];

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div className="mb-4 text-gray-800">{f.icon}</div>
                        <h3 className="text-xs tracking-[0.2em] uppercase font-medium mb-2">{f.title}</h3>
                        <p className="text-sm text-gray-500 font-light max-w-[200px]">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};