import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Welcome to NYX' },
    { id: 2, title: 'Workspace Setup' },
    { id: 3, title: 'Invite Team' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-full bg-[#0f0f13] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          NYX Workspace Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Let's get your environment ready
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#1a1a24] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/5">
          
          {/* Progress Bar */}
          <div className="mb-8 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${(currentStep / steps.length) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300"
              ></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              {steps.map(step => (
                <span key={step.id} className={currentStep >= step.id ? 'text-indigo-600' : ''}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content Based on Step */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-white">Tell us about yourself</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <div className="mt-1">
                    <input type="text" id="name" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-[#232330] rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300">Your Role</label>
                  <div className="mt-1">
                    <select id="role" className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#232330] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white">
                      <option>Developer</option>
                      <option>Designer</option>
                      <option>Product Manager</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-white">Name your Workspace</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="workspace" className="block text-sm font-medium text-gray-300">Workspace Name</label>
                  <div className="mt-1">
                    <input type="text" id="workspace" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-[#232330] rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" placeholder="Acme Corp" />
                  </div>
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-300">Workspace URL</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-[#303040] text-gray-400 sm:text-sm">
                      app.nyx.today/
                    </span>
                    <input type="text" id="url" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-600 bg-[#232330] focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" placeholder="acme" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-white">Invite your team (Optional)</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Addresses</label>
                  <div className="mt-1">
                    <textarea id="email" rows={3} className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-[#232330] rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" placeholder="colleague@example.com, ..."></textarea>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Separate multiple emails with commas.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 border-t border-gray-700 pt-5 flex justify-between">
            <button 
              onClick={handleBack} 
              disabled={currentStep === 1}
              className={`inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-[#232330] hover:bg-[#303040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentStep === steps.length ? 'Finish' : 'Next'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
