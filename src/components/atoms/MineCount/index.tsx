const colors = ['blue', 'green', 'red', 'navy', 'brown', 'lightseagreen', 'purple', 'black', 'black'];

interface Props {
  count: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

const MineCount = ({ count }: Props) => {
  return (
    <span style={{ color: colors[count] }}>
      {count}
    </span>
  );
}

export default MineCount;