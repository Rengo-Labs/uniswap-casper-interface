import React, {useState} from "react";
import {
    DropDownContainer,
    DropDownHeader,
    DropDownList,
    DropDownListContainer,
    ListItem
} from "./styles";

import {FiChevronDown} from "react-icons/fi";

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
            {/* TODO: remove inline css*/}
            <DropDownHeader onClick={toggling}>
                {/* TODO: remove inline css*/}
                <div style={{flex: "3", textAlign: "center"}}>{selectedOption || options[0]}</div>
                {/* TODO: remove inline css*/}
                <div style={{flex: "1", textAlign: "end", alignSelf: "center", display: "flex"}}><FiChevronDown /></div>
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
