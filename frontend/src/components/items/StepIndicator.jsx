import React from 'react';
import styles from './StepIndicator.module.css';

function StepIndicator({ currentStep = 1 }) {
  const steps = [1, 2, 3];

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Step {currentStep} of 3</div>
      <div className={styles.track}>
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isInactive = step > currentStep;

          return (
            <React.Fragment key={step}>
              <div
                className={[
                  styles.stepCircle,
                  isCompleted ? styles.completed : '',
                  isActive ? styles.active : '',
                  isInactive ? styles.inactive : '',
                ].join(' ')}
              >
                {isCompleted ? '✓' : step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={[
                    styles.connector,
                    step < currentStep ? styles.connectorDone : '',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
