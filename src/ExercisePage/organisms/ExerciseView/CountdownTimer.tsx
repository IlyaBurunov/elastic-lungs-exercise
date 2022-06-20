import dayjs from 'dayjs';

import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { useCountdownTimer } from './hooks/useCountdownTimer';

type Props = {
  duration: number;
  autoStart?: boolean;
  onTick?: (durationLeft: number) => void;
  onExpire?: () => void;
};

export function CountdownTimer({ duration, autoStart, onTick, onExpire }: Props) {
  const { duration: timeLeft, isRunning, start, pause } = useCountdownTimer(duration, { autoStart, onTick, onExpire });

  const currentTime = dayjs(new Date(timeLeft)).format('mm:ss');

  return (
    <>
      <Typography variant='h4' align='center'>
        {currentTime}
      </Typography>

      <Box mt={3} display='flex' justifyContent='center'>
        {isRunning ? (
          <IconButton color='secondary' onClick={pause}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton color='primary' onClick={start}>
            <PlayArrowIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
}
