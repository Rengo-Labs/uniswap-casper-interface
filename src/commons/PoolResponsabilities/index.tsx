import {Row, useAsyncDebounce} from "react-table";
import {PairData} from "../../reducers/PairsReducer";
import {TableInstance} from "../../components/organisms/PoolModule";

const PoolResponsibilities = (pairState, currentQuery, tableInstance) => {

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
        filterDataReload
    }

}

export default PoolResponsibilities
