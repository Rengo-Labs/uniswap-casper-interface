import styled from "styled-components";

export const StyledSwitch = styled.label`
    display: flex;
    flex: 1;
    align-items: flex-start;
    gap: 4px;

    input {
        appearance: none;
        min-width: 48px;
        min-height: 22px;
        margin: 0;

        position: relative;
        background-color: ${props => props.theme.secondBackgroundColor};
        border-radius: 32px;

        cursor: pointer;
        user-select: none;
        transition: background-color 0.3s,
        border-color 0.3s;

        &:checked {
             background-color: ${props => props.theme.thirdBackgroundColor};

            &::before {
                 left: unset;
                 background-color: ${props => props.theme.secondBackgroundColor};
                 transform: translateX(calc(100% + 12px));
             }
        }

        &::before {
             content: '';
             position: absolute;
             height: 16px;
             width: 16px;
             top: 2px;
             left: 2px;
             bottom: 2px;
             background-color: ${props => props.theme.thirdBackgroundColor};
             transition: all 0.3s;
             border-radius: 50%;
             cursor: pointer;
             z-index: 1;
         }
    }

    &-labels {
         display: flex;
         flex-direction: column;
         gap: 4px;

        span {
            cursor: pointer;
            line-height: 1.4;
            font-size: 16px;
            user-select: none;
        }

        p {
            font-size: 12px;
            letter-spacing: 0.4px;
            line-height: 1.3;
            margin: 0;
            color: #555555;
        }
    }
`