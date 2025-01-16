const createGame = () => {
  let container = document.querySelector('main');

  let sidePlayer = document.createElement('div'),
    potPlayer = document.createElement('div'),
    sideOpponent = document.createElement('div'), 
    potOpponent = document.createElement('div');
  
  for(let i=1; i<15; i++){
    let el = document.createElement('input');
    el.setAttribute('data-id', i);
    el.setAttribute('type', 'number');
    if(i==7 || i==14){
      if(i==7){
        el.className = 'pot player';
        potPlayer.appendChild(el);
      }else{
        el.className = 'pot opponent';
        potOpponent.appendChild(el);
      }
    }else{
      el.className = 'hole';
      if (i<7) {
        sidePlayer.appendChild(el);
      } else sideOpponent.appendChild(el);
    }
  }
  
  [sidePlayer, potPlayer, sideOpponent, potOpponent].forEach(item => {
    container.appendChild(item);
  });
}

createGame();

const parseIntRemix = (val) => {
  return isNaN(parseInt(val)) ?  0 : parseInt(val);
}

var safe = [], memory = [];

const checkGame = (type=null) =>{
  let render = document.querySelector('.render');
  render.innerHTML = '';

  if(!validatePots()) return; // && !type
  patchMemory();
  for (let i=1; i<7; i++) {
    fetchMemory();
    let h = 0, j = i, nextValue = 0;
    let oldPot = parseIntRemix(document.querySelector(`input[data-id="${7}"]`).value);
    document.querySelector(`input[data-id="${7}"]`).value = oldPot;
    do {
      let selectedHole = document.querySelector(`input.hole[data-id="${j}"]`);
      let selectedValue = parseIntRemix(selectedHole.value);
      h = selectedValue;
      if(selectedValue && selectedValue > 0){
        selectedHole.value = 0;
        while(h > 0){
          j++;
          h--;
          if(j > 13) j = 1;
          let next = document.querySelector(`input[data-id="${j}"]`);
          nextValue = parseIntRemix(next.value) + 1;
          next.value = nextValue;
        }
      }
    } while (nextValue > 1 && !(j == 7 || j == 14) );

    let innerSafe = [];
    for(let k=0; k<14; k++){
      innerSafe[k] = parseIntRemix(document.querySelector(`input[data-id="${k+1}"]`).value);
    }
    if(j == 7 || j == 14){
      innerSafe[14] = true;
    }else{
      innerSafe[14] = false;
    }
    safe[i-1] = innerSafe;

    let btn = document.createElement('button');
    btn.setAttribute('onclick', `render(this, ${i-1})`);
    btn.innerText = `Hole ${i}`;
    if(i == 6){
      btn.className = 'active';
    }
    render.appendChild(btn);
  }

  let submit = document.querySelector('.submit');
  if(safe[5][14]){
    submit.disabled = false;
    submit.innerText = 'Continue';
    submit.setAttribute('onclick', 'checkGame("continue")');
  }else{
    submit.disabled = true;
    submit.innerText = 'Retry';
    submit.setAttribute('onclick', 'retry()');
  }
}

const retry = () => {
  fetchMemory();
  checkGame();
}

const restart = () => {
  for(let i=1; i<15; i++){
    let selectedValue = document.querySelector(`input[data-id="${i}"]`);
    selectedValue.value = "";
  }
  safe = [], memory = [];
  document.querySelector('.render').innerHTML = '';
}

const render = (btn, index) => {
  document.querySelectorAll('.render button').forEach(btn => { btn.className = ''; })
  btn.classList.add('active');
  let innerSafe = safe[index];
  for(let i=0; i<14; i++){
    let selectedValue = document.querySelector(`input[data-id="${i+1}"]`);
    selectedValue.value = innerSafe[i];
  }
  let submit = document.querySelector('.submit');
  if(innerSafe[14]){
    submit.disabled = false;
    submit.innerText = 'Continue';
    submit.setAttribute('onclick', 'checkGame("continue")');
  }else{
    submit.disabled = true;
    submit.innerText = 'Retry';
    submit.setAttribute('onclick', 'retry()');
  }
}

const validatePots = () => {
  for(let i=1; i<14; i++){
    let selectedValue = document.querySelector(`input[data-id="${i}"]`).value;
    if(!(/[0-9]{1,2}/.test(selectedValue))) return false;
  }
  return true; 
}

const patchMemory = () => {
  for(let i=0; i<14; i++){
    let selectedValue = document.querySelector(`input[data-id="${i+1}"]`);
    memory[i] = parseIntRemix(selectedValue.value);
  }
}

const fetchMemory = () => {
  for(let i=0; i<14; i++){
    let selectedValue = document.querySelector(`input[data-id="${i+1}"]`);
    selectedValue.value = memory[i];
  }
}

