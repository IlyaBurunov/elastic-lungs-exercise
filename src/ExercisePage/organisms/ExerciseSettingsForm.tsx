import { memo } from 'react';
import dayjs from 'dayjs';
import mapValues from 'lodash/mapValues';

// @todo change on react-hook-form
import { Form, Field } from 'react-final-form';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';

import { SettingsNames } from '../settings';

const { InhaleTime, InhaleBreathHoldingTime, ExhaleTime, ExhaleBreathHoldingTime, LapsCount } = SettingsNames;

export type FormValues = {
  [key in SettingsNames]: number;
};

type Props = {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
};

export const ExerciseSettingsForm = memo<Props>(({ initialValues, onSubmit }: Props) => {
  const fields = [
    {
      name: InhaleTime,
      label: 'Inhale time',
      type: 'number',
    },
    {
      name: InhaleBreathHoldingTime,
      label: 'Inhale breath holding time',
      type: 'number',
    },
    {
      name: ExhaleTime,
      label: 'Exhale time',
      type: 'number',
    },
    {
      name: ExhaleBreathHoldingTime,
      label: 'Exhale breath holding time (optionaly)',
      type: 'number',
    },
    {
      name: LapsCount,
      label: 'Laps count',
      type: 'number',
    },
  ];

  return (
    <>
      <Typography align='center' variant='h5' gutterBottom>
        Set up the exercise settings
      </Typography>

      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, values }) => {
          const formValues = mapValues(values, Number);

          const totalTime = dayjs(
            new Date(
              (formValues[InhaleTime] +
                formValues[InhaleBreathHoldingTime] +
                formValues[ExhaleTime] +
                formValues[ExhaleBreathHoldingTime]) *
                formValues[LapsCount] *
                1000
            )
          ).format('mm:ss');

          return (
            <form onSubmit={handleSubmit}>
              <Box p={0} m={0} border='none' component='fieldset' disabled={submitting}>
                <Grid container alignItems='center' rowSpacing={3}>
                  {fields.map(({ name, label, type }) => (
                    <Grid key={name} item xs={12}>
                      <Field name={name} type='number'>
                        {({ input }) => (
                          // @todo change field to buttons and format value for improving UI/UX
                          <TextField {...input} label={label} type={type} variant='outlined' fullWidth />
                        )}
                      </Field>
                    </Grid>
                  ))}
                </Grid>

                <Box mt={3}>
                  <Typography align='center' variant='body1'>
                    Total time is {totalTime}
                  </Typography>
                </Box>

                <Box mt={3}>
                  <Button fullWidth variant='contained' type='submit'>
                    Apply
                  </Button>
                </Box>
              </Box>
            </form>
          );
        }}
      </Form>
    </>
  );
});
