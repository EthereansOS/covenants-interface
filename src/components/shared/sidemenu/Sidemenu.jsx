import { Link, useLocation } from 'react-router-dom';

const menu = [
    {
        name: 'Farm', path: '/farm', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'Inflation', path: '/inflation', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'USD', path: '/wusd', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'Bazaar', path: '/bazaar', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'Crafting', path: '/crafting', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'Grimoire', path: '/grimoire', asset: require('../../../assets/images/coin.svg').default,
    },
    {
        name: 'Covenants', path: '/more', asset: require('../../../assets/images/coin.svg').default,
    }
]

const Sidemenu = () => {
    const location = useLocation();
    console.log(location);

    return (
        <ul class="nav app-sidemenu flex-column">
        {
            menu.map(
                (menuItem, index) => (
                    <li className={`nav-link ${location.pathname.includes(menuItem.path) ? "sidebar-menu-link-selected" : ""}`} key={index}>
                        <img src={menuItem.asset} height={30} />
                        <Link className="sidebar-menu-link" to={menuItem.path}>{menuItem.name}</Link>
                    </li>
                )
            )
        }   
        </ul>
    )
}

export default Sidemenu;