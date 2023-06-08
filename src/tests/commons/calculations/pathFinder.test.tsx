import '@testing-library/jest-dom'
import {getListPath, getPath} from "../../../commons/calculations/pathFinder";
import {
    initialPairsStateMock1,
    initialPairsStateMock2,
    initialPairsStateMock3,
    initialTokenStateMock1,
    initialTokenStateMock2,
    initialTokenStateMock3
} from "../../../mocks/commons/calculations/functions.mock";
import {jest} from "@jest/globals";
jest.mock("axios", () => {})
jest.mock("@toruslabs/casper-embed", () => {})

describe("Test for Path Finder", () => {

    test('Case 1 - Finding PATH using current data', () => {
        const linkedList = getPath('CSX', 'WCSPR', Object.values(initialTokenStateMock1.tokens), Object.values(initialPairsStateMock1))
        const linkedList2 = getListPath('CSX', 'WCSPR', Object.values(initialTokenStateMock1.tokens), Object.values(initialPairsStateMock1))

        expect(linkedList).toHaveLength(2)
        expect(linkedList[0].id).toBe('CSX')
        expect(linkedList[linkedList.length-1].id).toBe('WCSPR')

        expect(linkedList2).toHaveLength(1)
        expect(linkedList2[0].symbol0).toBe('CSX')
        expect(linkedList2[linkedList2.length-1].symbol1).toBe('WCSPR')
    })

    test('Case 2 - Finding Path using New contracts', () => {
        const linkedList = getPath('USDC', 'DAI', Object.values(initialTokenStateMock2.tokens), Object.values(initialPairsStateMock2))

        expect(linkedList).toHaveLength(3)
        expect(linkedList[0].id).toBe('USDC')
        expect(linkedList[linkedList.length-1].id).toBe('DAI')
    })

    test('Case 3 - Build router nodes', () => {
        const linkedList = getListPath('USDC', 'BNB', Object.values(initialTokenStateMock3.tokens), Object.values(initialPairsStateMock3))

        expect(linkedList).toHaveLength(5)
        expect(linkedList[0].symbol0).toBe("USDC")
        expect(linkedList[linkedList.length-1].symbol1).toBe("BNB")
    })
})
