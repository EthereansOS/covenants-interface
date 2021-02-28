import PropTypes from 'prop-types';

const DappMenu = (props) => {
    const { className, currentTab, onClick, options } = props;

    return (
        <ul className={className}>
                {
                    options.map((option, i) => {
                        return (
                            <li key={option} className={`${currentTab === option.toLowerCase() ? 'nav-selected' : ''}`} onClick={() => onClick(option.toLowerCase())}>
                                <span>{option}</span>
                            </li>
                        )
                    })
                }
        </ul>
    )
}

DappMenu.propTypes = {
    className: PropTypes.string,
    currentTab: PropTypes.string,
    onClick: PropTypes.func,
    options: PropTypes.array,
}

export default DappMenu;