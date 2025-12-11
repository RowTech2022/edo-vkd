import { SxProps } from '@mui/material'
import { CSSProperties } from 'react'

export const textFieldSx: SxProps = {
  borderRadius: '20px',
  height: '100%',
  WebkitBoxShadow: '0 0 0 1000px white inset',
  overflow: 'hidden',
  '& .MuiInputBase-root': {
    padding: 0,
    borderRadius: '20px',
    border: '2px solid transparent',
    '&.Mui-focused': {
      border: '2px solid #009688',
    },

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
  '& .MuiInputLabel-root': {
    background: 'none !important',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#009688',
    transform: 'translate(12px, 7px) scale(0.75) !important',
  },
  '& .MuiInputLabel-root.MuiFormLabel-filled': {
    transform: 'translate(12px, 7px) scale(0.75) !important',
  },
}

export const iconSx: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '1.8rem',
  transform: 'translateY(-50%)',
  color: '#009688',
  zIndex: 99,
}

export const labelStyles: CSSProperties = {
  fontSize: '1rem',
  paddingLeft: '5rem',
}

export const inputStyles: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 400,
  paddingLeft: '5rem',
  borderRadius: '20px',
}
