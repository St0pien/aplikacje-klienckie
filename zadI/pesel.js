const pesel = prompt('Podaj PESEL: ', '02272910919');

document.write(`PESEL: <b>${pesel}</b><br><br>`);

let checksum = 0;
const WEIGHTS = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
for (let i=0; i<10; i++) {
    checksum += pesel[i] * WEIGHTS[i];
}

if (checksum % 10 == pesel[10]) {
    document.write('PESEL poprawny');
} else {
    document.write('PESEL niepoprawny');
}

document.write('<br><br>');

if (pesel[9] % 2 === 0) {
    document.write('płeć: żeńska');
} else {
    document.write('płeć: męska');
}

document.write('<br><br>');

let month = parseInt(`${pesel[2]}${pesel[3]}`);
let counter = 0;
while (month >= 12) {
    counter++;
    month -= 20;
}

const OFFSET = [1900, 2000, 2100, 2200, 1800];

const year = parseInt(`${pesel[0]}${pesel[1]}`) + OFFSET[counter];

const day = parseInt(`${pesel[4]}${pesel[5]}`);

const bday = new Date(year, month-1, day).toLocaleDateString();
document.write(`Data urodzenia: ${bday}`);
