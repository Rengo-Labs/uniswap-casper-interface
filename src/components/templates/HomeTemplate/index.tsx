import React, { FunctionComponent, ReactNode, SVGProps } from "react";
import {
    HeroTitleDD,
    ContainerDD,
    HeroHeaderDD,
    HeroFooterDD,
    SquareButton,
    SquareGrayButton,
    HomeFooterDD,
} from "../../atoms";
import { GroupIconButtons } from "../../molecules";
import { Hero, GridNavbar, GridNavbarFooter } from "../../organisms";

import { ReactComponent as WordMarkIcon } from "../../../assets/newIcons/casperswap-wordmark.svg";
import { ReactComponent as CasperIcon } from "../../../assets/logo.svg";
import { ReactComponent as Twitter } from "../../../assets/newIcons/twitter.svg";
import { ReactComponent as Discord } from "../../../assets/newIcons/discord.svg";
import { ReactComponent as Telegram } from "../../../assets/newIcons/telegram.svg";
import { ReactComponent as GitBook } from "../../../assets/newIcons/gitbook.svg";
import { ReactComponent as Medium } from "../../../assets/newIcons/medium.svg";
import { NewIcons, CasperIcons } from "../../../components/atoms";
import { TWITTER_URL, DISCORD_URL, TELEGRAM_URL, GITBOOK_URL, MEDIUM_URL } from "../../../constant";

interface HomePropsInterface {
    content: ReactNode;
    handler: () => void;
}

interface LinksInterface {
    to: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
}

const listOfLinks: Array<LinksInterface> = [
    { to: GITBOOK_URL, icon: GitBook },
    { to: MEDIUM_URL, icon: Medium },
    { to: TELEGRAM_URL, icon: Telegram },
    { to: DISCORD_URL, icon: Discord },
    { to: TWITTER_URL, icon: Twitter },
];

const IconLists = () => (
    <>
        {listOfLinks.map((link, i) => (
            <a key={i} href={link.to} target="_blank">
                <NewIcons Icon={link.icon} size={32} />
            </a>
        ))}
    </>
);

export const HomeTemplate = ({ content, handler }: HomePropsInterface) => {
    const showTVL = false;

    return (
        <ContainerDD>
            <GridNavbar>
                <a href="/">
                    <WordMarkIcon />
                </a>
                <a href="/">
                    <CasperIcons Icon={CasperIcon} width={36} height={44} />
                </a>
                <GroupIconButtons>
                    <IconLists />
                </GroupIconButtons>
            </GridNavbar>
            <Hero>
                <HeroHeaderDD>
                    <HeroTitleDD>
                        The most liquid trading and capital-efficient liquidity marketplace on Casper
                    </HeroTitleDD>
                </HeroHeaderDD>
                <HeroFooterDD>
                    <SquareButton content={content} handler={handler} />
                    {/* TODO: Implement onClick event handler */}
                    <SquareButton content={"Testnet Coming Soon"} handler={() => console.log("Not implemented yet!")} />
                </HeroFooterDD>
            </Hero>
            <HomeFooterDD>
                <GridNavbarFooter>
                    <a href="/">
                        <WordMarkIcon />
                    </a>
                    <GroupIconButtons>
                        <IconLists />
                    </GroupIconButtons>
                </GridNavbarFooter>
                {showTVL && (
                    <>
                        <SquareGrayButton content={"$ 192.173.768"} title={"TOTAL VALUE LOCKED"} handler={handler} />
                        <SquareGrayButton
                            content={"$ 50.870.295.291"}
                            title={"TOTAL TRADING VOLUME"}
                            handler={handler}
                        />
                    </>
                )}
            </HomeFooterDD>
        </ContainerDD>
    );
};
