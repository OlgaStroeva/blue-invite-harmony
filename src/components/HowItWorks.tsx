
import { Container } from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, LayoutTemplate, UserPlus, Send, Check, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Description"),
      icon: CalendarPlus,
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Description"),
      icon: LayoutTemplate,
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Description"),
      icon: UserPlus,
    },
    {
      number: "04",
      title: t("step4Title"),
      description: t("step4Description"),
      icon: Send,
    },
    {
      number: "05",
      title: t("step5Title"),
      description: t("step5Description"),
      icon: Check,
    },
    {
      number: "06",
      title: t("step6Title"),
      description: t("step6Description"),
      icon: BarChart,
    },
  ];

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
  }, [steps]);

  return (
    <section id="how-it-works" className="py-20 relative bg-gradient-to-b from-blue-100 to-blue-200" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-300/30 rounded-full blur-[120px]" />
      
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
            {t("how")} <span className="text-gradient">{t("works")}</span>
          </h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            {t("creatingSharing")}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-blue-500 to-transparent" />

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
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-gradient text-white shadow-highlight z-10 relative">
                    {step.icon && <step.icon className="w-7 h-7" />}
                  </div>
                  <div className="absolute -inset-1 bg-blue-300/50 rounded-full blur-md -z-10"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">{step.title}</h3>
                  <p className="text-blue-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Button size="lg" className="bg-blue-gradient hover:shadow-highlight transition-all duration-300">
            {t("createFirstInvitation")}
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
