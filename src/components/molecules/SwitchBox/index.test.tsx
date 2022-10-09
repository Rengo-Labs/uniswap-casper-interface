import '@testing-library/jest-dom'
import {jest} from '@jest/globals';
import {render, fireEvent} from '@testing-library/react'
import {SwitchBox} from "./index";
import React, {useState} from "react";

describe('Swtich Box Test', ()=> {
    test('Test 1 - Switch Rate', async () => {
        const firstToken = {symbol: 'TK1'}
        const secondToken = {symbol: 'TK2'}
        const rateA = 0.50
        const rateB = 2.00
        const onSwitch = jest.fn()

        const switchComponent = render(<SwitchBox onSwitch={onSwitch}
                                                  secondTokenSelected={firstToken}
                                                  firstTokenSelected={secondToken}
                                                  exchangeRateA={rateA}
                                                  exchangeRateB={rateB}
                                                  active={true}/>)

        const dataBefore = await switchComponent.getByTestId('id_rate')
        expect(dataBefore).toHaveTextContent("1 TK1 ≈ 2 TK2");

        const button = await switchComponent.findByTestId('switch_rate')
        fireEvent.click(button)

        const data = await switchComponent.getByTestId('id_rate')
        expect(data).toHaveTextContent("1 TK2 ≈ 0.5 TK1");
    })

    test('Test 2 - Switch tokens', async () => {
        let ft = {symbol: 'TK1'}
        let st = {symbol: 'TK2'}
        let rateA = 0.50
        let rateB = 2.00
        const onSwitch = jest.fn(() => {
            ft = {symbol: 'TK2'}
            st = {symbol: 'TK1'}
            rateA = 2.00
            rateB = 0.50
        })

        const switchComponent = render(<SwitchBox onSwitch={onSwitch}
                                                  secondTokenSelected={ft}
                                                  firstTokenSelected={st}
                                                  exchangeRateA={rateA}
                                                  exchangeRateB={rateB}
                                                  active={true}/>)

        const dataBefore = await switchComponent.getByTestId('id_rate')
        expect(dataBefore).toHaveTextContent("1 TK1 ≈ 2 TK2");

        const button = await switchComponent.findByTestId('switch_button')
        fireEvent.click(button)

        //TODO in this part, I do an emulation of useState
        switchComponent.rerender(<SwitchBox onSwitch={onSwitch}
                                            secondTokenSelected={ft}
                                            firstTokenSelected={st}
                                            exchangeRateA={rateA}
                                            exchangeRateB={rateB}
                                            active={true}/>)

        const data = await switchComponent.getByTestId('id_rate')
        expect(data).toHaveTextContent("1 TK2 ≈ 0.5 TK1");
    })
})