import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const formControllSx: SxProps = {
  position: 'relative',

  '& .MuiFormLabel-root': {
    paddingLeft: '5rem',
    fontSize: '1.8rem',
  },

  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, 8px) scale(0.75)',
  },
};

export const selectFieldSx: SxProps = {
  borderBottom: 'none',
  borderRadius: 5,
  height: '60px',
  WebkitBoxShadow: '0 0 0 1000px white inset',
  overflow: 'hidden',
  '& fieldset': {
    background: '#F2F2F2',
    border: 'none',
  },
  '& .MuiSelect-select ': {
    color: '#000',
    zIndex: 99,
    paddingTop: 6,
    paddingLeft: '5rem',
    fontSize: '1.8rem',
    fontWeight: 400,
  },
  '& .MuiInputBase-root': {
    borderRadius: 4,

    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },

    '& input': {
      paddingTop: '25px',
      paddingBottom: '8px',
    },
  },
};

export const iconSx: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '1.8rem',
  transform: 'translateY(-50%)',
  color: '#009688',
  zIndex: 99,
};

export const labelStyles: CSSProperties = {
  fontSize: '1.8rem',
  paddingLeft: '5rem',
};

export const inputStyles: CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 400,
  paddingLeft: '5rem',
};
