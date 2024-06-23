// @import "compass";
import styled from "styled-components";

// Stepper
export const StepperContainer = styled.div`
	.stepper-wrapper {
		font-family: Arial;
		/* margin-top: 50px; */
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.stepper-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;

		@media (max-width: 768px) {
			font-size: 12px;
		}
		@media (max-width: 440px) {
			font-size: 10px;
		}
		@media (max-width: 370px) {
			font-size: 8px;
		}
	}

	.stepper-item::before {
		position: absolute;
		content: "";
		border-bottom: 2px solid #ccc;
		width: 100%;
		top: 20px;
		left: -50%;
		z-index: 2;
	}

	.stepper-item::after {
		position: absolute;
		content: "";
		border-bottom: 2px solid #ccc;
		width: 100%;
		top: 20px;
		left: 50%;
		z-index: 2;
	}

	.stepper-item .step-counter {
		position: relative;
		z-index: 5;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #ccc;
		margin-bottom: 6px;
	}

	.stepper-item.active {
		font-weight: bold;
	}

	.stepper-item.completed .step-counter {
		background-color: #00d959;
		color: #fff;
	}

	.stepper-item.current .step-counter {
		background-color: #ced900;
		color: #fff;
	}

	.stepper-item.completed::after {
		position: absolute;
		content: "";
		border-bottom: 2px solid #00d959;
		width: 100%;
		top: 20px;
		left: 50%;
		z-index: 3;
	}

	.stepper-item:first-child::before {
		content: none;
	}
	.stepper-item:last-child::after {
		content: none;
	}
`;
