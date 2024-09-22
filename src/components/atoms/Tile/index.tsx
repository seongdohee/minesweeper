import clsx from 'clsx';
import styles from './index.module.scss';
import React, {useCallback, useState} from 'react';
import { MineTileConfig } from 'src/types';

const colors = ['blue', 'green', 'red', 'navy', 'brown', 'lightseagreen', 'purple', 'black', 'black'];

interface Props {
  row: number;
  col: number;
  config: MineTileConfig;
  onClick?: (row: number, col: number) => void;
  onRightClick?: (row: number, col: number) => void;
  isWeak?: boolean;
}

const Tile = ({ row, col, config, onClick, onRightClick, isWeak }: Props) => {
  const [isBoom, setIsBoom] = useState<boolean>(false);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event?.preventDefault();
  }

  const handleMouseDownTile = (event: React.MouseEvent<HTMLDivElement>) => {
    if (config.isRevealed) {
      return;
    }

    if ((event as any).which === 3 || event.button === 2) {
      onRightClick?.(row, col);
    } else {
      if (config.hasFlag) {
        return;
      }
      if (config.hasMine) {
        setIsBoom(true);
      }
      onClick?.(row, col);
    }
  }

  const renderTile = useCallback((tile: MineTileConfig) => {
    if (tile.hasFlag) {
      return '🚩';
    }

    if (!tile.isRevealed) {
      return;
    }

    if (tile.hasMine) {
      return '💣';
    }

    if (tile.adjacentMines > 0) {
      return tile.adjacentMines;
    }
  }, [config]);

  return (
    <div
      className={clsx(
        styles.tile,
        config.isRevealed && styles.isRevealed,
        isWeak && styles.isWeak,
        isBoom && styles.danger
      )}
      onMouseDown={handleMouseDownTile}
      onContextMenu={handleContextMenu}
      style={{ color: colors[config.adjacentMines - 1]}}
    >
      <span className={isBoom ? styles.boom : ''}>
        {renderTile(config)}
      </span>
    </div>
  );
}

export default Tile;