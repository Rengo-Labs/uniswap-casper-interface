import React from 'react'
import styled from 'styled-components'
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import {lightTheme} from "../../../../contexts/ThemeContext/themes";


export const ButtonStyle = styled.button<any>`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    width: 80%;
    color: ${props => props.isActive ? props.theme.NewAquamarineColor : props.theme.NewPurpleColor};
    background-color: ${props => props.isActive ? props.theme.NewPurpleColor : props.theme.NewAquamarineColor};
    padding: 10px 0 0 0;
    border-radius: 10px;
    border:none;
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.theme.NewAquamarineColor};
        background-color: ${props => props.theme.NewPurpleColor};
    }
    &:disabled{
        cursor: not-allowed;
        background: #CCCCCC 0% 0% no-repeat padding-box;
        border-radius: 12px;
        color: #999999;
    }
`
export const LinearProgressButton = ({ content, handler, disabled = false, style = {} }: { content?: any, handler?: any, disabled?: boolean, style?: any }) => {
  const [progress, setProgress] = React.useState(0);
  const [isActive, setActive] = React.useState(false)

  const click = async () => {
    setActive(true)

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 70) {
          return 70;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 1000);

    try {
      await handler()
    } catch (e) {
      console.log("error ", e)
    } finally {
      clearInterval(timer);
      setProgress(100);
    }

    await new Promise(r => setTimeout(r, 1000))
    setActive(false)
    setProgress(0)
  }

  return (
    <ButtonStyle isActive={isActive} style={style} onClick={click} disabled={disabled}>
      {/* TODO: remove inline css*/}
      <div style={{flex: "1", display: "flex"}}><div style={{alignSelf: "center"}}>{content}</div></div>
      <Box sx={{display: isActive ? 'block' : 'inherit', width: '100%'}}>
        <LinearProgress sx={{
          '& .MuiLinearProgress-bar1Determinate': {
            backgroundColor: lightTheme.NewAquamarineColor,
          }
        }} style={{borderRadius: "0 0 10px 10px", height: "10px", backgroundColor: lightTheme.NewPurpleColor}} valueBuffer={100} variant="determinate" value={progress} />
      {/* TODO: remove inline css*/}
      </Box>
    </ButtonStyle>
  )
}
