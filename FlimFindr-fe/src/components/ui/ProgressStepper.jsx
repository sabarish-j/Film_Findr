import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './ProgressStepper.css';

export const ProgressStepper = ({ steps, currentStep, completed = [] }) => {
  return (
    <div className="progress-stepper">
      <div className="progress-stepper__track">
        <motion.div
          className="progress-stepper__progress"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="progress-stepper__steps">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completed.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="progress-stepper__step">
              <motion.div
                className={`progress-stepper__circle ${isPast || isCompleted ? 'progress-stepper__circle--completed' : ''} ${
                  isCurrent ? 'progress-stepper__circle--current' : ''
                }`}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span className="progress-stepper__number">{stepNumber}</span>
                )}
              </motion.div>

              <span className="progress-stepper__label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
