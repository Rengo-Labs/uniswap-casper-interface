import '@testing-library/jest-dom'
import {jest} from '@jest/globals';
import {render} from '@testing-library/react'
import {SwitchBox} from "./index";

describe('Swtich Box Test', ()=> {
    test('Test 1 - Switch Rate', async () => {
        let firstToken = {symbol: 'TK1'}
        let secondToken = {symbol: 'TK2'}
        const rateA = 0.50
        const rateB = 2.00
        const onSwitch = jest.fn(() => {
            firstToken = {symbol: 'TK2'}
            secondToken = {symbol: 'TK1'}
        })

        const switchComponent = render(<SwitchBox onSwitch={onSwitch}
                                                  secondTokenSelected={firstToken}
                                                  firstTokenSelected={secondToken}
                                                  exchangeRateA={rateA}
                                                  exchangeRateB={rateB}
                                                  active={true}/>)

        switchComponent.debug()
        //No me funciono
        const button = await switchComponent.findByTestId('switch_box')
        button.click()

        switchComponent.rerender(<SwitchBox onSwitch={onSwitch}
                                            secondTokenSelected={firstToken}
                                            firstTokenSelected={secondToken}
                                            exchangeRateA={rateB}
                                            exchangeRateB={rateA}
                                            active={true}/>)
        switchComponent.debug()
    })
})