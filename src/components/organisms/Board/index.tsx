import {MineTileConfig} from 'src/types';
import Field from 'src/components/molecules/Field';
import React from 'react';
import {floodFill} from 'src/libs';
import styles from 'src/components/organisms/Board/index.module.scss';
import clsx from 'clsx';

interface Props {
  values: MineTileConfig[][];
  onChange: (values: MineTileConfig[][]) => void;
  readonly?: boolean;
}

const Board = ({ values, onChange, readonly = false }: Props) => {
  const handleClickTile = (row: number, col: number) => {
    const clickedTile = values[row][col];

    if (clickedTile.hasMine) {
      const newState = values.map(row => {
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

    onChange(floodFill([...values], row, col));
  };

  const handleRightClickTile = (row: number, col: number) => {
    const newState = JSON.parse(JSON.stringify(values));
    newState[row][col] = { ...values[row][col], hasFlag: !values[row][col].hasFlag };
    onChange(newState);
  }

  return (
    <div className={clsx(styles.wrapper, readonly && styles.readonly)}>
      {values.map((row, yIndex) => (
        <div
          key={`row-${yIndex}`}
          className={styles.row}
        >
          {row.map((tile, xIndex) => (
            <Field
              key={`field-${yIndex}-${xIndex}`}
              row={yIndex}
              col={xIndex}
              config={tile}
              onClick={handleClickTile}
              onRightClick={handleRightClickTile}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;