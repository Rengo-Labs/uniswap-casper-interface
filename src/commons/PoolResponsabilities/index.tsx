import {Row} from "react-table";
import {PairActions, PairData} from "../../reducers/PairsReducer";
import React from "react";
import store from "store2";

interface TVLAndVolume {
    tvl: string,
    totalVolume: string,
}

const PoolResponsibilities = (pairState, pairDispatch) => {
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
            {
                id: 6,
                Header: 'Ac. Reward',
                accessor: 'accumulatedReward',
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

    const filterDataReload = (currentQuery: string, row: Row<PairData>): any => {
        if (currentQuery.trim().length == 0) return true;

        const data = row.original
        const query = currentQuery.toUpperCase()

        if (data.name.includes(query) || data.totalSupply.includes(query)
            || data.volume7d.includes(query) || data.volume1d.includes(query)) {
            return true
        }
        return false
    }

    const changeRowPriority = (name, priority) => {
        store.set(name, priority)
        pairDispatch({
            type: PairActions.CHANGE_PRIORITY,
            payload: {
                name: name,
                checked: priority
            }
        });
    }

    const sortByPriority = (rows) => {
        rows.sort((row1: Row<PairData>, row2: Row<PairData>) => {
            return store.get(row1.original.name) ? -1 : 1
        })

        return rows
    }

    return {
        filter,
        filterDataReload,
        getColumns,
        getTVLandVolume,
        changeRowPriority,
        sortByPriority
    }

}

export default PoolResponsibilities
