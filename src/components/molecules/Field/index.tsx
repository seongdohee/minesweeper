import styles from 'src/components/molecules/Field/index.module.scss';
import { memo, useCallback, useState } from 'react';
import { MineTileConfig } from 'src/types';
import Tile from 'src/components/atoms/Tile';
import MineCount from 'src/components/atoms/MineCount';

interface Props extends MineTileConfig {
  row: number;
  col: number;
  onClick?: (row: number, col: number) => void;
  onRightClick?: (row: number, col: number) => void;
}

const Field = ({ row, col, onClick, onRightClick, ...config }: Props) => {
  const [isBoom, setIsBoom] = useState<boolean>(false);

  const handleMouseDownTile = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const renderTile = (tile: MineTileConfig) => {
    if (tile.isRevealed && tile.hasFlag && !tile.hasMine) {
      return '❌';
    }

    if (tile.hasFlag) {
      return '🚩';
    }

    if (!tile.isRevealed) {
      return "";
    }

    if (tile.hasMine) {
      return <span className={isBoom ? styles.boom : ''}>💣</span>;
    }

    if (tile.adjacentMines > 0) {
      return <MineCount count={tile.adjacentMines as any}/>;
    }
  };

  return (
    <Tile
      disabled={config.isRevealed}
      onMouseDown={handleMouseDownTile}
    >
      {renderTile(config)}
    </Tile>
  );
}

export default memo(Field);
