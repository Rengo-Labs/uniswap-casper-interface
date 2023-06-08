import React from 'react'
import { FuchsiaPerItem, PerItem, StyledInputRange, WrappedInputRange, WrappedPerLabel } from './styles'
import './styles.css'
import { v4 as uuidv4 } from 'uuid';

interface InputRangeProps {
  handler: (v: number) => void,
  rangeList?: any[],
  initialValue?: number
}

export const InputRange = ({ handler, rangeList = [0, 25, 50, 75, 100], initialValue = 0 }: InputRangeProps) => {
  const [value, setValue] = React.useState(initialValue);

  const changeThumb = (e) => {
    const inputValue = parseFloat(e.target.value)
    handler(inputValue)
    setValue(inputValue)
  }

  return (
    <WrappedInputRange className={"wrap"}>
      <StyledInputRange data-testid="input_range" type="range"
        min={0}
        max={100}
        step={1}
        onChange={changeThumb}
        defaultValue={initialValue}
      />
      <WrappedPerLabel>
        {
          rangeList?.map((i) => {
            if (i === value) return <FuchsiaPerItem key={uuidv4()}>{i}%</FuchsiaPerItem>
            return <PerItem key={uuidv4()}>{i}%</PerItem>
          })
        }
      </WrappedPerLabel>
    </WrappedInputRange>
  )
}
