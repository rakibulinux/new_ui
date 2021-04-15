import { Table } from 'antd';
import * as React from 'react';

//css
import './PrizeTable.css'

// image
import RankOne from '../../assets/1.png';
import RankTwo from '../../assets/2.png';
import RankThird from '../../assets/3.png';
import { Prize } from '../..';

interface PrizeTableProps {
    prizes: Prize[]
}

export const PrizeTable: React.FC<PrizeTableProps> = (props: PrizeTableProps) => {
    const { prizes } = props;
    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            render: rank => {
                if (rank === 1) {
                    return (
                        <img className="rank-icon" src={RankOne} alt="rank 1" />
                    )
                }
                if (rank === 2) {
                    return (
                        <img className="rank-icon" src={RankTwo} alt="rank 2" />
                    )
                }
                if (rank === 3) {
                    return (
                        <img className="rank-icon" src={RankThird} alt="rank 3" />
                    )
                }
                return rank;
            }
        },
        {
            title: 'Award',
            dataIndex: 'award',
            key: 'award',
        }
    ];


    return (
        <div id="prize-table" className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <Table size="small" pagination={false} dataSource={prizes} columns={columns} />
                </div>
            </div>
        </div>
    )
}
