import styled from 'styled-components';

export const StyleComponent = styled.div`
	background-color: #ffff;
	text-align: left;
	font-family: 'Roboto', sans-serif;

	.forgot_password {
		color: #313445;
		text-align: center;
	}
	.forgot_password_title {
		color: #313445;
		font-size: 24px;
		line-height: 28px;
		font-weight: normal;
	}
	.forgot_password_content {
		font-weight: 300;
		font-size: 12px;
		line-height: 14px;
	}
	.forgot_password_information {
		color: #2fb67e;
		background: rgba(47, 182, 126, 0.1);
		font-size: 12px;
		height: 59px;
		display: flex;
		text-align: left;
		position: relative;
		img {
			position: absolute;
			top: 8.33%;
			height: 20px;
		}
		p {
			position: absolute;
			left: 10%;
			top: 8.33%;
			width: 85%;
		}
	}
	.forgot-password-screen__container {
		margin-top: 45px;
	}
`;
