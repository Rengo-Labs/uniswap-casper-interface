import React from 'react';
import {
  HeroTitleDD,
  ContainerDD,
  HeroHeaderDD,
  HeroFooterDD,
  SquareButton,
  SquareGrayButton,
  HomeFooterDD,
} from '../../atoms';
import { GroupIconButtons } from '../../molecules';
import { Hero, GridNavbar, GridNavbarFooter } from '../../organisms';

import { ReactComponent as WordMarkIcon } from '../../../assets/newIcons/casperswap-wordmark.svg';
import { ReactComponent as CasperIcon } from '../../../assets/logo.svg';
import { ReactComponent as Twitter } from '../../../assets/newIcons/twitter.svg';
import { ReactComponent as Discord } from '../../../assets/newIcons/discord.svg';
import { ReactComponent as Telegram } from '../../../assets/newIcons/telegram.svg';
import { ReactComponent as Gitbook } from '../../../assets/newIcons/gitbook.svg';
import { ReactComponent as Medium } from '../../../assets/newIcons/medium.svg';
import { NewIcons, CasperIcons } from '../../../components/atoms';
import {TWITTER_URL, DISCORD_URL, TELEGRAM_URL, GITBOOK_URL, MEDIUM_URL } from "../../../constant";
import { useTheme } from 'styled-components';
import { LightThemeInterface } from '../../../contexts/ThemeContext/themes';

interface HomePropsInterface {
  title: any;
  url: any;
  content: any;
  isAnchor?: any;
  to?: any;
  insideMessage?: any;
  handler: any;
  heroImage: any;
}

export const HomeTemplate = ({
  title,
  url,
  content,
  isAnchor = false,
  to = '/',
  insideMessage = 'Analytics',
  handler,
  heroImage,
}: HomePropsInterface) => {
  const theme = useTheme() as LightThemeInterface;
  const listOfLinks: any[] = [];
  const showTVL = false;

  return (
    <ContainerDD>
      <GridNavbar>
        <a href='/'>
          <WordMarkIcon style={{ fill: theme.PrimaryColor }} />
        </a>
        <a href='/'>
          <CasperIcons Icon={CasperIcon} width={36} height={44} style={{ fill: theme.PrimaryColor }} />
        </a>
        <GroupIconButtons>
          <a
              href={GITBOOK_URL}
              target='_blank'
          >
            <NewIcons Icon={Gitbook} size={32} style={{ fill: theme.PrimaryColor }} />
          </a>
          <a
              href={MEDIUM_URL}
              target='_blank'
          >
            <NewIcons Icon={Medium} size={32} style={{ fill: theme.PrimaryColor }} />
          </a>
          <a
              href={TELEGRAM_URL}
              target='_blank'
          >
            <NewIcons Icon={Telegram} size={32} style={{ fill: theme.PrimaryColor }} />
          </a>
          <a
              href={DISCORD_URL}
              target='_blank'
          >
            <NewIcons Icon={Discord} size={32} style={{ fill: theme.PrimaryColor }} />
          </a>
          <a
            href={TWITTER_URL}
            target='_blank'
          >
            <NewIcons Icon={Twitter} size={32} style={{ fill: theme.PrimaryColor }} />
          </a>
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
          <SquareButton content={'Testnet Coming Soon'}  handler={() => console.log('Not implemented yet!')} />
        </HeroFooterDD>
      </Hero>
      <HomeFooterDD>
        <GridNavbarFooter>
          <a href='/'>
            <WordMarkIcon style={{ fill: theme.PrimaryColor }} />
          </a>
          <GroupIconButtons>
            <a
                href={GITBOOK_URL}
                target='_blank'
                style={{ display: 'grid', placeItems: 'center' }}
            >
              <NewIcons Icon={Gitbook} size={32} style={{ fill: theme.PrimaryColor }} />
            </a>
            <a
                href={MEDIUM_URL}
                target='_blank'
                style={{ display: 'grid', placeItems: 'center' }}
            >
              <NewIcons Icon={Medium} size={32} style={{ fill: theme.PrimaryColor }} />
            </a>
            <a
                href={TELEGRAM_URL}
                target='_blank'
                style={{ display: 'grid', placeItems: 'center' }}
            >
              <NewIcons Icon={Telegram} size={32} style={{ fill: theme.PrimaryColor }} />
            </a>
            <a
                href={DISCORD_URL}
                target='_blank'
                style={{ display: 'grid', placeItems: 'center' }}
            >
              <NewIcons Icon={Discord} size={32} style={{ fill: theme.PrimaryColor }} />
            </a>
            <a
                href={TWITTER_URL}
                target='_blank'
                style={{ display: 'grid', placeItems: 'center' }}
            >
              <NewIcons Icon={Twitter} size={32} style={{ fill: theme.PrimaryColor }} />
            </a>
          </GroupIconButtons>
        </GridNavbarFooter>
        {
          showTVL &&
            <>
              <SquareGrayButton
                  content={'$ 192.173.768'}
                  title={'TOTAL VALUE LOCKED'}
                  handler={handler}
              />
              <SquareGrayButton
                  content={'$ 50.870.295.291'}
                  title={'TOTAL TRADING VOLUME'}
                  handler={handler}
              />
            </>
        }
      </HomeFooterDD>
    </ContainerDD>
  );
};
