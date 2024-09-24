import { MineTileConfig } from 'src/types';
import Field from 'src/components/molecules/Field';
import { floodFill } from 'src/libs';
import styles from 'src/components/organisms/Board/index.module.scss';
import clsx from 'clsx';
import { cloneDeep } from 'src/utils';

interface Props {
  values: MineTileConfig[][];
  onChange: (values: MineTileConfig[][]) => void;
  readonly?: boolean;
}

const Board = ({ values, onChange, readonly = false }: Props) => {
  const handleClickTile = (row: number, col: number) => {
    const clickedTile = values[row][col];

    if (clickedTile.hasMine) {
      const newState = cloneDeep(values).map(row => {
        return row.map(col => {
          let isRevealed = col.isRevealed;

          if (col.hasMine && !col.hasFlag) {
            isRevealed = true;
          }

          if (col.hasFlag && !col.hasMine) {
            isRevealed = true;
          }

          return { ...col, isRevealed };
        });
      });
      onChange(newState);
      return;
    }

    onChange(floodFill(cloneDeep(values), row, col));
  };

  const handleRightClickTile = (row: number, col: number) => {
    const newState = cloneDeep(values);
    newState[row][col].hasFlag = !newState[row][col].hasFlag;
    onChange(newState);
  };

  const handleMouseDown = (row: number, col: number) => (event: React.MouseEvent<HTMLDivElement>) => {
    const tile = values[row][col];

    if (tile.isRevealed) {
      return;
    }

    if ((event as any).which === 3 || event.button === 2) {
      handleRightClickTile(row, col);
    } else {
      if (tile.hasFlag) {
        return;
      }
      handleClickTile?.(row, col);
    }
  };

  return (
    <div className={clsx(styles.wrapper, readonly && styles.readonly)}>
      {values.map((row, yIndex) => (
        <div
          key={`row-${yIndex}`}
          className={styles.row}
        >
          {row.map((tile, xIndex) => (
            <div
              key={`field-${yIndex}-${xIndex}`}
              onMouseDown={handleMouseDown(yIndex, xIndex)}
            >
              <Field
                row={yIndex}
                col={xIndex}
                {...tile}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;