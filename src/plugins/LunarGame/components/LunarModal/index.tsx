import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import * as React from 'react';

interface Props {
	onClickBanner: () => void;
}

type LunarModalProp = Props & ModalProps;

export const LunarModal: React.FC<LunarModalProp> = ({ onClickBanner, ...rest }) => {
	const modalBg = require('../../assets/modal.png');

	return (
		<Modal
			style={{ position: 'relative' }}
			closeIcon={<CloseOutlined style={{ fontSize: '25px', color: '#2B3139' }} />}
			footer={null}
			mask={false}
			{...rest}
		>
			<img
				style={{ position: 'absolute', top: '0', left: '0', width: '100%', cursor: 'pointer' }}
				src={modalBg}
				alt="bg-modal"
				onClick={onClickBanner}
			/>
		</Modal>
	);
};
