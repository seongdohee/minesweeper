import styles from './index.module.scss';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { floodFill, generateMineTile } from 'src/libs';
import {Level, LevelConfig, MineTileConfig} from 'src/types';
import clsx from 'clsx';
import Tile from 'src/components/atoms/Tile';

const levelsConfigs: LevelConfig[] = [
  { label: '초급', value: 'easy', rows: 9, cols: 9, mine: 10 },
  { label: '중급', value: 'normal', rows: 16, cols: 16, mine: 40 },
  { label: '고급', value: 'hard', rows: 30, cols: 16, mine: 99 },
]

const Home = () => {
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(levelsConfigs[0]);
  const [field, setField] = useState<MineTileConfig[][]>(generateMineTile(levelConfig.rows, levelConfig.cols, levelConfig.mine));
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const flagCount = useMemo(() => {
    let count = levelConfig.mine;
    field.forEach(row => {
      row.forEach(col => {
        if (col.hasFlag) {
          count--;
        }
      })
    });
    return count;
  }, [levelConfig, field]);

  useEffect(() => {
    const { rows, cols, mine } = levelConfig;
    const tile = rows * cols - mine;
    let revealedCount = 0;
    field.forEach(row => {
      row.forEach(col => {
        if (col.isRevealed) {
          revealedCount++;
        }
      });
    });

    if (tile === revealedCount) {

    }
  }, [levelConfig, field]);

  const handleClickTile = (row: number, col: number) => {
    const clickedTile = field[row][col];

    if (clickedTile.hasMine) {
      setTimeout(() => {
        setField(prevState => {
          return prevState.map(row => {
            return row.map(col => {
              return { ...col, isRevealed: true };
            });
          })
        });
      }, 500);
    }

    setIsDirty(true);
    setField(prevState => {
      return floodFill([...prevState], row, col);
    });
  };

  const handleRightClickTile = (row: number, col: number) => {
    setField(prevState => {
      const newState = [...prevState];
      newState[row][col].hasFlag = true;
      return newState;
    })
  }

  const handleChangeLevel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevel = event.target.value as Level;
    const config: LevelConfig = levelsConfigs.find(item => item.value === selectedLevel)!;

    if (isDirty) {
      if (!window.confirm(`${levelConfig.label}을 중단하고 ${config.label}으로 다시 시작하시겠어요?`)) {
        return;
      }
    }

    setIsDirty(false);
    setLevelConfig(config);
    setField(generateMineTile(config.rows, config.cols, config.mine));
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <select onChange={handleChangeLevel}>
          {levelsConfigs.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <div>
          <div>
            <span>🚩</span><span>{flagCount}</span>
          </div>
          <div>
            <span>⏲️</span><span>00:00:00</span>
          </div>
        </div>
      </header>
      <div>
        {field.map((row, yIndex) => (
          <div
            key={`row-${yIndex}`}
            className={styles.row}
          >
            {row.map((tile, xIndex) => (
              <Tile
                key={`tile-${xIndex}`}
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
    </div>
  )
};

export default Home;