import { memo } from 'react';
import dayjs from 'dayjs';

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
    },
    {
      name: InhaleBreathHoldingTime,
      label: 'Inhale breath holding time',
    },
    {
      name: ExhaleTime,
      label: 'Exhale time',
    },
    {
      name: ExhaleBreathHoldingTime,
      label: 'Exhale breath holding time (optionaly)',
    },
    {
      name: LapsCount,
      label: 'Laps count',
    },
  ];

  return (
    <>
      <Typography align='center' variant='h5' gutterBottom>
        Set up the exercise settings
      </Typography>

      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, values }) => {
          const totalTime = dayjs(
            new Date(
              (values[InhaleTime] +
                values[InhaleBreathHoldingTime] +
                values[ExhaleTime] +
                values[ExhaleBreathHoldingTime]) *
                values[LapsCount] *
                1000
            )
          ).format('mm:ss');

          return (
            <form onSubmit={handleSubmit}>
              <Box p={0} m={0} border='none' component='fieldset' disabled={submitting}>
                <Grid container alignItems='center' rowSpacing={3}>
                  {fields.map(({ name, label }) => (
                    <Grid key={name} item xs={12}>
                      <Field name={name} type='number' parse={Number}>
                        {({ input }) => (
                          // @todo change field to buttons and format value for improving UI/UX
                          <TextField
                            {...input}
                            inputProps={{ ...input, min: 0 }}
                            label={label}
                            variant='outlined'
                            fullWidth
                          />
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
