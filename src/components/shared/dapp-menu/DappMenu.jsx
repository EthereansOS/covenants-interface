import PropTypes from 'prop-types';

const DappMenu = (props) => {
    const { className, currentTab, onClick, options } = props;

    return (
        <div className={className}>
            <ul class="nav justify-content-center">
                {
                    options.map((option, i) => {
                        return (
                            <li key={option} class={`nav-item ${currentTab === option.toLowerCase() ? 'nav-item-selected' : ''}`} onClick={() => onClick(option.toLowerCase())}>
                                <span className="nav-link">{option}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

DappMenu.propTypes = {
    className: PropTypes.string,
    currentTab: PropTypes.string,
    onClick: PropTypes.func,
    options: PropTypes.array,
}

export default DappMenu;