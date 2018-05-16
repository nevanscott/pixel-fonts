const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,?!\'";:';

const blankGrid = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];

const blankFont = charset.split('').map(char => {
  return {
    char,
    grid: blankGrid
  }
});

class Font {
  constructor(fontData) {
    this.chars = fontData.map(({ char, grid }) => {
      return new Letter(char, grid)
    })
    document.addEventListener('cellUpdate', () => {
      this.save();
    })
  }

  save() {
    localStorage.setItem('font', JSON.stringify(this.chars))
  }

  getChar(charCode) {
    return this.chars.find(({ char }) => char === charCode)
  }
}

class Letter {
  constructor(char, grid) {
    this.char = char;
    this.grid = grid || blankGrid;
  }
  setCell(x, y, value) {
    const cellUpdate = new Event('cellUpdate');
    this.grid[x][y] = value;
    document.dispatchEvent(cellUpdate);
  }
}

const renderChooser = (font, choose) => {
  const $chooser = document.createElement('div');
  $chooser.classList.add('chooser');
  font.chars.map(({ char }) => {
    const $char = document.createElement('div');
    $char.classList.add('char');
    $char.innerHTML = char;
    $char.addEventListener('click', (e) => {
      choose(char);
    })
    $chooser.appendChild($char);
  })
  return $chooser;
}

const renderCanvas = letter => {
  const $artboard = document.createElement('div');
  const $canvas = document.createElement('div');
  const $char = document.createElement('div');

  // Canvas
  letter.grid.map((row, i) => {
    const $row = document.createElement('div');
    $row.classList.add('row');
    row.map((cell, j) => {
      const $cell = document.createElement('div');
      if (cell === 1) {
        $cell.classList.add('cell--on');
      }
      $cell.classList.add('cell');
      $cell.addEventListener('click', (e) => {
        $cell.classList.toggle('cell--on');
        cell = (cell === 0) ? 1 : 0;
        letter.setCell(i, j, cell);
      })
      $row.appendChild($cell);
    })
    $canvas.appendChild($row);
  })

  // Character
  // $char.innerHTML = letter.char;
  // $char.classList.add('char');

  // Artboard
  $artboard.classList.add('artboard');
  $artboard.appendChild($canvas);
  // $artboard.appendChild($char);
  return $artboard;
}

const renderLetter = letter => {
  const $letter = document.createElement('div');
  $letter.classList.add('.letter');
  letter.grid.map((row, i) => {
    const $row = document.createElement('div');
    $row.classList.add('row');
    row.map((cell, j) => {
      const $cell = document.createElement('div');
      if (cell === 1) {
        $cell.classList.add('cell--on');
      }
      $cell.classList.add('cell');
      $row.appendChild($cell);
    })
    $letter.appendChild($row);
  })
  return $letter;
}

const renderSample = (sample, font) => {
  const $sample = document.createElement('div');
  $sample.classList.add('sample');
  sample.split('').map(char => {
    const $char = document.createElement('div');
    const charData = font.getChar(char);
    $char.classList.add('char');
    $char.innerHTML = char;
    if(charData) {
      $char.appendChild(renderLetter(charData));
    }
    $sample.appendChild($char);
  })
  return $sample;
}

const font = new Font(JSON.parse(localStorage.getItem('font')) || blankFont);
const letter = font.getChar('a');
const sampleText = 'The quick brown fox jumped over the lazy dog.'

const $chooser = document.querySelector('#chooser');
const $canvas = document.querySelector('#canvas');
const $sample = document.querySelector('#sample');

$chooser.appendChild(renderChooser(font, char => {
  const letter = font.getChar(char);
  $canvas.innerHTML = '';
  $canvas.appendChild(renderCanvas(letter));
}));
$canvas.appendChild(renderCanvas(letter));
$sample.appendChild(renderSample(sampleText, font));

document.addEventListener('cellUpdate', () => {
  $sample.innerHTML = '';
  $sample.appendChild(renderSample(sampleText, font));
})
