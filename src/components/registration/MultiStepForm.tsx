import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step1Data, Step2Data, Step3Data } from '../../schemas/registration.schema';

interface MultiStepFormProps {
  onClose: () => void;
}

const steps = ['Dane osobowe', 'Preferencje', 'Podsumowanie'];

export const MultiStepForm = ({ onClose }: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{ step1?: Step1Data; step2?: Step2Data }>({});
  
  const [serverError, setServerError] = useState<string | null>(null);
  const [rootError, setRootError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1Complete = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setServerError(null); // Reset server errors when proceeding
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (step3Data: Step3Data) => {
    setIsSubmitting(true);
    setRootError(null);
    
    // Mockowanie API z instrukcji
    const mockData = { ...formData, step3: step3Data };
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // symulacja ładowania
      
      // symulacja błędu 409, jeśli wpisano konkretny e-mail (np. test@test.pl)
      // Używam zajety@gmail.com jako wyzwalacza błędu na potrzeby testów
      if (mockData.step1?.email === 'zajety@gmail.com') {
        // eslint-disable-next-line no-throw-literal
        throw { status: 409 }; 
      }
      
      // Sukces
      alert('Zarejestrowano pomyślnie!');
      onClose();
    } catch (err: any) {
      if (err.status === 409) {
        setServerError('Ten adres e-mail jest już zarejestrowany');
        setCurrentStep(1); // Powrót do kroku 1
      } else {
        setRootError('Błąd serwera, spróbuj ponownie');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="main" aria-label="Formularz rejestracji" sx={{ p: { xs: 2, md: 4 } }}>
      
      {/* WCAG: aria-current na aktualnym kroku */}
      <Box component="nav" aria-label="Postęp rejestracji" mb={4}>
        <Stepper activeStep={currentStep - 1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={currentStep > index + 1}>
              <StepLabel 
                StepIconProps={{ 
                  'aria-current': currentStep === index + 1 ? 'step' : undefined 
                } as any}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {currentStep === 1 && (
        <Step1 
          defaultValues={formData.step1} 
          onComplete={handleStep1Complete} 
          serverError={serverError}
          onCancel={onClose}
        />
      )}
      {currentStep === 2 && (
        <Step2 
          defaultValues={formData.step2} 
          onComplete={handleStep2Complete} 
          onBack={() => setCurrentStep(1)} 
        />
      )}
      {currentStep === 3 && (
        <Step3 
          data={formData} 
          onSubmitFinal={handleFinalSubmit} 
          onBack={() => setCurrentStep(2)} 
          isSubmitting={isSubmitting}
          rootError={rootError}
        />
      )}
    </Box>
  );
};