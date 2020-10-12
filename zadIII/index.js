///// zad 1 //////


function zad1() {
    const img = document.querySelector('.image');
    const initialWidth = img.clientWidth;
    const stretchSpeed = 2;
    const stretchRange = 100;

    let value = 0;
    let reverse = false;

    function stretch() {
        if (value > stretchRange || value < -stretchRange) {
            reverse = !reverse;
        }

        if (reverse) {
            value -= stretchSpeed;
        } else {
            value += stretchSpeed;
        }
        img.style.width = `${initialWidth + value}px`;
        window.requestAnimationFrame(stretch);
    }

    stretch();
}

///// zad 2 /////
function zad2() {
    const input = document.querySelector('.scrollInput');
    const scrollSpeed = 2;

    let scrollValue = 0;

    function scrollInput() {
        scrollValue += scrollSpeed;
        input.scroll(scrollValue, 0);

        if (scrollValue >= input.scrollWidth - input.clientWidth) {
            input.value += `        ${input.value}`;
        }

        window.requestAnimationFrame(scrollInput);
    }
    scrollInput();
}

///// zad 3 ////
function zad3() {
    const height = document.querySelector('.wrapper').clientHeight;
    const list = document.querySelector('.list');
    const scrollSpeed = 2;

    let value = 0;
    function scrollDown() {
        value += scrollSpeed;
        list.style.top = `${value}px`;

        if (value > height) {
            value = -list.clientHeight;
        }
        window.requestAnimationFrame(scrollDown);
    }

    scrollDown();
}

///// zad 4 ////
function zad4 () {
    const img = document.querySelector('.circle');
    const centerOffset = 150;
    const radius = 100;
    const rotationSpeed = 2;

    let angle = 0;

    function rotate() {
        angle += rotationSpeed;
        const y = Math.sin(angle*Math.PI/180) * radius;
        const x = Math.cos(angle*Math.PI/180) * radius;

        img.style.top = `${y+centerOffset}px`;
        img.style.left = `${x+centerOffset}px`;
        window.requestAnimationFrame(rotate);
    }

    rotate();
}

zad1();
zad2();
zad3();
zad4();
