import '@testing-library/jest-dom'
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent} from '@testing-library/react'
import {PoolModule} from "./index";

import {jest} from "@jest/globals";
import {PoolsContext} from "../../../contexts/PoolsContext";
jest.mock('@toruslabs/casper-embed', () => {})

describe("Test for Pool Module", () => {

    test("Test 1 - toggle for checking active pools only", async () => {

        //we load PoolsContext and Router to use our context and useNavigate in PoolModule
        const poolModule = render(
            <PoolsContext>
                <Router>
                    <PoolModule/>
                </Router>
            </PoolsContext>
        )

        const labelChangedBefore = await poolModule.getAllByRole("row")
        expect(labelChangedBefore).toHaveLength(9)

        const button = await poolModule.findByTestId("toggle_id")
        fireEvent.click(button)

        const labelChanged = await poolModule.getAllByRole("row")
        expect(labelChanged).toHaveLength(3);
    })
})
