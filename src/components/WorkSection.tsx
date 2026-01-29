import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    title: "Quantum Labs",
    category: "Brand & Web",
    image: project1,
    color: "from-primary/20 to-accent/20",
  },
  {
    title: "Nova Finance",
    category: "UI/UX Design",
    image: project2,
    color: "from-accent/20 to-primary/20",
  },
  {
    title: "Pulse Music",
    category: "Motion & Web",
    image: project3,
    color: "from-primary/30 to-transparent",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="relative py-32 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Projects That <span className="text-gradient">Inspire</span>
            </h2>
          </div>
          <motion.a
            href="#"
            whileHover={{ x: 5 }}
            className="text-foreground/60 hover:text-foreground transition-colors mt-4 md:mt-0 flex items-center gap-2"
          >
            View All Work <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold group-hover:text-gradient transition-all duration-300">
                  {project.title}
                </h3>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;