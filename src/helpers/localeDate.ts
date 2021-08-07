import * as moment from 'moment-timezone';
import { getTimezone } from './timezone';

type IFormat = 'fullDate' | 'shortDate' | 'time' | 'date';

export const localeDate = (date, format: IFormat, timezone = getTimezone()) => {
	const getFormat = (type: IFormat) => {
		return {
			fullDate: 'DD-MM-YYYY HH:mm:ss',
			shortDate: 'DD-MM-YYYY HH:mm',
			date: 'DD-MM-YYYY',
			time: 'HH:mm:ss',
		}[type];
	};
	const formatDisplay = getFormat(format);
	const isUnix = typeof date === 'number';
	const momentObj = isUnix ? moment.unix(date) : moment(date);

	return momentObj.tz(timezone).format(formatDisplay);
};
