import { Button, Dropdown, Navbar } from '@nextui-org/react';
import ChevronDownIcon from '../assets/ChevronDownIcon';
import { useNavigate } from 'react-router-dom';

const SearchNavbarItem = () => {
    const navigate = useNavigate();

    const handleSearchRecipes = () => {
        navigate('/search/recipes');
    };

    const handleSearchPeople = () => {
        navigate('/search/people');
    };

    return (
        <Dropdown>
            <Navbar.Item>
                <Dropdown.Button
                    auto
                    light
                    css={{
                        px: 0,
                        dflex: 'center',
                        svg: { pe: 'none' },
                        mw: '100%',
                    }}
                    iconRight={<ChevronDownIcon />}
                    ripple={false}
                >
                    Search
                </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
                aria-label="Search"
                css={{
                    $$dropdownMenuWidth: '340px',
                    $$dropdownItemHeight: '70px',
                    zIndex: '100',
                    '& .nextui-dropdown-item': {
                        py: '$4',
                        // dropdown item left icon
                        svg: {
                            color: '$secondary',
                            mr: '$4',
                        },
                        // dropdown item title
                        '& .nextui-dropdown-item-content': {
                            w: '100%',
                            fontWeight: '$semibold',
                        },
                    },
                }}
            >
                <Dropdown.Item key="recipes">
                    <Button light onPress={handleSearchRecipes}>
                        Search Recipe
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item key="people">
                    <Button light onPress={handleSearchPeople}>
                        Find People
                    </Button>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchNavbarItem;
