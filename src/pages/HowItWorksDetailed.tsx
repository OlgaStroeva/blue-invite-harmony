
import { Container } from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, LayoutTemplate, UserPlus, Send, Check, BarChart, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const HowItWorksDetailed = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: "Create Your Event",
      description: "Start by creating a new event in your dashboard. Add essential details like event name, date, time, and location. You can also include a detailed description to help participants understand what to expect.",
      icon: CalendarPlus,
    },
    {
      number: "02",
      title: "Customize Your Form",
      description: "Design your registration form using our intuitive form builder. Add custom fields like dietary preferences, t-shirt sizes, or any other information you need from participants. Your form will automatically adapt to mobile devices.",
      icon: LayoutTemplate,
    },
    {
      number: "03",
      title: "Manage Participants",
      description: "Track registrations in real-time. View participant details, export data to Excel, and send updates to registered participants. You can also set registration limits and create waiting lists.",
      icon: UserPlus,
    },
    {
      number: "04",
      title: "Send Invitations",
      description: "Share your event link via email, social media, or embed it on your website. Each invitation includes a unique tracking code to monitor responses and engagement.",
      icon: Send,
    },
    {
      number: "05",
      title: "Track RSVPs",
      description: "Monitor responses in real-time. Get instant notifications for new registrations, view acceptance rates, and manage capacity. You can also send reminders to those who haven't responded.",
      icon: Check,
    },
    {
      number: "06",
      title: "Analyze Data",
      description: "Access comprehensive analytics about your event registrations. View trends, demographics, and response patterns. Generate detailed reports to help plan future events more effectively.",
      icon: BarChart,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Container>
        <div className="py-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              How It <span className="text-gradient">Works</span>
            </h1>
            <p className="text-lg text-blue-700 max-w-3xl mx-auto">
              A comprehensive guide to creating and managing your events using our platform.
              Follow these steps to make your event management process smooth and efficient.
            </p>
          </div>

          <div className="relative" ref={sectionRef}>
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
                    <div className="absolute -inset-1 bg-blue-300/50 rounded-full blur-md -z-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-blue-900">
                      {step.title}
                    </h3>
                    <p className="text-lg text-blue-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <Button 
              asChild
              size="lg" 
              className="bg-blue-gradient hover:shadow-highlight transition-all duration-300"
            >
              <Link to="/dashboard">
                Start Creating Your Event
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HowItWorksDetailed;
