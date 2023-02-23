import {Row, useAsyncDebounce} from "react-table";
import {PairData} from "../../reducers/PairsReducer";
import {TableInstance} from "../../components/organisms/PoolModule";
import React from "react";

interface TVLAndVolume {
    tvl: string,
    totalVolume: string,
}

const PoolResponsibilities = (pairState, currentQuery, tableInstance) => {

    const getColumns = () => {
        return [
            {
                id: 1,
                Header: 'Pool',
                accessor: 'name',
                Cell: (tableProps: any) => (
                  <img
                    src={tableProps.row.original.tokeIcon}
                    width={25}
                    alt='Token Icon'
                  />
                ),
            },
            {
                id: 2,
                Header: 'Liquidity',
                accessor: 'totalSupply',
            },
            {
                id: 3,
                Header: 'Volume 7D',
                accessor: 'volume7d',
            },
            {
                id: 4,
                Header: 'Fees 7d',
                accessor: 'fees24h',
            },
            {
                id: 5,
                Header: 'APR 7D',
                accessor: 'oneYFees',
            },
        ];
    }

    const getTVLandVolume = (pairState: Record<string, PairData>): TVLAndVolume => {
        const pairs = Object.values(pairState)

        const tvl = pairs.reduce((acc, pl) => {
            return acc += parseFloat(pl.totalLiquidityUSD)
        }, 0).toFixed(2)

        const totalVolume = pairs.reduce((acc, pl) => {
            return acc += parseFloat(pl.volume7d)
        }, 0).toFixed(2)

        const data = {
            tvl,
            totalVolume,
        };

        return data
    };

    const filter = (onlyStaked: boolean, row: Row<PairData>): any => {
        if (onlyStaked) {
            return parseFloat(row.original.balance) > 0;
        }

        return row;
    };

    const filterDataReload = (row: Row<PairData>): any => {
        if (currentQuery.trim().length == 0) return true;

        const data = row.original
        const query = currentQuery.toUpperCase()

        if (data.name.includes(query) || data.totalSupply.includes(query)
            || data.volume7d.includes(query) || data.volume1d.includes(query)) {
            return true
        }
        return false
    }

    const { setGlobalFilter } = tableInstance as any as TableInstance<PairData>
    const changeData = useAsyncDebounce(value => {
        if (setGlobalFilter != undefined) {
            setGlobalFilter(value || "")
        }
    }, 100)

    return {
        filter,
        changeData,
        filterDataReload,
        getColumns,
        getTVLandVolume
    }

}

export default PoolResponsibilities
