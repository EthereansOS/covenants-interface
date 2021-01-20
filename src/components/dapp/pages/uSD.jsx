import { useLocation, Link } from "react-router-dom";

const menu = [
    {
        name: 'Mint',
        path: '/dapp/usd'
    },
    {
        name: 'Burn',
        path: '/dapp/usd/burn'
    },
    {
        name: 'Farm',
        path: '/dapp/usd/farm'
    },
    {
        name: 'Stats',
        path: '/dapp/usd/stats'
    },
    {
        name: 'Arbitrate',
        path: '/dapp/usd/arbitrate'
    }
]


const USD = (props) => {
    const location = useLocation();

    return (
        <div className="main-container-section">
            <div className="main-container-section-content usd-section-content">
                <ul className="usd-menu">
                    {
                        menu.map((menuItem, i) => 
                            <Link key={menuItem.key} className="dapp-container-link" to={menuItem.path}>
                                <li className={`usd-menu-item ${location.pathname === menuItem.path ? 'usd-menu-item-selected' : ''}`}>{menuItem.name}</li>
                            </Link>
                        )
                    }
                </ul>
                <div className="usd-content">
                    Test
                </div>
            </div>
        </div>
    )
}

export default USD;