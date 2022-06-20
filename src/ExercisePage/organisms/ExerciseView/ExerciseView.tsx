import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import find from 'lodash/find';
import findLastIndex from 'lodash/findLastIndex';

import { Box, Button, Typography } from '@mui/material';

import beepSound from 'assets/sounds/beep.mp3';
import switchSound from 'assets/sounds/switch_sound.wav';
import whistleSound from 'assets/sounds/whistle.wav';

import { SettingsNames } from '../../settings';
import { CountdownTimer } from './CountdownTimer';

export type ExerciseSettings = {
  [key in SettingsNames]: number;
};

type TimerPhase = {
  title: string;
  time: number;
};

type Props = {
  settings: ExerciseSettings;
  onGoBack: () => void;
};

export const ExerciseView = memo<Props>(
  ({
    settings: { inhaleTime, inhaleBreathHoldingTime, exhaleTime, exhaleBreathHoldingTime, lapsCount },
    onGoBack,
  }: Props) => {
    const [lap, setLap] = useState<number>(1);

    const timerPhases: TimerPhase[] = useMemo(
      // @todo add preparation phase
      () => [
        {
          title: 'Inhale',
          time: inhaleTime,
        },
        {
          title: 'Inhale breath holding',
          time: inhaleBreathHoldingTime,
        },
        {
          title: 'Exhale',
          time: exhaleTime,
        },
        {
          title: 'Exhale breath holding',
          time: exhaleBreathHoldingTime,
        },
      ],
      [inhaleTime, inhaleBreathHoldingTime, exhaleTime, exhaleBreathHoldingTime]
    );

    const [phase, setPhase] = useState<TimerPhase>(
      // @todo change timerPhases[0] to first required setting
      timerPhases.find(({ time }) => time > 0) ?? timerPhases[0]
    );

    useEffect(() => {
      const invalidSettings = Object.entries({ inhaleTime, inhaleBreathHoldingTime, exhaleTime })
        .filter(([, value]) => value <= 0)
        .map(([key]) => key);

      if (invalidSettings.length > 0) {
        throw new Error(
          `Provided invalid values for ${invalidSettings.join(', ')} required settings. Value must be greater than 0.`
        );
      }
    }, [inhaleTime, inhaleBreathHoldingTime, exhaleTime, exhaleBreathHoldingTime]);

    const lastPhaseIndex = findLastIndex(timerPhases, ({ time }) => time > 0);
    const currentPhaseIndex = timerPhases.indexOf(phase);
    const isLastPhase = currentPhaseIndex === lastPhaseIndex;
    const isLastLap = lap === lapsCount;

    const handleExpire = useCallback(() => {
      const nextPhase = find(timerPhases, ({ time }) => time > 0, isLastPhase ? 0 : currentPhaseIndex + 1);

      if (isLastPhase && !isLastLap) {
        setLap(lap + 1);
      } else if (isLastLap && isLastPhase) {
        onGoBack();
      }

      if (nextPhase != null) {
        setPhase(nextPhase);
      }
    }, [timerPhases, currentPhaseIndex, isLastPhase, isLastLap, lap, onGoBack]);

    const handleTick = useCallback(
      (durationLeft: number) => {
        const beep = new Audio(beepSound);
        const switchBeep = new Audio(switchSound);
        const whistle = new Audio(whistleSound);

        if (durationLeft === 0) {
          if (isLastLap && isLastPhase) {
            whistle.play();
          } else {
            switchBeep.play();
          }
        } else if (durationLeft <= 3000) {
          beep.play();
        }
      },
      [isLastLap, isLastPhase]
    );

    return (
      <>
        <Box mb={3}>
          <Button variant='contained' fullWidth onClick={onGoBack}>
            Exit
          </Button>
        </Box>

        <Typography align='center'>Lap: {lap}</Typography>

        <Typography align='center'>{phase.title}</Typography>

        <CountdownTimer key={phase.title} duration={phase.time} autoStart onTick={handleTick} onExpire={handleExpire} />
      </>
    );
  }
);
