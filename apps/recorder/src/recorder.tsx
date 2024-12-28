import { Button, Select, SelectContent, SelectInput, theme } from '@rekorder.io/ui';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import css from 'styled-jsx/css';

const stylesheet = css.resolve`
  .recorder {
    height: 100vh;
    width: 100vw;
    display: flex;
    gap: ${theme.space(4)};
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .record-button {
    width: 300px;
  }

  .select-input {
    width: 300px;
  }
`;

export function Recorder() {
  return (
    <Fragment>
      {stylesheet.styles}
      <div className={clsx(stylesheet.className, 'recorder')}>
        <Button className={clsx(stylesheet.className, 'record-button')}>Start Recording</Button>
        <Select>
          <SelectInput className={clsx(stylesheet.className, 'select-input')} placeholder="Select camera" />
          <SelectContent options={[{ label: 'Camera', value: 'camera' }]}></SelectContent>
        </Select>
      </div>
    </Fragment>
  );
}
