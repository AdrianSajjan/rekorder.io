import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../theme';
import { VideoPlayer } from './video-player';

const meta: Meta<typeof VideoPlayer> = {
  component: VideoPlayer,
  title: 'Components/Video Player',
};

type Story = StoryObj<typeof VideoPlayer>;

const styles = theme.createStyles({
  root: {
    width: '100%',
    maxWidth: theme.screens.md,
  },
});

export const MP4Player: Story = {
  render: (props) => <VideoPlayer src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4#t=1" style={styles.root} {...props} />,
};

MP4Player.storyName = 'MP4 Player';

export default meta;
