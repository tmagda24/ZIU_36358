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
      <MultiStepForm onClose={onClose} />
    </Dialog>
  );
};