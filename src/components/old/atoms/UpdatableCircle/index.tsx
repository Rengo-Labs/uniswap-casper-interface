import React, { useContext } from 'react'
import { TrailCircular } from './styles'
import { ProgressBarProviderContext } from "../../../../contexts/ProgressBarContext";

export const UpdatableCircle = ({ strokeWidth, handler }) => {
  const { getProgress, clearProgress } = useContext(ProgressBarProviderContext)

  const radius = (50 - strokeWidth / 2);
  const pathDescription = `
        M 50,50 m 0,-${radius}
        a ${radius},${radius} 0 1 1 0,${2 * radius}
        a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const diameter = Math.PI * 2 * radius;

  const click = async () => {

    try {
      clearProgress()
      await handler()
    } catch (e) {
      console.log("error ", e)
    }
  }

  return (
    <div style={{ cursor: 'pointer' }}>
      <svg
        className={'CircularProgressbar'}
        viewBox="0 0 100 100"
        width={26}
        height={26}
        style={{display: "flex"}}
        onClick={click}
      >
        <TrailCircular
          className="CircularProgressbar-trail"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          diameter={diameter}
          percentage={100}
          isPrincipal={false}
          style={{strokeDasharray: `${diameter}px ${diameter}px`,
            strokeDashoffset: `${((100 - 100) / 100 * diameter)}px`}}
        />

        <TrailCircular
          className="CircularProgressbar-path"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          isPrincipal={true}
          diameter={diameter}
          percentage={getProgress}
          style={{strokeDasharray: `${diameter}px ${diameter}px`,
            strokeDashoffset: `${((100 - getProgress) / 100 * diameter)}px`}}
        />
      </svg>
    </div>
  );
}
