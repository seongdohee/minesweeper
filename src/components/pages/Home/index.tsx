import styles from './index.module.scss';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { generateMineTile } from 'src/libs';
import {GameStatus, Level, LevelConfig, MineTileConfig} from 'src/types';
import Tile from 'src/components/atoms/Tile';
import Status from 'src/components/atoms/Status';
import backgroundImage from 'src/assets/images/window_background.webp';
import Board from 'src/components/organisms/Board';
import Stopwatch, {StopwatchRef} from 'src/components/molecules/Stopwatch';
import {cloneDeep} from 'src/utils';

const levelConfigs: LevelConfig[] = [
  { label: '초급', value: 'easy', rows: 9, cols: 9, mine: 10 },
  { label: '중급', value: 'normal', rows: 16, cols: 16, mine: 40 },
  { label: '고급', value: 'hard', rows: 30, cols: 16, mine: 99 },
]

const Home = () => {
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(levelConfigs[0]);
  const [values, setValues] = useState<MineTileConfig[][]>(generateMineTile(
    levelConfig.rows,
    levelConfig.cols,
    levelConfig.mine
  ));
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [status, setStatus] = useState<GameStatus>('default');
  const stopwatchRef = useRef<StopwatchRef>();

  const flagCount = useMemo(() => {
    let count = levelConfig.mine;
    values.forEach(row => {
      row.forEach(col => {
        if (col.hasFlag) {
          count--;
        }
      })
    });

   return count;
  }, [levelConfig, values]);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      return;
    }

    const { rows, cols, mine } = levelConfig;
    const tile = rows * cols - mine;
    let revealedCount = 0;
    let flagCount = 0;

    // 지뢰를 선택하면 실패
    for(let i = 0; i < values.length; i++) {
      for(let j = 0; j < values[i].length; j++) {
        const tile = values[i][j];

        if (tile.hasMine && tile.isRevealed) {
          setStatus('failed');
          quit();
          return;
        }

        if (tile.hasFlag && tile.hasMine) {
          flagCount++;
        }

        if (tile.isRevealed) {
          revealedCount++;
        }
      }
    }

    // 지뢰를 제외한 타일을 모두 오픈하거나, 배치한 깃발이 모든 지뢰를 가리키면 성공
    if (tile === revealedCount || flagCount === levelConfig.mine) {
      setStatus('completed');
      setValues(prevState => {
        const newState = cloneDeep(prevState);
        return newState.map(row => {
          return row.map(col => ({ ...col, hasFlag: col.hasMine }));
        })
      })
      quit();
      return;
    }

  }, [levelConfig, values, status]);

  useEffect(() => {
    if (status === 'processing') {
      setTimeout(() => {
        setStatus('default');
      }, 100);
    }
  }, [status]);

  useEffect(() => {
    initial();
  }, [levelConfig]);

  const initial = () => {
    setIsDirty(false);
    setStatus('default');
    setValues(generateMineTile(levelConfig.rows, levelConfig.cols, levelConfig.mine));
    stopwatchRef.current?.reset();
  }

  const quit = () => {
    setIsDirty(false);
    stopwatchRef.current?.stop();
  }

  const handleClickReset = () => {
    if (isDirty) {
      if (!window.confirm(`${levelConfig.label} 게임을 다시 시작하시겠어요?`)) {
        return;
      }
    }

    initial();
  }

  const handleChangeValues = (values: MineTileConfig[][]) => {
    stopwatchRef.current?.start();
    setStatus('processing');
    setIsDirty(true);
    setValues(values);
  }

  const handleChangeLevel = (value: Level) => () => {
    const config: LevelConfig = levelConfigs.find(item => item.value === value)!;

    if (isDirty) {
      if (!window.confirm(`${levelConfig.label}을 중단하고 ${config.label}으로 다시 시작하시겠어요?`)) {
        return;
      }
    }

    setLevelConfig(config);
  }

  return (
    <main className={styles.root} style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          💣 Minesweeper
        </header>
        <div className={styles.tools}>
          {levelConfigs.map(item => (
            <button
              key={item.value}
              className={styles.level}
              onClick={handleChangeLevel(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.content}>
          <div className={styles.status}>
            <Status value={flagCount}/>
            <Tile size={32} onClick={handleClickReset}>
              {status === 'default' && '🙂'}
              {status === 'processing' && '😆'}
              {status === 'completed' && '😎'}
              {status === 'failed' && '😵'}
            </Tile>
            <Stopwatch ref={stopwatchRef}/>
          </div>
          <Board
            values={values}
            onChange={handleChangeValues}
            readonly={status === 'completed' || status === 'failed'}
          />
        </div>

      </div>
    </main>
  )
};

export default Home;