import { style } from '@vanilla-extract/css';

export const postCard = style({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // transition: 'all 0.5s ease-in-out',
});

export const postCardExpanded = style({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100vw',
});

export const postCardContainer = style({
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    justifyContent: 'center',
    // transform: 'translateX(400px)',
    // transition: 'transform 0.5s ease-in-out',
});
