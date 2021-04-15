import { Col, Row, Statistic } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router';
import './IEOItem.css';
import Countdown from 'react-countdown';
import { currenciesFetch, SaleItem, selectCurrencies } from '../../../../../modules';
import { useDispatch, useSelector } from 'react-redux';
interface SaleItemProps {
    key: string | number | undefined;
    sale: SaleItem;
    type: 'ongoing' | 'upcoming' | 'ended';
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        // window.location.reload(false);
        return <span id="ieo-item-mobile__timer">
            00:00:00:00
        </span>;
    } else {
        // Render a countdown
        return <span id="ieo-item-mobile__timer">{days}:{hours}:{minutes}:{seconds}</span>
    }
};

export const IEOItem: React.FC<SaleItemProps> = (props: SaleItemProps) => {
    const history = useHistory();

    const dispatch = useDispatch();
    const dispatchcFetchCurrencies = () => dispatch(currenciesFetch());

    React.useEffect(() => {
        dispatchcFetchCurrencies();
    }, []);
    const currencies = useSelector(selectCurrencies);
    let saleBadgeColor: string = '#0C9D58ff';
    switch (props.type) {
        case 'ongoing':
            saleBadgeColor = '#0C9D58ff';
            break;
        case 'upcoming':
            saleBadgeColor = '#FABE08ff';
            break;
        case 'ended':
            saleBadgeColor = '#EA4235ff';
            break;
        default:
            break;
    }

    const countdownTime = props.type === 'upcoming' ? new Date(props.sale.start_date) : new Date(props.sale.end_date);
    let countdownTitle;

    if (props.type === 'upcoming') {
        countdownTitle = <span className="text-success">START IN</span>;
    } else if (props.type === 'ongoing') {
        countdownTitle = <span className="text-warning">END IN</span>;
    } else {
        countdownTitle = <span className="text-danger">ENDED</span>;
    }
    const saleType = props.type ? props.type.toUpperCase() : 'Unavailable';

    const findIcon = (code: string): string => {
        const currency = currencies.find((currency: any) => currency.id === code);
        try {
            return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
        } catch (err) {
            if (currency) return currency.icon_url;
            return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
        }
    };
    const handleDetailClick = () => {
        const location = {
            pathname: '/ieo/detail/' + props.sale.id
        }
        history.push(location);
    }
    return (
        <div className="ieo-item-mobile" onClick={handleDetailClick}>
            <span className="ieo-item-mobile__badge" style={{ backgroundColor: saleBadgeColor }}>{saleType}</span>
            <div className="row">
                <div className="col-6">
                    <h3 className="ieo-item-mobile__title">{props.sale.currency_id.toUpperCase()}</h3>
                </div>
                <div className="col-6">
                    <img className="img-fluid" src={props.sale.image_link} alt="" />
                </div>
                <div className="col-12">
                    <span className="ieo-item-mobile__subtitle">{props.sale.description}</span>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-6">
                    <Statistic title="STARTING PRICE:" value={`$${props.sale.price} USD`} />
                </div>
                <div className="col-6 d-flex">
                    <span className="text-bold">{countdownTitle}: <Countdown date={countdownTime} renderer={renderer} /></span>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-12">
                    <Row gutter={[8, 8]}>
                        {props.sale.currency_available.map((currency) => (
                            <Col span={4}>
                                <img style={{ width: '1.5rem', height: '1.5rem', marginTop: '0.5rem' }} src={findIcon(currency)} alt="" />
                            </Col>
                        ))}
                    </Row>

                </div>
            </div>
        </div>
    );
};
