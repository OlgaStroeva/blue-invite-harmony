
import { Container } from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emily Johnson",
    title: "Wedding Planner",
    content:
      "The elegance and simplicity of these invitations made my clients' wedding announcements truly special. The blue designs are particularly stunning.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Event Coordinator",
    content:
      "I've used this platform for multiple corporate events. The professional templates and ease of customization save me hours of work.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Williams",
    title: "Birthday Celebrant",
    content:
      "My birthday invitations were a hit! Everyone commented on how beautiful and unique they were. The tracking feature was super helpful.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Rodriguez",
    title: "Marketing Director",
    content:
      "The product launch invitations we created generated exceptional engagement. The design quality exceeded our expectations.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <section id="testimonials" className="py-20 relative" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-50/30 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 left-0 w-1/4 h-1/4 bg-blue-100/20 rounded-full blur-[80px]" />
      
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users <span className="text-gradient">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users creating beautiful invitations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white border border-blue-100 rounded-xl p-6 shadow-soft transition-all duration-500 hover:shadow-elegant ${
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

        <div className="mt-16 text-center p-8 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-800 text-lg font-medium mb-3">
            Join over 10,000 users creating stunning invitations
          </p>
          <p className="text-blue-600">
            Start crafting your perfect invitation today
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
