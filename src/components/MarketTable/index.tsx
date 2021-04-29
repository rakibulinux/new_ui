import * as React from 'react'
import { useTable, usePagination } from 'react-table';
import styled from 'styled-components';

interface MarketTableProps {
    columns: any;
    data: any;
}
const TableStyles = styled.div`
    table {
        width: 100%;
        border-spacing: 0;
        th,td {
            margin: 0;
            cursor: pointer;
            font-size: 14px;
            color: #fff;
            text-align: justify;
            padding-top: 15px;
            padding-bottom: 15px;
            padding-right: 10px; 
            padding-left: 10px;
            transition: all 0.2s;
            background-color: #313445;
        }
        tr {
            border-top: 1px solid #848E9C;
        }
        th {
            color: #fff;
            background-color: #848E9C;
        }
        th:not(:first-child) {
            text-align: center
        }
        tr td:not(:first-child) {
            text-align: center
        }
        tr:hover td{
            background-color: #3c4055;
            color: #fff;
        }
    }
`;

export const MarketTable: React.FC<MarketTableProps> = (props: MarketTableProps) => {
    const { columns, data } = props;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,

    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    )
    return (
        <TableStyles>
            <table {...getTableProps()} style={{ position: 'relative' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th width={[...columns].length / 100 + "%"} {...column.getHeaderProps()}>
                                    <span style={{ fontWeight: 'normal' }}>
                                        {column.render('Header')}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                {
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td width={[...columns].length / 100 + "%"} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                }
            </table>
        </TableStyles>

    )
} 