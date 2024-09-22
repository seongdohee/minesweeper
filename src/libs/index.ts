import { MineTileConfig } from 'src/types';

function generateMineTileArray(rows: number, cols: number, mine: number): MineTileConfig[][] {
  // x개의 내부 배열을 담는 루트 배열 생성
  let array = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({
    hasMine: false,
    hasFlag: false,
    isRevealed: false,
    adjacentMines: 0
  })));
  let placedMines = 0;
  // 랜덤한 위치에 z개의 true 값을 할당
  while (placedMines < mine) {
    const y = Math.floor(Math.random() * rows);
    const x = Math.floor(Math.random() * cols);

    // 지뢰가 없는 곳에만 배치
    if (!array[y][x].hasMine) {
      array[y][x].hasMine = true;
      placedMines++;
    }
  }

  return array;
}


function calculateAdjacentMines(arr: MineTileConfig[][]): MineTileConfig[][] {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  const rows = arr.length;
  const cols = arr[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (arr[i][j].hasMine) {
        continue;
      }
      let mineCount = 0;
      // 8방향 탐색
      directions.forEach(([dx, dy]) => {
        const newX = i + dx;
        const newY = j + dy;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && arr[newX][newY].hasMine) {
          mineCount++;
        }
      });
      arr[i][j].adjacentMines = mineCount; // 인접 지뢰 수 기록
    }
  }

  return arr;
}

export function generateMineTile(rows: number, cols: number, mine: number): MineTileConfig[][] {
  return calculateAdjacentMines(generateMineTileArray(rows, cols, mine));
}

export function floodFill(arr: MineTileConfig[][], x: number, y: number) {
  const rows = arr.length;
  const cols = arr[0].length;

  if (x < 0 || x >= rows || y < 0 || y >= cols || arr[x][y].isRevealed || arr[x][y].hasMine) {
    return arr;
  }

  // 셀을 열기
  arr[x][y].isRevealed = true;

  // 인접 지뢰가 없으면 재귀적으로 주변 셀 열기
  if (arr[x][y].adjacentMines === 0) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dx, dy]) => {
      floodFill(arr, x + dx, y + dy);
    });
  }

  return arr;
}