import { Link, useLocation } from 'react-router-dom';

const menu = [
    {
        name: 'Farm', path: '/farm', asset: require('../../../assets/images/farm.png').default,
    },
    {
        name: 'Inflation', path: '/inflation', asset: require('../../../assets/images/cloud.png').default,
    },
    {
        name: 'WUSD', path: '/wusd', asset: require('../../../assets/images/wusd.png').default,
    },
    {
        name: 'Bazaar', path: '/bazaar', asset: require('../../../assets/images/bread.png').default,
    },
    {
        name: 'Crafting', path: '/crafting', asset: require('../../../assets/images/bottle.png').default,
    },
    {
        name: 'Grimoire', path: '/grimoire', asset: require('../../../assets/images/book.png').default,
    },
    {
        name: 'Covenants', path: '/more', asset: require('../../../assets/images/sword.png').default,
    }
]

const Sidemenu = () => {
    const location = useLocation();

    return (
        <ul className="nav app-sidemenu flex-column">
        {
            menu.map(
                (menuItem, index) => (
                    <li className={`nav-link ${location.pathname.includes(menuItem.path) ? "sidebar-menu-link-selected fantasyMenuLi" : ""}`} key={index}>
                        <img src={menuItem.asset} className="mr-2" height={32} />
                        <img className="Ditone" src="../../../assets/images/indicator.png"></img>
                        <Link className="sidebar-menu-link fantasyMenu" to={menuItem.path}>{menuItem.name}</Link>
                    </li>
                )
            )
        }   
        </ul>
    )
}

export default Sidemenu;