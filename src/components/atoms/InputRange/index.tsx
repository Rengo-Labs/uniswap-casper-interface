import React from 'react'
import {FuchsiaPerItem, PerItem, StyledInputRange, WrappedInputRange, WrappedPerLabel} from './styles'
import './styles.css'

interface InputRangeProps {
    handler: any,
    rangeList?: any[],
    initialValue?: number
}

export const InputRange = ({ handler, rangeList=[0, 25, 50, 75, 100], initialValue=0}: InputRangeProps) => {
    const [value, setValue] = React.useState(initialValue);

    const changeThumb = (e) => {
        const inputValue = parseFloat(e.target.value)
        handler(inputValue)
        setValue(inputValue)
    }

    return (
      <WrappedInputRange className={"wrap"}>
        <StyledInputRange type="range"
                          min={0}
                          max={100}
                          step={5}
                          onChange={changeThumb}
                          defaultValue={initialValue}
        />
          <WrappedPerLabel>
              {
                  rangeList?.map((i) => {
                      if (i === value) return <FuchsiaPerItem>{i}%</FuchsiaPerItem>
                      return <PerItem>{i}%</PerItem>
                  })
              }
          </WrappedPerLabel>
      </WrappedInputRange>
    )
}
