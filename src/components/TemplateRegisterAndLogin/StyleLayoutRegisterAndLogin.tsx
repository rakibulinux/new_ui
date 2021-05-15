import styled from 'styled-components';
import background from './assets/logincx.png';
const StyleLayoutRegisterAndLogin = styled.div`
	height: 655px;
	width: 1162px;
	.layout {
		height: 100%;
	}
	.sign-in-screen {
		height: 100%;
	}
	.introduction {
		background-image: url(${background});
		background-repeat: no-repeat;
		background-size: cover;
		object-fit: cover;
		width: 691px;
		color: #ffff;
		position: relative;
	}

	.introduction .introduction-content {
		position: absolute;
		top: 180px;
		left: 86px;
	}

	.introduction h3 {
		font-weight: bold;
		font-size: 40px;
		line-height: 47px;
	}
	.introduction .forwarding {
		background-color: #ffff;
		width: 56px;
		height: 4px;
	}
	.introduction p {
		margin-top: 18px;
		width: 408px;
		height: 58px;
	}
	.group-login {
		background-color: #ffff;
		width: 471px;
		color: #313445;
	}
	.group-login .qr {
		height: 80px;
		position: relative;
	}
	.qr img {
		position: absolute;
		right: 0;
	}
	.qr {
		height: 80px;
	}
	.link-web {
		margin: auto;
		width: 231px;
		height: 36px;
		background: rgba(132, 142, 156, 0.03);
		border: 1px solid rgba(47, 182, 126, 0.33);
		box-sizing: border-box;
		border-radius: 100px;
		display: flex;
		position: relative;
	}
	.link-web img {
		position: absolute;
		height: 15.75px;
		width: 12px;
		top: 9.75px;
		left: 10px;
	}
	.link-web p {
		position: absolute;
		font-weight: 300;
		font-size: 12px;
		top: 9.75px;
		line-height: 14px;
		left: 30px;
	}
	.link-web span {
		color: #2fb67e;
	}
	.form-group {
		margin: auto;
		margin-top: 40px;
	}
	.form-group label {
		font-weight: 300;
		font-size: 12px;
		line-height: 14px;
	}
	.form-group input {
		height: 40px;
	}
	#email {
		border: 1px solid rgba(47, 182, 126, 0.33);
	}
	.form-group button {
		height: 40px;
		width: 100%;
	}
	.bottom-section {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.bottom-section .forgot-password {
		cursor: pointer;
	}
	.bottom-section .forgot-password:hover {
		color: #2fb67e;
	}
	.register {
		cursor: pointer;
		color: #2fb67e;
	}
	h3 {
		margin-bottom: 13px;
	}
	@media (max-width: 735px) {
		.introduction {
			height: 0 !important;
		}
		.group-login {
			height: 600px;
		}
	}
`;
export { StyleLayoutRegisterAndLogin };
