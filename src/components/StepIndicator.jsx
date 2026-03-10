import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
    return (
        <div className="steps">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <div
                        key={step.id}
                        className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                        <div className="step-number">
                            {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="step-label">
                            <span className="icon-wrapper" style={{ marginBottom: '4px', display: 'block' }}>
                                <Icon size={16} />
                            </span>
                            {step.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
