import { Container } from '@nextui-org/react';
import { useRef } from 'react';
import * as styles from './YoutubeFrame.css';

// thumbnailQuality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault'

interface YouTubeFrameProps {
    video: string;
    width?: string;
    height?: string;
}

export default function YouTubeFrame({ video, width, height }: YouTubeFrameProps) {
    const divRef = useRef(null);

    const thumbnailQuality = 'hqdefault';

    const onClick = () => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '1');
        iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        );
        iframe.style.width = width ? width : '560px';
        iframe.style.height = height ? height : '315px';
        iframe.setAttribute('src', `https://www.youtube.com/embed/${video}?rel=0&showinfo=1&autoplay=1`);
        if (divRef.current) {
            (divRef.current as HTMLElement).innerHTML = '';
            (divRef.current as HTMLElement).appendChild(iframe);
        }
    };

    return (
        <Container css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
            <div ref={divRef} className="relative">
                <img
                    onClick={onClick}
                    loading="lazy"
                    src={`https://img.youtube.com/vi/${video}/${thumbnailQuality}.jpg`}
                    alt="YouTube Video Thumbnail"
                    className={styles.thumbnail}
                />
            </div>
        </Container>
    );
}
