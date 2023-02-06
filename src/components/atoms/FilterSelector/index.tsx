import React, {useContext, useEffect, useState} from "react";
import {
  ColumRight,
  DropDownContainer,
  DropDownHeader,
  DropDownList,
  DropDownListContainer
} from "./styles";
import {BsFilter} from "react-icons/bs";
import {Header} from "../../molecules/POCTHead";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {UpdatableCircle} from "../UpdatableCircle";

//FIXME: Avoid using any
export const FilterSelector = ({
                               getTableProps,
                               headerGroups,
                               getTableBodyProps,
                               rows,
                               prepareRow,
                           }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggling = () => setIsOpen(!isOpen);

    const {refreshAll, currentQuery} = useContext(ConfigProviderContext)
    const {progressBar} = useContext(ProgressBarProviderContext)

    useEffect(() => {
      progressBar(async () => {
        await refreshAll()
      })
    }, [currentQuery])

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
                        <ColumRight><UpdatableCircle strokeWidth={12} handler={async () => {await refreshAll()}} /></ColumRight>
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    );
}
