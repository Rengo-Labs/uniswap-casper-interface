import React, {useState} from "react";
import {
    DropDownContainer,
    DropDownHeader,
    DropDownList,
    DropDownListContainer,
    ListItem
} from "./styles";
import {TiArrowSortedDown} from "react-icons/ti";

interface ItemProperties {
  options: string[];
}

export const ItemSelector: React.FC<ItemProperties> = ({options}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggling = () => setIsOpen(!isOpen);
    const [selectedOption, setSelectedOption] = useState(null);

    const onOptionClicked = value => () => {
        setSelectedOption(value);
        setIsOpen(false);
    };

    return (
        <DropDownContainer>
            <DropDownHeader style={{display: "flex", alignItems: "center", height: "5vh", paddingLeft: "0.4em"}} onClick={toggling}>
                <div style={{flex: "3", fontFamily: 'EpilogueLight', fontSize: "1em"}}>{selectedOption || options[0]}</div>
                <div style={{flex: "1", textAlign: "end", alignSelf: "center", display: "flex"}}><TiArrowSortedDown /></div>
            </DropDownHeader>
            {isOpen && (
                <DropDownListContainer>
                    <DropDownList>
                        {options.map(option => (
                            <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                                {option}
                            </ListItem>
                        ))}
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    );
}
