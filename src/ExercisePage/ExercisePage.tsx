import { memo, useState } from 'react';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

import { Box, Container } from '@mui/material';

import { ExerciseSettingsForm, FormValues } from './organisms/ExerciseSettingsForm';
import { ExerciseView } from './organisms/ExerciseView';

import { SettingsNames } from './settings';

type ExerciseSettings = {
  [key in SettingsNames]: number;
};

const INITIAL_VALUES: FormValues = {
  [SettingsNames.InhaleTime]: 5,
  [SettingsNames.InhaleBreathHoldingTime]: 5,
  [SettingsNames.ExhaleTime]: 5,
  [SettingsNames.ExhaleBreathHoldingTime]: 0,
  [SettingsNames.LapsCount]: 2,
};

export const ExercisePage = memo(function ExercisePage() {
  const [exericeSettings, setExericeSettings] = useState<ExerciseSettings>(INITIAL_VALUES);
  const [isExericeView, setExerciseView] = useState<boolean>(false);

  const settings = {
    ...exericeSettings,
    ...mapValues(omit(exericeSettings, ['lapsCount']), (value: number) => value * 1000),
  };

  function handleSubmit(values: FormValues) {
    setExericeSettings(values);
    setExerciseView(true);
  }

  return (
    <Container maxWidth='xs' sx={{ padding: 2, height: '100vh' }}>
      <Box mx='auto' width='300px'>
        {isExericeView ? (
          <ExerciseView settings={settings} onGoBack={() => setExerciseView(false)} />
        ) : (
          <ExerciseSettingsForm initialValues={INITIAL_VALUES} onSubmit={handleSubmit} />
        )}
      </Box>
    </Container>
  );
});
