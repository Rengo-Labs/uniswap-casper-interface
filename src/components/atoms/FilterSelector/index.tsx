import React, {useState} from "react";
import {
    DropDownContainer,
    DropDownHeader,
    DropDownList,
    DropDownListContainer,
    ListItem
} from "./styles";
import {BsFilter} from "react-icons/bs";
import {Header} from "../../molecules/POCTHead";
import {TableInstance} from "react-table";

export const FilterSelector = ({
                               getTableProps,
                               headerGroups,
                               getTableBodyProps,
                               rows,
                               prepareRow,
                           }: TableInstance<any>) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggling = () => setIsOpen(!isOpen);

    return (
        <DropDownContainer>
            <DropDownHeader onClick={toggling}>
                <div style={{display: "flex", fontSize: "16px"}}><BsFilter /></div>
                <div style={{textAlign: "left"}}>Filter</div>
            </DropDownHeader>
            {isOpen && (
                <DropDownListContainer>
                    <DropDownList>
                        <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[0]} />
                        <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[1]} />
                        <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[2]} />
                        <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[3]} />
                        <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[4]} />
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    );
}
