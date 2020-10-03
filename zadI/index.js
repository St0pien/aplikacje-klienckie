/// zad 1.1 ///
document.write('<br><br>zad 1.1<br>');

document.write('<b>Witaj Javascript</b>');

function writeNumbers(start, end, jump=1, rev=false, onSite=true, startOut=false, endOut=false, sub) {
    let numbers = [];

    if (rev) {
        for (let i=start; i>=end; i-=jump) {
            numbers.push(i);
        }
    } else {
        for (let i=start; i<=end; i+=jump) {
            numbers.push(i);
        }
    }

    if (sub) {
        numbers = numbers.filter(number => number <= sub[0] || number >= sub[1]);
    }

    if (startOut && start === numbers[0]) numbers.shift();
    if (endOut && end === numbers[numbers.length-1]) numbers.pop();

    if (onSite) {
        document.write(numbers.join('<br>'));
    } else {
        console.log(numbers.join('\n'));
    }
}

/// zad 1.2 ///
document.write('<br><br>Zad 1.2<br>');

writeNumbers(-111, 111);

/// zad 1.3 ///
document.write('<br><br>Zad 1.3<br>');

writeNumbers(50, 0, 3, true, true, false, true);

/// zad 1.4 ///
document.write('<br><br>Zad 1.4<br>');

writeNumbers(50, 10, 1, true, true, false, false, [20, 40]);

/// zad 2.1 ///
console.log('Zad 2.1');
writeNumbers(-30, 40, 2, false, false, false, true, [5, 14]);

/// zad 2.2 ///
console.log('Zad 2.2');
writeNumbers(-19, 40, 2, false, false, false, true, [3, 12]);

/// zad 2.3 ///
console.log('Zad 2.3');
writeNumbers(-99, 41, 3, false, false, false, true, [-50, 12]);
