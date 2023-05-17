import { style } from '@vanilla-extract/css';

export const postCard = style({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
});

export const commentSendButton = style({
    background: 'transparent',
    border: 'none',
    padding: 0,
    // styles
    width: '24px',
    margin: '0 10px',
    flex: 'center',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'opacity 0.25s ease 0s, transform 0.25s ease 0s',
    ':only-child': {
        padding: '4px',
        transition: 'transform 0.25s ease 0s, opacity 200ms ease-in-out 50ms',
        boxShadow: '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
    },
    ':hover': {
        opacity: 0.8,
    },
    ':active': {
        transform: 'scale(0.9)',
        // ':only-child': {
        //     transform: 'translate(24px, -24px)',
        //     opacity: 0,
        // },
    },
});
