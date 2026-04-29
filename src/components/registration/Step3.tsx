import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography, Stack, Checkbox, FormControlLabel, Paper, FormHelperText } from '@mui/material';
import { step3Schema, Step3Data, Step1Data, Step2Data } from '../../schemas/registration.schema';

interface Step3Props {
  data: { step1?: Step1Data; step2?: Step2Data };
  onSubmitFinal: (data: Step3Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
  rootError?: string | null;
}

export const Step3 = ({ data, onSubmitFinal, onBack, isSubmitting, rootError }: Step3Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { rodo: false },
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitFinal)} noValidate>
      <Typography variant="h5" component="h2" mb={4} tabIndex={-1} ref={headingRef} fontWeight={700}>
        Krok 3: Podsumowanie
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Stack spacing={2}>
          <Typography variant="body1"><strong>Imię i nazwisko:</strong> {data.step1?.firstName} {data.step1?.lastName}</Typography>
          <Typography variant="body1"><strong>E-mail:</strong> {data.step1?.email}</Typography>
          <Typography variant="body1">
            <strong>Kategorie:</strong> {data.step2?.categories.map(c => c.value).join(', ') || 'Brak'}
          </Typography>
          <Typography variant="body1">
            <strong>Powiadomienia:</strong> E-mail ({data.step2?.notifications.email ? 'Tak' : 'Nie'}), Push ({data.step2?.notifications.push ? 'Tak' : 'Nie'})
          </Typography>
        </Stack>
      </Paper>

      <Controller
        name="rodo"
        control={control}
        render={({ field }) => (
          <Box>
            <FormControlLabel
              control={
                <Checkbox 
                  id="rodo" 
                  checked={field.value} 
                  onChange={field.onChange} 
                  inputProps={{ 
                    'aria-required': 'true', 
                    'aria-invalid': !!errors.rodo,
                    'aria-describedby': errors.rodo ? 'rodo-err' : undefined 
                  }} 
                />
              }
              label="Akceptuję regulamin i politykę prywatności *"
            />
            {errors.rodo && (
              <FormHelperText error id="rodo-err" role="alert" sx={{ ml: 4 }}>
                {errors.rodo.message}
              </FormHelperText>
            )}
          </Box>
        )}
      />

      {rootError && (
        <FormHelperText error id="server-err" role="alert" sx={{ mt: 2, fontSize: '1rem' }}>
          {rootError}
        </FormHelperText>
      )}

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          type="submit" 
          size="large" 
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Wysyłanie...' : 'Zarejestruj się'}
        </Button>
        <Button variant="text" onClick={onBack} size="large" sx={{ color: 'text.secondary' }} disabled={isSubmitting}>
          Wstecz
        </Button>
      </Box>
    </Box>
  );
};