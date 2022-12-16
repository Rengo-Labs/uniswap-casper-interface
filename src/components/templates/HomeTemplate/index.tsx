import React, { useContext } from 'react';
import {
  HeroTitleDD,
  HighlightDD,
  HeroSubtitleDD,
  ContainerDD,
  HeroHeaderDD,
  HeroFooterDD,
  CircularButton,
  SquareButton,
  SquareGrayButton,
  HomeFooterDD,
} from '../../atoms';
import { ActionsBar, GroupIconButtons } from '../../molecules';
import { Hero, GridNavbar } from '../../organisms';

import { ReactComponent as WordMarkIcon } from '../../../assets/newIcons/casperswap-wordmark.svg';
import { ReactComponent as CasperIcon } from '../../../assets/logo.svg';
import { ReactComponent as Twitter } from '../../../assets/newIcons/twitter.svg';
import { ReactComponent as Discord } from '../../../assets/newIcons/discord.svg';
import { ReactComponent as Telegram } from '../../../assets/newIcons/telegram.svg';
import { ReactComponent as Gitbook } from '../../../assets/newIcons/gitbook.svg';
import { NewIcons } from '../../../components/atoms';
import {TWITTER_URL, DISCORD_URL, TELEGRAM_URL, GITBOOK_URL } from "../../../constant";

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
  const listOfLinks: any[] = [];
  const showTVL = false;

  return (
    <ContainerDD>
      <GridNavbar>
        <a
          href='/'
          style={{
            display: 'grid',
            justifyItems: 'start',
            alignItems: 'center',
          }}
        >
          <WordMarkIcon style={{ fill: '#FFF' }} />
        </a>
        <a href='/' style={{ display: 'grid', placeItems: 'center' }}>
          <NewIcons Icon={CasperIcon} size={64} style={{ fill: '#FFF' }} />
        </a>
        <GroupIconButtons>
          <a
            href={TWITTER_URL}
            target='_blank'
            style={{ display: 'grid', placeItems: 'center' }}
          >
            <NewIcons Icon={Twitter} size={32} style={{ fill: '#FFF' }} />
          </a>
          <a
              href={DISCORD_URL}
              target='_blank'
              style={{ display: 'grid', placeItems: 'center' }}
          >
            <NewIcons Icon={Discord} size={32} style={{ fill: '#FFF' }} />
          </a>
          <a
            href={TELEGRAM_URL}
            target='_blank'
            style={{ display: 'grid', placeItems: 'center' }}
          >
            <NewIcons Icon={Telegram} size={32} style={{ fill: '#FFF' }} />
          </a>
          <a
              href={GITBOOK_URL}
              target='_blank'
              style={{ display: 'grid', placeItems: 'center' }}
          >
            <NewIcons Icon={Gitbook} size={32} style={{ fill: '#FFF' }} />
          </a>
        </GroupIconButtons>

        <ActionsBar>
          <></>
        </ActionsBar>
      </GridNavbar>
      <Hero>
        <HeroHeaderDD>
          <HeroTitleDD>
            Casper<HighlightDD>Swap</HighlightDD>
          </HeroTitleDD>
          <HeroSubtitleDD>
            The most liquid trading and capital-efficient liquidity marketplace on Casper.
          </HeroSubtitleDD>
        </HeroHeaderDD>
        <HeroFooterDD>
          <SquareButton content={content} handler={handler} />
          <CircularButton content={'Read Document'} handler={handler} />
        </HeroFooterDD>
      </Hero>
      <HomeFooterDD>
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
