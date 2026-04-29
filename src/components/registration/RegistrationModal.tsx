import { Dialog } from '@mui/material';
import { MultiStepForm } from './MultiStepForm';

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ open, onClose }: RegistrationModalProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      id="registration-modal"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4,
          bgcolor: 'background.paper',
          backgroundImage: 'none'
        }
      }}
    >
      <div id="modal-description" className="sr-only" style={{ display: 'none' }}>
        Formularz rejestracji składa się z trzech kroków. Użyj klawisza Tab, aby przemieszczać się między polami.
      </div>
      <MultiStepForm onClose={onClose} />
    </Dialog>
  );
};