function isSafe(grid, row, col, num, size) {
      for (let i = 0; i < size; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
      }
      const boxSize = size === 4 ? 2 : 3;
      const startRow = row - (row % boxSize);
      const startCol = col - (col % boxSize);
      for (let i = 0; i < boxSize; i++) {
        for (let j = 0; j < boxSize; j++) {
          if (grid[startRow + i][startCol + j] === num) return false;
        }
      }
      return true;
    }

    function solveSudoku(grid, size) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (grid[row][col] === 0) {
            for (let num = 1; num <= size; num++) {
              if (isSafe(grid, row, col, num, size)) {
                grid[row][col] = num;
                if (solveSudoku(grid, size)) return true;
                grid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    function generateFullGrid(size) {
      const grid = Array.from({ length: size }, () => Array(size).fill(0));
      solveSudoku(grid, size);
      return grid;
    }

    function removeCells(grid, hints) {
      const size = grid.length;
      const totalCells = size * size;
      const cellsToRemove = totalCells - hints;
      const removed = new Set();

      while (removed.size < cellsToRemove) {
        const idx = Math.floor(Math.random() * totalCells);
        const row = Math.floor(idx / size);
        const col = idx % size;
        if (grid[row][col] !== 0) {
          grid[row][col] = 0;
          removed.add(idx);
        }
      }
      return grid;
    }

    function generateSudoku() {
      const container = document.getElementById('sudoku-container');
      const difficulty = document.getElementById('difficulty').value;
      container.innerHTML = '';
      let size = difficulty === 'easy' ? 4 : 9;
      const hints = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 24 : 18;

      let board = generateFullGrid(size);
      board = removeCells(board, hints);

      const grid = document.createElement('div');
      grid.className = 'grid';

      let cellSize;
      if (size === 4) cellSize = '60px';
      else if (window.innerWidth < 480) cellSize = '28px';
      else cellSize = '42px';

      grid.style.gridTemplateColumns = `repeat(${size}, ${cellSize})`;

      for (let i = 0; i < size * size; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = size;
        input.dataset.index = i;
        input.style.width = cellSize;
        input.style.height = cellSize;

        const row = Math.floor(i / size);
        const col = i % size;
        const value = board[row][col];

        if (value !== 0) {
          input.value = value;
          input.disabled = true;
        } else {
          input.addEventListener('input', () => {
            const val = parseInt(input.value);
            if (val < 1 || val > size) {
              input.value = '';
              alert(`⚠️ Please enter a number between 1 and ${size}`);
            }
          });
        }

        if ((size === 9 && row % 3 === 0) || (size === 4 && row % 2 === 0)) input.classList.add('thick-border-top');
        if ((size === 9 && col % 3 === 0) || (size === 4 && col % 2 === 0)) input.classList.add('thick-border-left');

        grid.appendChild(input);
      }

      container.appendChild(grid);
    }

    function checkSolution() {
      const grid = document.querySelector('.grid');
      const size = grid.style.gridTemplateColumns.split(' ').length;
      const cells = grid.querySelectorAll('input');
      let boxSize = size === 9 ? 3 : 2;

      for (let i = 0; i < size; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < size; j++) {
          let rowVal = cells[i * size + j].value;
          let colVal = cells[j * size + i].value;
          if (rowVal === '' || colVal === '') return alert('🧹 You must complete your magical training first!');
          if (rowSet.has(rowVal) || colSet.has(colVal)) return alert('⚡ Something’s off, young wizard. Try again!');
          rowSet.add(rowVal);
          colSet.add(colVal);
        }
      }

      for (let r = 0; r < size; r += boxSize) {
        for (let c = 0; c < size; c += boxSize) {
          let boxSet = new Set();
          for (let i = 0; i < boxSize; i++) {
            for (let j = 0; j < boxSize; j++) {
              let val = cells[(r + i) * size + (c + j)].value;
              if (val === '') return alert('🧹 You must complete your magical training first!');
              if (boxSet.has(val)) return alert('🕯️ Mischief managed... not quite. Check again!');
              boxSet.add(val);
            }
          }
        }
      }

      const difficulty = document.getElementById('difficulty').value;
      const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;

      const params = new URLSearchParams({
        level: difficulty,
        points: `${points} points to Gryffindor!`
      });

      window.location.href = `formulario.html?${params.toString()}`;
    }

    window.onload = () => {
      document.getElementById('difficulty').value = 'easy';
      generateSudoku();
    }