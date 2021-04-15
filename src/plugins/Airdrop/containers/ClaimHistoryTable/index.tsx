import { Table } from 'antd/lib';
import format from 'date-fns/format';
import * as React from 'react';
import api from '../../../api/index';

interface ClaimHistoryProp {
    airdropID: string;
}

export const ClaimHistory: React.FC<ClaimHistoryProp> = (props: ClaimHistoryProp) => {

    const columns = [
        {
            title: 'Time Claim',
            dataIndex: 'timer_claim',
            key: 'timer_claim',
        },
        {
            title: 'User ID',
            dataIndex: 'user_uid',
            key: 'user_uid',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Bonus',
            dataIndex: 'bonus',
            key: 'bonus',
        },
    ];

    const [tableState, setTableState] = React.useState({
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
        loading: false,
    });

    const fetch = (params: any) => {
        setTableState({ ...tableState, loading: true });
        api.get(`/claim/fetch/airdrop_id=${props.airdropID}&page=${params.pagination.current - 1}&size=${params.pagination.pageSize}`)
            .then(response => {
                const data: any = [...response.data.payload];
                const newData = data.map(claim => {
                    const newdata = {
                        key: claim.claim_id,
                        timer_claim: format(new Date(claim.timer_claim), 'HH:mm:ss dd/MM/yyyy'),
                        user_uid: claim.user_uid,
                        email: claim.email.substring(0,5) + '**********',
                        bonus: claim.bonus,
                    };

                    return newdata;
                });

                setTableState({
                    loading: false,
                    data: newData,
                    pagination: {
                        ...params.pagination,
                        pageSize: params.pagination.pageSize,
                        total: response.data.total,
                    },
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleTableChange = pagination => {
        fetch({
            pagination,
          });
    };

    React.useEffect(() => {
        const { pagination } = tableState;
        fetch({ pagination });
    }, []);

    const { data, pagination, loading } = tableState;

    return (
        <div>
            <Table size="small" pagination={pagination} dataSource={data} loading={loading} columns={columns} onChange={handleTableChange} />
        </div>
    );
};
