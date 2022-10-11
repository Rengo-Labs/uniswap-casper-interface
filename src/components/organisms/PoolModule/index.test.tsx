import '@testing-library/jest-dom'
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent} from '@testing-library/react'
import {PoolModule} from "./index";

import {jest} from "@jest/globals";
jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

import {getColumns, getPoolList, loadPoolDetailByUser} from "../../../contexts/PoolsContext";
import {ConfigContextWithReducer} from "../../../contexts/ConfigContext";

describe("Test for Pool Module", () => {

    test("Test 1 - toggle for checking active pools only", async () => {
        const headers = getColumns()
        const poolList = await getPoolList()

        //we load PoolsContext and Router to use our context and useNavigate in PoolModule
        const poolModule = render(
            <ConfigContextWithReducer>
                <Router>
                    <PoolModule columns={headers} data={poolList}/>
                </Router>
            </ConfigContextWithReducer>
        )

        const labelChangedBefore = await poolModule.getAllByRole("row")
        expect(labelChangedBefore).toHaveLength(9)

        const button = await poolModule.findByTestId("toggle_id")
        fireEvent.click(button)

        //After clicking the toggle button, the poolList must be updated
        const newPoolList = await loadPoolDetailByUser("hash", poolList)
        poolModule.rerender(
            <ConfigContextWithReducer>
                <Router>
                    <PoolModule columns={headers} data={newPoolList}/>
                </Router>
            </ConfigContextWithReducer>
        )

        const labelChanged = await poolModule.getAllByRole("row")
        expect(labelChanged).toHaveLength(3);
    })
})
