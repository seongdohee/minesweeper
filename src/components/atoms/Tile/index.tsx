import React, {ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren} from 'react';

import styles from './index.module.scss';
import clsx from 'clsx';

interface Props {
  size?: 28 | 32;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>)  => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Tile = ({ size = 28, disabled, onClick, onMouseDown, children }: PropsWithChildren<Props>) => {

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
  }

  return (
    <button
      disabled={disabled}
      className={clsx(styles.wrapper, styles[`size${size}`])}
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onContextMenu={handleContextMenu}
    >
      {children}
    </button>
  );
}

export default Tile