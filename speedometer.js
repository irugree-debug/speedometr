/* DELTA PROJECT | CEF Speedometer */

let turnLeft = false;
let turnRight = false;
let turnTimer = null;

function setSpeed(speed) {
    const value = Math.max(0, Math.round(Number(speed) || 0));
    document.getElementById('text_speed').innerText = value;

    const speedValue = Math.min(188.25, Math.round((188.25 / 240) * value));
    document.getElementById('speed_circle').style.strokeDasharray = `${speedValue}% 500%`;
}

function setMileage(value) {
    document.getElementById('text_mileage').innerText = `${Math.max(0, Number(value) || 0).toFixed(1)} км`;
}

function setFuel(value) {
    const fuel = Math.max(0, Number(value) || 0);
    const text = document.getElementById('text_fuel');
    const icon = document.getElementById('fuel_icon');

    text.innerText = fuel.toFixed(1);
    text.classList.toggle('active', fuel < 5.0);
    icon.classList.toggle('active', fuel < 5.0);
}

function setTurnLight(type, value) {
    const state = Boolean(Number(value));
    const id = type === 'left' ? 'turn_signal_left' : 'turn_signal_right';
    const element = document.getElementById(id);

    if (type === 'left') turnLeft = state;
    if (type === 'right') turnRight = state;

    element.classList.toggle('active', state);

    if ((turnLeft || turnRight) && !turnTimer) {
        turnTimer = setInterval(() => {
            if (turnLeft) document.getElementById('turn_signal_left').classList.toggle('active');
            if (turnRight) document.getElementById('turn_signal_right').classList.toggle('active');
        }, 400);
    }

    if (!turnLeft && !turnRight && turnTimer) {
        clearInterval(turnTimer);
        turnTimer = null;
        document.getElementById('turn_signal_left').classList.remove('active');
        document.getElementById('turn_signal_right').classList.remove('active');
    }
}

function setIcon(type, state) {
    const ids = {
        lock: 'flag_lock',
        key: 'flag_key',
        light: 'flag_light',
        belt: 'flag_belt',
        engine: 'flag_engine'
    };

    const element = document.getElementById(ids[type]);
    if (element) element.classList.toggle('active', Boolean(Number(state)));
}

function showSpeedometer(state) {
    document.getElementById('car').style.display = Number(state) ? 'block' : 'none';
}

/* Native samp-cef browser API */
if (typeof cef !== 'undefined' && cef && typeof cef.on === 'function') {
    cef.on('delta:speed', (value) => setSpeed(value));
    cef.on('delta:fuel', (value) => setFuel(value));
    cef.on('delta:mileage', (value) => setMileage(value));
    cef.on('delta:turn', (type, value) => setTurnLight(type, value));
    cef.on('delta:icon', (type, value) => setIcon(type, value));
    cef.on('delta:visible', (value) => showSpeedometer(value));
}

/* Initial state */
setSpeed(0);
setFuel(0);
setMileage(0);
showSpeedometer(false);
