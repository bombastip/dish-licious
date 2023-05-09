import { Dropdown, Navbar } from '@nextui-org/react';
import ChevronDownIcon from '../assets/ChevronDownIcon';
import React from 'react';

const SearchNavbarItem = () => {
    const [selected, setSelected] = React.useState(new Set(["text"]));

    const selectedValue = React.useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
      );
    
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
                <Dropdown.Item
                    key="recipes"
                    showFullDescription
                    description="Search for  your favourite recipes, right now!"
                    // icon={icons.scale}
                >
                    Search Recipe
                </Dropdown.Item>
                <Dropdown.Item
                    key="people"
                    showFullDescription
                    description="Find people who are using Dish-licious right now!"
                    // icon={icons.activity}
                >
                    Find People
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchNavbarItem;
