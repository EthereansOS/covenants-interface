import { Link, useLocation } from 'react-router-dom';

const menu = [
    {
        name: 'Farm', path: '/farm', asset: require('../../../assets/images/farm.png').default, hasDapp: false,
    },
    {
        name: 'Inflation', path: '/inflation', asset: require('../../../assets/images/cloud.png').default, hasDapp: false,
    },
    {
        name: 'WUSD', path: '/wusd', asset: require('../../../assets/images/wusd.png').default, hasDapp: true,
    },
    {
        name: 'Bazaar', path: '/bazaar', asset: require('../../../assets/images/bread.png').default, hasDapp: false,
    },
    {
        name: 'Crafting', path: '/crafting', asset: require('../../../assets/images/bottle.png').default, hasDapp: false,
    },
    {
        name: 'Grimoire', path: '/grimoire', asset: require('../../../assets/images/book.png').default, hasDapp: false,
    },
    {
        name: 'Covenants', path: '/more', asset: require('../../../assets/images/sword.png').default, hasDapp: false,
    }
]

const Sidemenu = () => {
    const location = useLocation();

    return (
        <ul className="nav app-sidemenu flex-column Menuone">
        {
            menu.map(
                (menuItem, index) => (
                    <li className={`fantasyMenuLi nav-link ${location.pathname.includes(menuItem.path) ? "sidebar-menu-link-selected" : ""}`} key={index}>
                        <img src={menuItem.asset} className="mr-2" height={32} />
                        <span className="Ditone"></span>
                        <Link className="sidebar-menu-link fantasyMenu" to={`${menuItem.path}${location.pathname.includes('dapp') && menuItem.hasDapp ? '/dapp' : ''}`}>{menuItem.name}</Link>
                    </li>
                )
            )
        }   
        </ul>
    )
}

export default Sidemenu;