import {
  Grid,
  Button,
  Box,
  TextField,
  Autocomplete,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

export default function SearchBox({ optionList }: any) {
  const router = useRouter();

  const { control, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      single: {},
    },
  });
  const onSubmit = async (data: any) => {
    const m = data.single.url.match('/.*\/([0-9]+)/');
    if (!m) return false;

    return router.push({
      pathname: '/pokemon/[id]',
      query: { id: m[1] },
    })
  };

  return (
    <>
      <form className="max-w-xs mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="single"
          render={() => (
            <Autocomplete
              fullWidth
              options={optionList}
              getOptionLabel={(option: any) => option.name }
              renderInput={(params) => <TextField {...params} label="Pokemon" />}
              onChange={(event, value) => {
                setValue('single', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
          )}
        />
      </form>
    </>
  );
}
