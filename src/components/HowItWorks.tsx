
import { Container } from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose a Template",
    description:
      "Browse through our collection of beautifully designed invitation templates.",
    icon: "select",
  },
  {
    number: "02",
    title: "Customize",
    description:
      "Personalize your invitation with your details, colors, and style preferences.",
    icon: "edit",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Send your invitation via email, messaging apps, or generate a shareable link.",
    icon: "share",
  },
  {
    number: "04",
    title: "Track Responses",
    description:
      "Monitor RSVPs and responses in real-time through our intuitive dashboard.",
    icon: "track",
  },
];

const HowItWorks = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animating items sequentially
            steps.forEach((_, index) => {
              setTimeout(() => {
                setAnimatedItems((prev) => [...prev, index]);
              }, 200 * index);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 relative bg-gradient-to-b from-white to-blue-50" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-100/20 rounded-full blur-[120px]" />
      
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating and sharing beautiful invitations has never been easier
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center lg:items-start gap-6 ${
                  index % 2 === 1 ? "lg:flex-row-reverse lg:text-right" : ""
                } transition-all duration-700 ${
                  animatedItems.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-gradient text-white font-bold text-xl shadow-highlight z-10 relative">
                    {step.number}
                  </div>
                  <div className="absolute -inset-1 bg-white/50 rounded-full blur-md -z-10"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Button size="lg" className="bg-blue-gradient hover:shadow-highlight transition-all duration-300">
            Create Your First Invitation
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
