import * as React from 'react';
import { Decimal } from '../../../components/Decimal';
import { localeDate } from '../../../helpers';

const RowItemComponent = props => {
	return (
		<div className="td-mobile-table-row">
			<div className="td-mobile-table-row__amount">
				<div className="td-mobile-table-row__amount-value">
					<Decimal fixed={props.fixed}>{props.amount}</Decimal>
				</div>
				<span className="td-mobile-table-row__amount-currency">{props.currency}</span>
			</div>
			<div className="td-mobile-table-row__date">{localeDate(props.createdAt, 'fullDate')}</div>
		</div>
	);
};

const RowItem = React.memo(RowItemComponent);

export { RowItem };
