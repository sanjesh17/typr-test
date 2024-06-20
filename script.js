const words = "eat happy smile summer sunshine picnic family friends fun time laugh play relax breeze tree shade park blanket basket sandwich chips cookie soda ice cake ice cream chocolate candy sprinkles frosting birthday party gift present surprise celebrate balloons streamers decorations candles wish sing song music dance move groove beat rhythm clap stomp shout cheer joy delight excitement energy bounce hop skip jump run chase tag game win lose score team goal play coach practice learn skill improve grow strong fast quick agile balance stretch flex bend lift carry hold push pull throw catch kick pass hit bat swing glove helmet uniform shoes socks shorts shirt hat visor sunglasses sunscreen protect safe warm cold hot cool breeze wind rain storm cloud sky blue green yellow red pink purple orange bright light dark night day morning noon afternoon evening twilight dawn dusk moon stars shine sparkle glow twinkle glitter shimmer shine bright light lamp glow bulb switch plug outlet cord wire electricity power charge battery phone tablet computer screen keyboard mouse pad desk chair table lamp book pen pencil paper notebook journal diary write draw sketch doodle scribble note list plan organize arrange neat tidy clean clear clutter mess sort fix repair build create design craft art paint brush color sketch tool project idea vision goal dream hope wish wonder imagine think ponder reflect consider decide choose select prefer want need have give take share borrow lend return keep hold save spend buy sell trade barter exchange earn pay tip fee cost price value worth invest gain profit grow wealth rich poor money coin dollar bill cash credit debit bank account wallet purse pocket bag backpack suitcase travel trip journey adventure explore discover visit tour guide map direction compass navigate route path trail road street avenue boulevard lane drive circle square park lot space garage open close enter exit stop go wait move stand sit rest sleep wake rise shine shower bath clean wash dry brush comb style hair dress wear clothes outfit shoes boots sandals flip flops sneakers".split(' ');
wordsCount = words.length;
gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el,name) {
    el.className += ' '+name;
}

function removeClass(el,name) {
    el.className = el.className.replace(name,'');
}

function randomWord() {
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex - 1];
}

function sepWords(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame(){
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += sepWords(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';
    window.timer = null;
}

function getWpm(){
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord);
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const redLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const whiteLetters = letters.filter(letter => letter.className.includes('correct'))
    return redLetters.length === 0 && whiteLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}

const gameEnd = document.getElementById('popup');
const afterMath = document.getElementById('window-game');
const resultMessage = document.getElementById('message');

function resultAns(){
  if (getWpm()<=30){
    resultMessage.innerHTML = "You are still learning.."
  }
  if (getWpm()>30 && getWpm()<=60){
    resultMessage.innerHTML = "Damn, That's pretty decent!"
  }
  if (getWpm()>60 && getWpm()<=100){
    resultMessage.innerHTML = "You are a Cheetah!"
  }
  if (getWpm()>100 && getWpm()<=160){
    resultMessage.innerHTML = "You are the G.O.A.T!"
  }
  if (getWpm()>160) {
    resultMessage.innerHTML = "You don't belong in this Universe!"
  }
}

const jsConfetti = new JSConfetti();

function finalMessage(){
  resultAns();
  document.getElementById('test-result').innerHTML = String(getWpm());
  gameEnd.classList.add("open-popup");
  afterMath.classList.add("window-game-end");
  jsConfetti.addConfetti({
    confettiRadius: 9,
    confettiNumber: 1000,
  })
}

function gameOver(){
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  document.getElementById('info').innerHTML = "0";
  finalMessage();
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    if (document.querySelector('#game.over')) {
      return;
    }

    console.log({key,expected})

    if (!window.timer && isLetter) {
      window.timer = setInterval( () => {
        if (!window.gameStart) {
          window.gameStart = (new Date()).getTime();
        }
        const currentTime = (new Date()).getTime();
        const msPassed = currentTime - window.gameStart;
        const sPassed = Math.round(msPassed / 1000);
        const sLeft = (gameTime / 1000) - sPassed;
        if (sLeft === 0){
          gameOver();
          return;
        }
        document.getElementById('info').innerHTML = sLeft + ""
      }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
          addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
          removeClass(currentLetter, 'current');
          if (currentLetter.nextSibling) {
            addClass(currentLetter.nextSibling, 'current');
          }
        } else {
          const incorrectLetter = document.createElement('span');
          incorrectLetter.innerHTML = key;
          incorrectLetter.className = 'letter incorrect extra';
          currentWord.appendChild(incorrectLetter);
        }
      }
    
      if (isSpace) {
        if (expected !== ' ') {
          const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
          lettersToInvalidate.forEach(letter => {
            addClass(letter, 'incorrect');
          });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        
        if (currentLetter) {
          removeClass(currentLetter, 'current');
        }
        
        addClass(currentWord.nextSibling.firstChild, 'current');
      }

      if (isBackspace) {
        if (currentLetter && isFirstLetter) {
          removeClass(currentWord, 'current');
          addClass(currentWord.previousSibling, 'current');
          removeClass(currentLetter, 'current');
          addClass(currentWord.previousSibling.lastChild, 'current');
          removeClass(currentWord.previousSibling.lastChild, 'incorrect')
          removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter) {
          removeClass(currentLetter, 'current');
          addClass(currentLetter.previousSibling, 'current');
          removeClass(currentLetter.previousSibling, 'incorrect');
          removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
          addClass(currentWord.lastChild, 'current')
          removeClass(currentWord.lastChild, 'incorrect');
          removeClass(currentWord.lastChild, 'correct');
        }
      }

      if (currentWord.getBoundingClientRect().top > 250) {
        const word = document.getElementById('words');
        const margin = parseInt(word.style.marginTop || '0px');
        word.style.marginTop = (margin - 35) + 'px';
      }

      const nextLetter = document.querySelector('.letter.current')
      const nextWord = document.querySelector('.word.current')
      const cursor = document.getElementById('cursor')
      if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px'
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px'
      } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 2 + 'px'
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px'
      }

})

document.getElementById('newGameButton').addEventListener('click', () => {
  location.reload();
});

document.getElementById('try-again').addEventListener('click', () => {
  location.reload();
});

newGame();