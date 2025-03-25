
import { Container } from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
}

const Testimonials = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Emily Johnson",
      title: language === "en" ? "Wedding Planner" : "Свадебный планировщик",
      content: language === "en" 
        ? "The elegance and simplicity of these invitations made my clients' wedding announcements truly special. The blue designs are particularly stunning."
        : "Элегантность и простота этих приглашений сделали свадебные объявления моих клиентов действительно особенными. Синие дизайны особенно потрясающие.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: language === "en" ? "Event Coordinator" : "Координатор мероприятий",
      content: language === "en"
        ? "I've used this platform for multiple corporate events. The professional templates and ease of customization save me hours of work."
        : "Я использовал эту платформу для нескольких корпоративных мероприятий. Профессиональные шаблоны и простота настройки экономят мне часы работы.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarah Williams",
      title: language === "en" ? "Birthday Celebrant" : "Именинница",
      content: language === "en"
        ? "My birthday invitations were a hit! Everyone commented on how beautiful and unique they were. The tracking feature was super helpful."
        : "Мои приглашения на день рождения имели огромный успех! Все комментировали, насколько они красивые и уникальные. Функция отслеживания была очень полезной.",
      rating: 4,
    },
    {
      id: 4,
      name: "David Rodriguez",
      title: language === "en" ? "Marketing Director" : "Директор по маркетингу",
      content: language === "en"
        ? "The product launch invitations we created generated exceptional engagement. The design quality exceeded our expectations."
        : "Приглашения на запуск продукта, которые мы создали, вызвали исключительную вовлеченность. Качество дизайна превзошло наши ожидания.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animating items sequentially
            testimonials.forEach((_, index) => {
              setTimeout(() => {
                setAnimatedItems((prev) => [...prev, index]);
              }, 150 * index);
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
  }, [testimonials]);

  return (
    <section id="testimonials" className="py-20 relative bg-gradient-to-b from-blue-200 to-blue-100" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-300/40 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 left-0 w-1/4 h-1/4 bg-blue-200/30 rounded-full blur-[80px]" />
      
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
            {t("whatOurUsers")} <span className="text-gradient">{t("say")}</span>
          </h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            {t("joinThousands")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white border border-blue-200 rounded-xl p-6 shadow-soft transition-all duration-500 hover:shadow-elegant ${
                animatedItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-blue-500' : 'text-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73L5.82 21 12 17.27z" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 bg-blue-300/30 rounded-xl border border-blue-200">
          <p className="text-blue-800 text-lg font-medium mb-3">
            {t("joinOver")}
          </p>
          <p className="text-blue-700">
            {t("startCrafting")}
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
