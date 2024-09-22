import clsx from 'clsx';
import styles from './index.module.scss';
import React, { useCallback } from 'react';
import { MineTileConfig } from 'src/types';

interface Props {
  row: number;
  col: number;
  config: MineTileConfig;
  onClick?: (row: number, col: number) => void;
  onRightClick?: (row: number, col: number) => void;
}

const Tile = ({ row, col, config, onClick, onRightClick }: Props) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event?.preventDefault();
  }

  const handleMouseDownTile = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event as any).which === 3 || event.button === 2) {
      onRightClick?.(row, col);
    } else {
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
      className={clsx(styles.tile, config.isRevealed && styles.isRevealed )}
      onMouseDown={handleMouseDownTile}
      onContextMenu={handleContextMenu}
    >
      {renderTile(config)}
    </div>
  );
}

export default Tile;