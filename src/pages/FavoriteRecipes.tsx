import { Favorites } from '../components';
import { Spacer, Text } from '@nextui-org/react';

const Profile = () => {
    return (
        <>
            <Spacer y={2} />
            <Text
                h1
                size={40}
                css={{
                    textGradient: '90deg, #fedb58, #fc924c',
                    marginLeft: '20px',
                }}
                weight="bold"
            >
                My Favorite Recipes
            </Text>
            <Spacer y={2} />
            <Favorites />
        </>
    );
};

export default Profile;
