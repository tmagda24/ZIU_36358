import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography
} from '@mui/material';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export default function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  taskTitle 
}: DeleteConfirmationModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // WCAG: Powiązanie tytułu i opisu dla czytników ekranu
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
        Potwierdź usunięcie
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Czy na pewno chcesz usunąć zadanie: 
          <Typography component="span" fontWeight="bold" color="text.primary" sx={{ ml: 1 }}>
            "{taskTitle}"
          </Typography>? 
          Tej operacji nie można cofnąć.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Anuluj
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          autoFocus // Fokus domyślnie ustawiony na przycisk potwierdzenia
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          Usuń zadanie
        </Button>
      </DialogActions>
    </Dialog>
  );
}