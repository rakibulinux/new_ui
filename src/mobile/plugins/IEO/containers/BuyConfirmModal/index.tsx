import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Modal, Row, Statistic } from 'antd';
import { useSelector } from 'react-redux';
import {selectCurrencies} from '../../../../../modules';
import * as React from 'react';
import NP from 'number-precision';


interface BuyConfirmModalProps {
    visible: boolean;
    onHiddenModal: () => void;
    onBuy: () => void;
    quantity: number;
    ieoID: string;
    baseBalance: number;
    baseCurrency: string;
    quoteBalance: number;
    quoteCurrency: string;
    quoteTotal: number;
    bonus: number;
}

export const BuyConfirmModal: React.FC<BuyConfirmModalProps> = (props: BuyConfirmModalProps) => {
    const currencies = useSelector(selectCurrencies);
    const { quantity, quoteBalance, quoteCurrency, baseBalance, baseCurrency, quoteTotal, bonus } = props;
    const findIcon = (code: string): string => {
        const currency = currencies.find((currency: any) => currency.id === code);
        try {
            return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
        } catch (err) {
            if (currency) return currency.icon_url;
            return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
        }
    };

    const bonusQuantity = NP.times(quantity, bonus);
    const totalQuanity = NP.plus(baseBalance, quantity, bonusQuantity);

    const baseTitle =
        <>
            <img style={{ width: '3rem', height: '3rem'}} src={findIcon(baseCurrency)} alt="" />
            <span style={{ fontSize: '1.6rem', marginLeft: '5px' }}>{baseCurrency}</span>
        </>
    const quoteTitle =
        <>
            <img style={{ width: '3rem', height: '3rem' }} src={findIcon(quoteCurrency)} alt="" />
            <span style={{ fontSize: '1.6rem', marginLeft: '5px' }}>{quoteCurrency}</span>
        </>
    return (
        <Modal
            title="Confirm to Buy"
            centered
            visible={props.visible}
            onOk={() => props.onBuy()}
            onCancel={() => props.onHiddenModal()}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title={baseTitle}
                            value={totalQuanity}
                            precision={2}
                            valueStyle={{ color: '#2a9d8f' }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title={quoteTitle}
                            value={NP.minus(quoteBalance, Number(quoteTotal))}
                            precision={4}
                            valueStyle={{ color: '#e9c46a' }}
                            prefix={<ArrowDownOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <br />
            {bonus > 0 ? <Alert message={`🥳 You will receive ${bonus * 100}% bonus of ${quantity} ${baseCurrency.toUpperCase()}
             (+${bonusQuantity} ${baseCurrency.toUpperCase()}) = ${NP.plus(quantity, bonusQuantity)} ${baseCurrency.toUpperCase()}`} type="info" />
                : ''}
        </Modal>
    )
}
