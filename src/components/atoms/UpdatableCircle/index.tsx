import React, {useEffect} from 'react'
import {TrailCircular} from './styles'

export const UpdatableCircle = ({ strokeWidth, percentage, handler }) => {
    const [progress, setProgress] = React.useState(percentage)

    const radius = (50 - strokeWidth / 2);
    const pathDescription = `
        M 50,50 m 0,-${radius}
        a ${radius},${radius} 0 1 1 0,${2 * radius}
        a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

    const diameter = Math.PI * 2 * radius;

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 95) {
                    return 1;
                }
                return Math.min(oldProgress + 2, 100);
            });
        }, 1000);

        return () => {
            clearInterval(timer)
        }
    }, [])


    const click = async () => {

        try {
            await handler()
        } catch (e) {
            console.log("error ", e)
        } finally {
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
                percentage={progress}
            />
      </svg>
  );
}