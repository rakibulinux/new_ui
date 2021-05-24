import styled from 'styled-components';

export const SignUpStyle = styled.form`
	margin-top: 39px;
	.cr-sign-up-form__group {
		margin-top: 20px;
	}
	.cr-sign-up-form__input {
		height: 40px;
		background: rgba(132, 142, 156, 0.03);
		border: 1px solid rgba(47, 182, 126, 0.33);
		box-sizing: border-box;
		border-radius: 5px;
	}
	.referral-code {
		cursor: pointer;
	}
	.sign-up-form-back-login {
		text-align: center;
		font-size: 14px;
		span {
			cursor: pointer;
			color: #28a745;
		}
	}
	.sign-up-form-open-form-login:hover {
		text-decoration: underline;
	}
`;
