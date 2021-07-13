import React from 'react';

interface NewModalProps {
	show: boolean;
	onClose: () => void;
	children: JSX.Element[];
}

export const NewModal = (props: NewModalProps) => {
	const { show, onClose, children } = props;
	const showHideClassName = show ? 'modal display-block' : 'modal display-none';

	return (
		<div id="mobile-modal">
			<div className={showHideClassName}>
				<section className="modal-main">
					{children}
					<button type="button" className="close" onClick={onClose}>
						<span aria-hidden="true">×</span>
						<span className="sr-only">Close</span>
					</button>
				</section>
			</div>
		</div>
	);
};
