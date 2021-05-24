import * as React from 'react';
import { NewCustomInput, NewCustomInputProps } from './';

import { shallow } from 'enzyme';

const defaults: NewCustomInputProps = {
	type: '',
	label: '',
	defaultLabel: '',
	handleChangeInput: jest.fn(),
	inputValue: '',
	handleFocusInput: jest.fn(),
	classNameLabel: '',
	classNameInput: '',
	placeholder: '',
	autoFocus: false,
};

const setup = (props: Partial<NewCustomInputProps> = {}) => shallow(<NewCustomInput {...{ ...defaults, ...props }} />);

describe('CustomInput component', () => {
	it('should render', () => {
		const wrapper = setup();
		expect(wrapper).toMatchSnapshot();
	});

	it('renders without crashing', () => {
		const wrapper = setup();
		expect(wrapper).toBeDefined();
	});
});
