import React, {useContext, useEffect} from 'react'
import {TrailCircular} from './styles'
import {ConfigProviderContext} from "../../../contexts/ConfigContext";

export const UpdatableCircle = ({ strokeWidth, handler }) => {
    const {getProgress, setProgress, clearProgress} = useContext(ConfigProviderContext)

    const radius = (50 - strokeWidth / 2);
    const pathDescription = `
        M 50,50 m 0,-${radius}
        a ${radius},${radius} 0 1 1 0,${2 * radius}
        a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

    const diameter = Math.PI * 2 * radius;

    const click = async () => {

        try {
            await handler()
            clearProgress()
        } catch (e) {
            console.log("error ", e)
        }

        setProgress(1)
    }

    return (
        <svg
            className={'CircularProgressbar'}
            viewBox="0 0 100 100"
            width={26}
            height={26}
            onClick={click}
        >
            <TrailCircular
                className="CircularProgressbar-trail"
                d={pathDescription}
                strokeWidth={strokeWidth}
                fillOpacity={0}

                isPrincipal={false}
            />

            <TrailCircular
                className="CircularProgressbar-path"
                d={pathDescription}
                strokeWidth={strokeWidth}
                fillOpacity={0}

                isPrincipal={true}
                diameter={diameter}
                percentage={getProgress}
            />
      </svg>
  );
}