import React from 'react';
import {Stepper as StepperLib, Step, StepLabel} from '@mui/material';


const Stepper = ({steps}: any) => {
  return (
    <StepperLib activeStep={1} alternativeLabel>
      {steps.map((label: string) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </StepperLib>
  )
}
