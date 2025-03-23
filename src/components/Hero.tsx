
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/70 to-blue-100/30">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/20 rounded-full blur-[130px]" />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`space-y-6 ${isLoaded ? 'animate-fadeIn' : 'opacity-0'}`}>
            <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full shadow-sm">
              Simple. Elegant. Effective.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance">
              Create <span className="text-gradient font-bold">Beautiful Invitations</span> That Leave an Impression
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Craft stunning digital invitations for any occasion with our intuitive platform. Designed for simplicity and elegance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" className="bg-blue-gradient hover:shadow-highlight transition-all duration-300 rounded-lg">
                Create Your Invitation
              </Button>
              <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50/50 rounded-lg">
                Explore Events
              </Button>
            </div>
          </div>

          {/* Floating cards */}
          <div className="mt-16 md:mt-24 relative h-[320px] sm:h-[400px] md:h-[480px]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] max-w-2xl">
              <Card
                className={`${isLoaded ? 'animate-slideUp opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
                title="Wedding Invitation"
                gradient="bg-gradient-to-br from-blue-50 to-blue-100"
                shadow="shadow-elegant"
              />
              <Card 
                className={`absolute top-[30%] -left-[15%] ${isLoaded ? 'animate-slideUp opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
                title="Birthday Party"
                gradient="bg-gradient-to-br from-blue-100 to-blue-200"
                shadow="shadow-card"
              />
              <Card 
                className={`absolute top-[45%] -right-[10%] ${isLoaded ? 'animate-slideUp opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: '0.6s' }}
                title="Corporate Event"
                gradient="bg-gradient-to-br from-blue-50 to-blue-100"
                shadow="shadow-card"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  gradient: string;
  shadow: string;
}

const Card = ({ className = "", style = {}, title, gradient, shadow }: CardProps) => (
  <div 
    className={`${className} ${gradient} ${shadow} rounded-2xl p-6 w-full max-w-md mx-auto backdrop-blur-sm border border-blue-100/50 transition-all hover:-translate-y-1 hover:shadow-highlight`}
    style={style}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-blue-800">{title}</h3>
      <span className="px-2 py-1 text-xs bg-blue-50/80 text-blue-600 rounded-md backdrop-blur-sm">Preview</span>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-2 bg-blue-100/60 rounded-full w-3/4"></div>
      <div className="h-2 bg-blue-100/60 rounded-full w-full"></div>
      <div className="h-2 bg-blue-100/60 rounded-full w-1/2"></div>
    </div>
    <div className="mt-6 flex justify-between items-center">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full bg-blue-300/50 border-2 border-white"></div>
        <div className="w-8 h-8 rounded-full bg-blue-400/50 border-2 border-white"></div>
        <div className="w-8 h-8 rounded-full bg-blue-500/50 border-2 border-white"></div>
      </div>
      <div className="text-xs text-blue-600">Today at 7:00 PM</div>
    </div>
  </div>
);

export default Hero;
