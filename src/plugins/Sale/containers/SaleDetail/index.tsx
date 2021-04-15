import * as React from 'react';
import { LKT } from './LKT';
import { LKT2 } from './LKT2';

interface SaleDetailProps {
    ieoID: number;
}

export const SaleDetail: React.FC<SaleDetailProps> = (props: SaleDetailProps) => {
    let saleDetail;
    
    switch (props.ieoID) {
        case 1:
            saleDetail = <LKT />
            break;
        case 2:
            saleDetail = <LKT2 />
            break;
    
        default:
            break;
    }
    return (
        <div>
            {saleDetail}
        </div>
    )
}
