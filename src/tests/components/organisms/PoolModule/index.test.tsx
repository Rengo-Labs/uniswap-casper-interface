import '@testing-library/jest-dom'
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent} from '@testing-library/react'
import {PoolModule} from "../../../../components/organisms/PoolModule";

import {jest} from "@jest/globals";
jest.mock('axios', () => {})
jest.mock('@toruslabs/casper-embed', () => {})

import {getColumns, getPoolList, loadPoolDetailByUser} from "../../../../mocks/components/organisms/PoolsContext";
import {TestContext} from "../../../../mocks/contexts/PoolContext/index.mocks";
import {ProgressBarContextWithReducer} from "../../../../contexts/ProgressBarContext";

describe("Test for Pool Module", () => {

    test("Test 1 - toggle for checking active pools only", async () => {
        const headers = getColumns()
        const poolList = await getPoolList()

        const poolModule = render(
            <TestContext>
                <ProgressBarContextWithReducer>
                    <Router>
                        <PoolModule columns={headers} data={poolList}/>
                    </Router>
                </ProgressBarContextWithReducer>
            </TestContext>
        )

        const labelChangedBefore = await poolModule.getAllByRole("row")
        expect(labelChangedBefore).toHaveLength(5)

        const button = await poolModule.findByTestId("toggle_id")
        fireEvent.click(button)

        //After clicking the toggle button, the poolList must be updated
        const newPoolList = await loadPoolDetailByUser("hash")
        poolModule.rerender(
            <TestContext>
                <ProgressBarContextWithReducer>
                    <Router>
                        <PoolModule columns={headers} data={newPoolList}/>
                    </Router>
                </ProgressBarContextWithReducer>
            </TestContext>
        )

        const labelChanged = await poolModule.getAllByRole("row")
        expect(labelChanged).toHaveLength(1);
    })
})
