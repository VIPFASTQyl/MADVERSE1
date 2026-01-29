import { motion } from "framer-motion";
import { Palette, Code, Sparkles, Layers } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Brand Identity",
    description: "Crafting distinctive visual identities that resonate and leave lasting impressions.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Building performant, scalable web applications with cutting-edge technologies.",
  },
  {
    icon: Sparkles,
    title: "Motion Design",
    description: "Bringing ideas to life through captivating animations and visual storytelling.",
  },
  {
    icon: Layers,
    title: "UI/UX Design",
    description: "Creating intuitive interfaces that delight users and drive engagement.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Services Built for <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            From concept to launch, we handle every aspect of your digital presence with precision and creativity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
