import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Server, Share2, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, name: 'Analyzing Website & Scraping Content', icon: Server },
  { id: 2, name: 'AI Engine Generating Ad Copy & Creatives', icon: Zap },
  { id: 3, name: 'Configuring Meta Marketing API', icon: Share2 },
  { id: 4, name: 'Publishing Meta Campaigns', icon: CheckCircle2 },
];

export default function AIProcessing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          setTimeout(() => navigate('/'), 1500); // Redirect to dashboard when done
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center space-y-12">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative glass-card p-8 rounded-full border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse">
          <Zap className="w-16 h-16 text-primary" />
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">AI Engine Processing</h2>
        <p className="text-muted-foreground text-lg">Please wait while our AI builds your highly optimized campaign.</p>
      </div>

      <div className="w-full space-y-4">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div 
              key={step.id}
              className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
                isActive ? 'glass-card border-primary/50 translate-x-2' : 
                isCompleted ? 'opacity-50' : 'opacity-30'
              }`}
            >
              <div className={`p-2 rounded-full mr-4 ${
                isActive ? 'bg-primary/10 text-primary' : 
                isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-black/5 text-muted-foreground'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
              </div>
              <span className={`text-lg font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
              {isActive && (
                <div className="ml-auto flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
