import * as React from 'react';
// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    changeUserDataFetch,
    logoutFetch,
    Market,
    RootState,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    selectMarketSelectorState,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleMarketSelector,
    toggleSidebar,
} from '../../modules';
// import { IntlProps } from '../../index';

import styled from 'styled-components';
import { FaCog, FaStar, FaHistory, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// interface State {
//     isOpenDrop: boolean;
//   }

// interface OwnProps {
//   onLinkChange?: () => void;
//   history: History;
//   changeUserDataFetch: typeof changeUserDataFetch;
// }

interface ReduxProps {
    isLoggedIn: boolean;
    currentMarket: Market | undefined;
    user: User;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
}

interface DispatchProps {
    logoutFetch: typeof logoutFetch;
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
    toggleMarketSelector: typeof toggleMarketSelector;
    changeUserDataFetch: typeof changeUserDataFetch;
}

// interface HistoryProps {
//   history: History;
// }

// type Props = OwnProps & ReduxProps & HistoryProps & IntlProps & DispatchProps;

const Logo = require('../../assets/images/logo.svg');

const HeaderStyle = styled.div`
    padding-top: 25px;
    padding-bottom: 25px;
    background: rgb(49, 52, 69);
    color: white;
    .container-header {
        margin: 0 20px;
    }

    img {
        display: block;
        width: 140px;
        /* width: 90%; */
    }

    .header {
        &__left-menu {
            &__logo {
            }

            &__dropdown {
                &--mg-large {
                    margin-left: 25px;
                    margin-right: 25px;
                }
                margin-right: 20px;

                &__wrap {
                    position: relative;

                    display: inline-block;

                    &__dropbtn {
                        font-size: 14px;
                        color: white;
                        border: none;

                        &::before {
                            content: '';
                            position: absolute;
                            background-color: #fff;
                            opacity: 0;
                            height: 100px;
                            width: 100%;
                            z-index: 10;
                        }

                        &__svg {
                            svg {
                                color: white !important;
                                height: 32px;
                                width: 32px;
                            }
                        }
                    }

                    &__content {
                        margin-top: 33px;
                        display: none;
                        position: absolute;
                        background-color: rgb(41, 45, 63);

                        min-width: 280px;
                        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
                        z-index: 100;
                        a {
                            color: white;
                            padding: 20px 16px;
                            text-decoration: none;
                            display: block;
                            font-size: 14px;
                        }
                        Link {
                            color: white;
                            padding: 20px 16px;
                            text-decoration: none;
                            display: block;
                        }
                    }

                    &__content a:hover {
                        background-color: rgb(49, 52, 69);
                        color: rgb(47, 182, 126) !important;
                    }
                    &__content Link:hover {
                        background-color: rgb(49, 52, 69);
                        color: rgb(47, 182, 126) !important;
                    }

                    :hover .header__left-menu__dropdown__wrap__content {
                        display: block;
                    }
                    :hover .header__left-menu__dropdown__wrap__dropbtn {
                        color: rgb(47, 182, 126) !important;
                    }

                    :hover .icon-drop-down {
                        transform: rotate(0deg);
                    }
                }
            }
        }

        &__right-menu {
            &__dropdown {
                &--mg-large {
                    margin-left: 30px;
                    margin-right: 30px;
                }

                &__wrap {
                    position: relative;
                    margin-right: 20px;
                    display: inline-block;

                    &__dropbtn {
                        font-size: 14px;
                        color: white;
                        border: none;

                        &::before {
                            content: '';
                            position: absolute;
                            background-color: #fff;
                            opacity: 0;
                            height: 100px;
                            width: 100%;
                            z-index: 10;
                        }

                        &__svg {
                            svg {
                                color: white !important;
                                height: 32px;
                                width: 32px;
                            }
                        }
                    }

                    &__content {
                        &--account {
                            min-width: 180px;
                        }

                        &__title {
                            &__icon {
                                font-size: 20px;
                            }
                        }

                        margin-top: 33px;
                        display: none;
                        position: absolute;
                        background-color: rgb(41, 45, 63);

                        min-width: 250px;
                        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
                        z-index: 100;
                        a {
                            font-size: 14px;
                            color: white;
                            padding: 20px 16px;
                            text-decoration: none;
                            display: block;
                        }
                        Link {
                            color: white;
                            padding: 20px 16px;
                            text-decoration: none;
                            display: block;
                        }
                    }

                    &__content a:hover {
                        background-color: rgb(49, 52, 69);
                        color: rgb(47, 182, 126) !important;
                    }
                    &__content Link:hover {
                        background-color: rgb(49, 52, 69);
                        color: rgb(47, 182, 126) !important;
                    }

                    :hover .header__right-menu__dropdown__wrap__content {
                        display: block;
                    }
                    :hover .header__right-menu__dropdown__wrap__dropbtn {
                        color: rgb(47, 182, 126) !important;
                    }

                    :hover .icon-drop-down {
                        transform: rotate(0deg);
                    }
                }
            }

            &__item {
                &__title {
                    a {
                        color: white;
                        text-decoration: none;
                        outline: none;

                        :hover {
                            color: rgb(47, 182, 126);
                        }
                    }
                    Link {
                        color: white;
                        text-decoration: none;
                        outline: none;

                        :hover {
                            color: rgb(47, 182, 126);
                        }
                    }
                    font-size: 14px;
                    margin-right: 20px;

                    &--btn {
                        padding: 6px 16px;
                        border-radius: 5px;
                        background-color: rgb(47, 182, 126);
                        color: white;
                        :hover {
                            background-color: rgb(27, 226, 143);
                            color: white;
                        }
                    }

                    &__icon {
                        font-size: 20px;
                    }
                }
            }
        }
    }

    // custom tag $ icon
    .custom-tag-icon {
        box-sizing: border-box;
        margin: 0;
        max-width: 35px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        border-radius: 4px;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 17px;

        background-color: rgb(47, 182, 126);
        color: #212822;
        line-height: 16px;
        margin-left: 8px;
        font-size: 12px;
        transform: translateY(0px);
        position: relative;

        &::before {
            content: '';
            position: absolute;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 8px solid rgb(47, 182, 126);
            transform: rotate(-90deg) translateY(-12px);
            z-index: -10;
        }
    }

    // custom icon down
    .icon-drop-down {
        margin-left: 5px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid rgba(253, 253, 253, 0.788);
        transform: rotate(180deg);
        transition: all 0.4s;
    }

    /// responsive

    @media screen and (max-width: 1200px) {
        .header {
            &__left-menu {
                &__dropdown {
                    &--mg-large {
                        margin-left: 18px;
                        margin-right: 18px;
                    }
                    margin-right: 10px;
                }
            }

            &__right-menu {
                &__dropdown {
                    &__wrap {
                        margin-right: 10px;
                    }
                }
                &__item {
                    &__title {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
`;

export const Header: React.FC = () => {
    // const [isOpenDrop , setIsOpenDrop]  = useState(false);

    const props = useSelector(
        (state: RootState): ReduxProps => ({
            isLoggedIn: selectUserLoggedIn(state),
            currentMarket: selectCurrentMarket(state),
            user: selectUserInfo(state),
            mobileWallet: selectMobileWalletUi(state),
            sidebarOpened: selectSidebarState(state),
            marketSelectorOpened: selectMarketSelectorState(state),
        }),
    );

    const dispatch = useDispatch();
    const listFunction: DispatchProps = {
        logoutFetch: () => dispatch(logoutFetch()),
        changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
        toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
        toggleMarketSelector: () => dispatch(toggleMarketSelector()),
        setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    };

    const history = useHistory();
    const intl = useIntl();

    const renderWalletLink = () => {
        const { isLoggedIn } = props;

        return (
            isLoggedIn && (
                <div className="header__right-menu__item ">
                    <div className="header__right-menu__item__title">
                        <Link to="/wallets">Wallet</Link>
                    </div>
                </div>
            )
        );
    };

    const renderOrderTab = () => {
        const { isLoggedIn } = props;

        return (
            isLoggedIn && (
                <div className="header__right-menu__dropdown__wrap">
                    <a className="header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                        {translate('page.body.landing.header.orders')}
                        <div className="icon-drop-down"></div>
                    </a>
                    <div className="header__right-menu__dropdown__wrap__content">
                        <Link to="/orders">
                            <div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
                                <FaStar className="mr-2" />
                                {translate('page.body.landing.header.order')}
                            </div>
                        </Link>
                        <Link to="/history">
                            <div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
                                <FaHistory className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
                                {translate('page.body.landing.header.history')}
                            </div>
                        </Link>
                    </div>
                </div>
            )
        );
    };

    const renderLogout = () => {
        const { isLoggedIn } = props;

        if (!isLoggedIn) {
            return null;
        }
        return (
            <Link to=" " onClick={() => listFunction.logoutFetch()}>
                <div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
                    <FaSignOutAlt className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
                    <FormattedMessage id={'page.body.profile.content.action.logout'} />
                </div>
            </Link>
        );
    };

    const renderProfileLink = () => {
        const { isLoggedIn } = props;
        return (
            isLoggedIn && (
                <Link to="/profile">
                    <div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
                        <FaUserCircle className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </div>
                </Link>
            )
        );
    };

    const renderProfileTab = () => {
        const { isLoggedIn } = props;

        return (
            isLoggedIn && (
                <>
                    <div className="header__right-menu__dropdown__wrap">
                        <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                            {translate('page.body.landing.header.account')}
                            <div className="icon-drop-down"></div>
                        </a>
                        <div className="header__right-menu__dropdown__wrap__content header__right-menu__dropdown__wrap__content--account">
                            {renderProfileLink()}
                            {renderLogout()}
                        </div>
                    </div>

                    <div className="header__right-menu__item flex-shrink-0 d-none d-xl-block">
                        <div className="header__right-menu__item__title">
                            <a href="">Download</a>
                        </div>
                    </div>
                </>
            )
        );
    };

    const redirectSingIn = () => {
        history.push('/login');
    };

    const redirectSingUp = () => {
        history.push('/register');
    };

    const translate = (key: string) => intl.formatMessage({ id: key });

    const renderUnlogin = () => {
        const { isLoggedIn } = props;

        return (
            !isLoggedIn && (
                <>
                    <div className="header__right-menu__item flex-shrink-0" onClick={(e) => redirectSingIn()}>
                        <a className="header__right-menu__item__title">{translate('page.body.landing.header.button2')}</a>
                    </div>
                    <div className="header__right-menu__item flex-shrink-0" onClick={(e) => redirectSingUp()}>
                        <a className="header__right-menu__item__title header__right-menu__item__title--btn">
                            {translate('page.body.landing.header.button3')}
                        </a>
                    </div>
                    <div className="header__right-menu__item flex-shrink-0 d-none d-xl-block">
                        <div className="header__right-menu__item__title">
                            <a href="">Download</a>
                        </div>
                    </div>
                    <div className="header__right-menu__item  ">
                        <div className="header__right-menu__item__title d-none d-xl-block">
                            <a href="">English | USD</a>
                        </div>
                    </div>
                    <div className="header__right-menu__item ">
                        <div className="header__right-menu__item__title d-none d-xl-block">
                            <a href="">
                                <FaCog className="header__right-menu__item__title__icon" />
                            </a>
                        </div>
                    </div>
                </>
            )
        );
    };

    const renderHeaderDesktop = () => {
        return (
            <div className="container-header">
                <nav className="header d-flex flex-row justify-content-between align-items-center">
                    <div className="header__left-menu d-flex flex-row align-items-center">
                        <div className="header__left-menu__logo">
                            <a href="/">
                                <img src={Logo} alt="" />
                            </a>
                        </div>

                        <div className="header__left-menu__dropdown  header__left-menu__dropdown--mg-large flex-shrink-0">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    <div className="header__left-menu__dropdown__wrap__dropbtn__svg">
                                        <svg className="cin" viewBox="0 0 1024 1024">
                                            <path
                                                d="M599.381333 424.618667H424.618667v174.762666h174.762666V424.618667z m0-253.952H424.618667v174.293333h174.762666V170.666667z m0 508.373333H424.618667V853.333333h174.762666v-174.293333zM344.96 424.618667H170.666667v174.762666h174.293333V424.618667zM853.333333 170.666667h-174.293333v174.293333H853.333333V170.666667z m0 508.373333h-174.293333V853.333333H853.333333v-174.293333z m-508.373333 0H170.666667V853.333333h174.293333v-174.293333zM853.333333 424.618667h-174.293333v174.762666H853.333333V424.618667zM344.96 170.666667H170.666667v174.293333h174.293333V170.666667z"
                                                fill="#f8f8f8"
                                            ></path>
                                        </svg>
                                    </div>
                                </a>
                                <div className="header__left-menu__dropdown__wrap__content">
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="header__left-menu__dropdown  flex-shrink-0">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    Buy Crypto
                                    <div className="custom-tag-icon p-2 flex-grow-1">USD</div>
                                    <div className="icon-drop-down"></div>
                                </a>
                                <div className="header__left-menu__dropdown__wrap__content">
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="header__left-menu__dropdown flex-shrink-0">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    Market
                                    <div className="icon-drop-down"></div>
                                </a>
                                <div className="header__left-menu__dropdown__wrap__content">
                                    <Link to="/trading">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Market
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">
                                            Come to know about
                                        </div>
                                    </Link>
                                    <Link to="/markets">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Market list
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">
                                            the list market to buy every coin
                                        </div>
                                    </Link>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="header__left-menu__dropdown flex-shrink-0">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    Airdrop hub
                                    <div className="icon-drop-down"></div>
                                </a>

                                <div className="header__left-menu__dropdown__wrap__content">
                                    <Link to="/airdrop">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Airdrop Hub
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc......</div>
                                    </Link>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    Launchpad
                                    <div className="icon-drop-down"></div>
                                </a>

                                <div className="header__left-menu__dropdown__wrap__content">
                                    <Link to="/ieo">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Launchpad
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc .....</div>
                                    </Link>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="header__left-menu__dropdown flex-shrink-0 d-none d-xl-block">
                            <div className="header__left-menu__dropdown__wrap">
                                <a className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
                                    Trade Competition
                                    <div className="icon-drop-down"></div>
                                </a>

                                <div className="header__left-menu__dropdown__wrap__content">
                                    <Link to="/trading-competition">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Trade Competition
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </Link>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                    <a href="#">
                                        <div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
                                            <FaStar className="mr-2" />
                                            Link 1
                                        </div>
                                        <div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="header__right-menu d-flex align-items-center flex-row">
                        {renderUnlogin()}
                        {renderWalletLink()}
                        {renderOrderTab()}
                        {renderProfileTab()}
                    </div>
                </nav>
            </div>
        );
    };

    return (
        <>
            <HeaderStyle>{renderHeaderDesktop()}</HeaderStyle>
        </>
    );
};
