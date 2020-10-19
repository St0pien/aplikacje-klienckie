///// zad 1 /////
function zad1() {
    const reg = /[aąeęiouy]/i;
    const input = prompt('Podaj zdanie: ', 'Przez niektórych historyków uznawany za osobiście odpowiedzialnego za politykę rasową nazistowskich Niemiec i śmierć milionów ludzi zabitych podczas jego rządów – w tym ');

    let result = '';
    for (let i of input) {
        if (reg.test(i)) {
            result += i.fontcolor('red').bold();
        } else {
            result += i;
        }
    }

    document.write(result);
}

///// zad 2 //////
class Command {
    constructor(input) {
        this.text = input;
        if (!this.isValid()) return;

        this.left = this.text[0] === 'l';

        const buf = this.text.split('');
        buf.shift();
        this.jumps = parseInt(buf.join(''));
    }

    isValid() {
        if (!this.text) {
            return false;
        }

        if (this.text.length <= 0) {
            return false;
        }

        const dirs = ['p', 'l', 'k'];
        if (dirs.indexOf(this.text[0]) <= -1) {
            return false;
        }
        return true;
    }

    isEnding() {
        return this.text === 'k';
    }

    exec(arr) {
        if (!this.isValid()) return arr;

        let result = arr;

        if (!this.isEnding()) console.log(`------- ${this.text} ---------`);

        for (let i=0; i<this.jumps; i++) {
            if (this.left) {
                result.reverse();
            }
            
            const temp = [];
            result.forEach((el, index) => {
                if (index === result.length-1) {
                    temp[0] = el;
                    return;
                }

                temp[index + 1] = el;
            });
            result = this.left ? temp.reverse() : temp;
            console.log(result);
        }

        return result;
    }
}


function zad2() {
    const input = prompt('Podaj tabice', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]');
    let arr = eval(input);
    console.log(arr);

    let command = new Command('empty');
    while (!command.isEnding()) {
        const comInput = prompt('rotacja: p - prawo, l - lewo, k - Koniec np. p1');
        command = new Command(comInput);
        arr = command.exec(arr);
    }
}

////// zad 3 //////
function zad3 () {
    const input = prompt('wklej zdanie', 'te, TE, TE, TE., TE ;kljasdf te te, te. ote. ten, te. te,');
    const word = prompt('szukane słowo');

    const regex = new RegExp(`^(${word})(?=[,.!?]?$)`, 'gi');
    console.log(regex);
    const result = input.split(' ').map(wrd => wrd.replace(regex, `<u>${wrd.match(regex)}</u>`)).join(' ');

    document.write(result);
}

function zad4() {
    const interRegex = /[,.]/g;

    const input = prompt('Podaj zdanie', 'Jestem świr, i jestem do tego zdolny, tego ten, powtórzenie słow ten, jestem kimś więcej, nie mam pojęcia o niczym, świr,');
    let words = input.toLowerCase().replaceAll(interRegex, '').split(' ');
    let stats = [];
    words.forEach(word => {
        const count = words.filter(wrd => wrd === word).length;
        if (count > 0) {
            stats.push([word, count]);
        }
        words = words.filter(wrd => wrd !== word);
    });

    const group = 5;
    let color = '';
    stats.sort((a, b) => b[1] - a[1]).forEach((stat, index) => {
        if (index % group === 0 || index === 0) {
            color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        }
        document.write(`${stat[0]}: ${stat[1]}<br>`.fontcolor(color));
    });
}

zad3();
