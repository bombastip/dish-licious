import { Button, Dropdown } from '@nextui-org/react';
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

    const handleSearchGroups = () => {
        navigate('/search/groups');
    };

    return (
        <Dropdown>
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
                <Dropdown.Item key="recipes" textValue="search recipe">
                    <Button light onPress={handleSearchRecipes}>
                        Search Recipe
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item key="people" textValue="search people">
                    <Button light onPress={handleSearchPeople}>
                        Find People
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item key="groups" textValue="search groups">
                    <Button light onPress={handleSearchGroups}>
                        Find Groups
                    </Button>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchNavbarItem;
