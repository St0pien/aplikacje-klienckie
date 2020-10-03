const endl = '<br><br>';

const count = parseInt(prompt('Input a value: '));

for (let i = 1; i <= count; i++) {
    document.write('X');
}

document.write(endl)

for (let i = 1; i <= count; i++) {
    for (let j = 1; j <= count; j++) {
        let char = '&nbsp;&nbsp;';
        if (i == 1 || i == count) {
            char = 'X ';
        }

        if (j == 1 || j == count) {
            char = 'X ';
        }

        document.write(char);
    }
    document.write('<br>');
}

document.write(endl);

for (let i=1; i<=count; i++) {
    for (let j=1; j<=count-i; j++) {
        document.write('&nbsp;');
    }

    for (let j=1; j<=i*2-1; j++) {
        document.write('X');
    }
    document.write('<br>');
}

document.write(endl);

for (let i=1; i<=count; i++) {
    for (let j=1; j<=i; j++) {
        document.write(j);
    }
    document.write('<br>');
}

document.write(endl);

for (let i=1; i<=count; i++) {
    for (let j=1; j<=count-i; j++) {
        document.write('&nbsp;');
    }

    for (let j=i; j>=1; j--) {
        document.write(j);
    }
    document.write('<br>');
}

document.write(endl);

function strong(num) {
    return num == 0 ? 1 : strong(num-1)*num;
}

document.write('Silnia: ');
document.write(strong(count));

document.write(endl);

function sum(num) {
    let sum = 0;
    for (let i=1; i<=num; i+=2) {
        sum += i;
    }
    return sum;
}

document.write('Suma: ');
document.write(sum(count));

document.write(endl);

function isPrimary(num) {
    let i;
    for (i=2; i<num; i++) {
        if (num % i === 0) break;
    }
    return i === num;
}

alert(isPrimary(count) ? "Is primary" : "Is not primary");

document.write(endl);

const table = document.createElement('table');
for (let i=0; i<=20; i++) {
    const row = document.createElement('tr');
    for (let j=0; j<=20; j++) {
        const cell = document.createElement('td');

        const val = i*j;
        const same = i === j;
        
        if (val !== 0) {
            cell.innerHTML = val;
        } else {
            if (i === 0) {
                cell.innerHTML = j;
            } else {
                cell.innerHTML = i;
            }
            cell.classList.add('header');
            if (same) {
                cell.classList.add('zero');
            }
        }
        if (same) {
            cell.classList.add('center');
        }
        
        row.appendChild(cell);
    }
    table.appendChild(row);
}

document.body.appendChild(table);
