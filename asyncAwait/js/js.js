
const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));
let redCircle = document.querySelector('#red');
let yellowCircle = document.querySelector('#yellow');
let greenCircle = document.querySelector('#green');
let btn = document.querySelector('#btn');

function domEventPromise() {
    return new Promise(function (resolve, reject) {
        function removeListener(event) {
            btn.removeEventListener('click', removeListener);
            btn.disabled = true;
            awaitButton();
            resolve(event);
        }
        btn.addEventListener('click', removeListener);
    });
}
async function awaitButton() {
    await delay(8 * 1000);
    btn.disabled = false;
}

domEventPromise(btn, 'click').then(e => console.log('event click happens', e))

async function trafficLight() {
    while (true) {
        greenCircle.style = 'background-color: green;';
        await delay(7000)
        greenCircle.style = 'background-color: white;';
        yellowCircle.style = 'background-color: yellow;';
        await delay(3000)
        yellowCircle.style = 'background-color: white;';
        redCircle.style = 'background-color: red;';
        await delay(4000)
        redCircle.style = 'background-color: white;';
    }
}

trafficLight();
let redCircle2 = document.querySelector('#red2');
let greenCircle2 = document.querySelector('#green2');

async function speedtest(getPromise, count, parallel = 1) {
    let duration = 0;

    async function testPromise() {
        let time = performance.now();
        let arr = [];
        for (let i = 0; i < parallel; i++) {
            arr.push(getPromise());
        }
        let data = await Promise.all(arr);
        console.log('data: ' + data);
        time = performance.now() - time;
        return time;
    }

    for (let i = 0; i < count; i++) {
        duration += await testPromise();
        console.log('duration: ' + duration)
    }
    return {
        duration,
        querySpeed, //средняя скорость одного запроса
        queryDuration, //
        parallelSpeed,
        parallelDuration
    }
}

async function trafficLightForPeople() {
    while (true) {
        greenCircle2.style = 'background-color: green;';
        await Promise.race([domEventPromise(),delay(5000)])
        greenCircle2.style = 'background-color: white;';
        redCircle2.style = 'background-color: red;';
        await Promise.race([domEventPromise(),delay(5000)])
        redCircle2.style='background-color: white;';
    }
}
trafficLightForPeople();