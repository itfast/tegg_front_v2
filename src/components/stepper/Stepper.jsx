/* eslint-disable react/prop-types */
import { StepperContainer } from "./StepperStyles";

export const Stepper = ({ typeStepper }) => {
	return (
		<StepperContainer style={{maxWidth: '1000px', margin: 'auto'}}>
			<div className="stepper-wrapper">
				{typeStepper.map((s, i) => (
					<div key={i} className={`stepper-item ${s.status}`}>
						<div className="step-counter">{i + 1}</div>
						<h5 className="step-name">{s.name}</h5>
					</div>
				))}
			</div>
		</StepperContainer>
	);
};
