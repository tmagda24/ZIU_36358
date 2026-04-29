import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography, Stack, Checkbox, FormControlLabel, TextField, Chip, FormHelperText } from '@mui/material';
import { step2Schema, Step2Data } from '../../schemas/registration.schema';

interface Step2Props {
  defaultValues?: Partial<Step2Data>;
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
}

export const Step2 = ({ defaultValues, onComplete, onBack }: Step2Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [newCategory, setNewCategory] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      categories: [],
      notifications: { email: true, push: false },
      newsletter: false,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      append({ value: newCategory.trim() });
      setNewCategory('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onComplete)} noValidate>
      <Typography variant="h5" component="h2" mb={4} tabIndex={-1} ref={headingRef} fontWeight={700}>
        Krok 2: Preferencje
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>Kategorie zadań *</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Np. Praca, Dom"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <Button variant="outlined" onClick={handleAddCategory}>Dodaj</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {fields.map((field, index) => (
              <Chip key={field.id} label={field.value} onDelete={() => remove(index)} color="primary" variant="outlined" />
            ))}
          </Box>
          {errors.categories && (
             <FormHelperText error id="cat-err" role="alert">
               {errors.categories.root?.message || errors.categories.message}
             </FormHelperText>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>Powiadomienia</Typography>
          <Controller
            name="notifications.email"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox id="notif-email" aria-label="Powiadomienia e-mail" checked={field.value} onChange={field.onChange} />}
                label="Otrzymuj powiadomienia E-mail"
              />
            )}
          />
          <Controller
            name="notifications.push"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox id="notif-push" aria-label="Powiadomienia push" checked={field.value} onChange={field.onChange} />}
                label="Otrzymuj powiadomienia Push"
              />
            )}
          />
        </Box>

        <Box>
          <Controller
            name="newsletter"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox id="newsletter" aria-label="Zapis na newsletter" checked={field.value} onChange={field.onChange} />}
                label="Chcę otrzymywać porady i nowości (Newsletter)"
              />
            )}
          />
        </Box>
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit" size="large">
          Dalej
        </Button>
        <Button variant="text" onClick={onBack} size="large" sx={{ color: 'text.secondary' }}>
          Wstecz
        </Button>
      </Box>
    </Box>
  );
};