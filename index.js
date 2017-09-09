// var sound = new Audio("http://soundbible.com/mp3/School Bell-SoundBible.com-449398625.mp3");
// console.log(sound.currentTime);
// sound.play();

function log(desc, arg = ''){
    console.log(`${desc}: `, arg)
}

var rotating = false;

const Settings = function(){
    var sandFallSpead = 1.5;

    this.sandFallStartDur = function(){
        return sandFallSpead * 2;
    }

    this.sandFallDuringDur = function(){
        return sandFallSpead / 10;
    }

    this.sandFallEndDur = function(){
        return sandFallSpead / 1.28;
    }

    this.roundAnimaDelay = function() {
        return this.sandFallStartDur() * 1000;
    }
}

const Clock = function(){
    var isOn = false
    var isSession = true
    var isRotating = false
    var isIter = false
    var mainIntTimer = null
    var upSandTimeout = null
    var upSabdAnimMiniTimer = null
    var msTimer = null
    var msPass = 0
    var currentDur = 1
    var currentSquareDur = 0
    var currentRoundDur = 0
    var animDelay = clockRules.roundAnimaDelay();
    var timeAdjust = 0;
    
    var pomodoro = {
        sessionDur: 1,
        breakDur: 1
    }

    this.startInt = function(){

        msTimer = setInterval(()=>{
            msPass = msPass === 1000? 0: msPass + 10; 
        }, 10)

        mainIntTimer = setInterval(()=>{
            time();
        }, 1000);

        if (animDelay > 0){
            upSabdAnimMiniTimer = setInterval(()=>{
                animDelay -= 10
            }, 10)
        }
    }

    this.resumeInt = function(){
        setTimeout(()=>{
            this.startInt()
        }, 1000 - msPass)
        
    }

    this.stopInt = function(){
        clearInterval(mainIntTimer)
        clearInterval(msTimer)
    }

    this.pauseInt = function(){
        clearInterval(mainIntTimer);
        clearInterval(msTimer);

        console.log('minutes left: ', currentDur - (+minutes.innerHTML));
        console.log('seconds left: ', 60 - (+seconds.innerHTML));
        console.log('msPass: ', msPass);
        timeAdjust = ((currentDur - (+minutes.innerHTML) - 1) * 60 * 1000) + ((60 - (+seconds.innerHTML)) * 1000) + msPass;
        console.log('timeAdjust: ', timeAdjust);
    }

    this.startTimeout = function(){

        upSandTimeout = setTimeout(() => {

            clearInterval(upSabdAnimMiniTimer)

            animate(fallingSand, 'y', currentShapes.fallingSand_middle_from_y, currentShapes.fallingSand_middle_to_y, clockRules.sandFallDuringDur(), 'indefinite');      
            animate(upSand, 'd', currentShapes.upSand_rise_start_d, currentShapes.upSand_rise_end_d, clockConditions.getCurrent().currentRoundDur - (timeAdjust / 1000), null, 'freeze');

        }, animDelay)
    }

    this.stopTimeout = function(){
        clearTimeout(upSandTimeout)
        clearInterval(upSabdAnimMiniTimer)
    }

    this.startPomoAnim = function(){

        animate(fallingSand, 'height', currentShapes.fallingSand_begin_from_height, currentShapes.fallingSand_begin_to_height, (animDelay / 1000), null, 'freeze');
        animate(fallingSand, 'y', currentShapes.fallingSand_begin_from_y, currentShapes.fallingSand_begin_to_y, (animDelay / 1000), null, 'freeze');
        animate(lowSand, 'd', currentShapes.lowSand_fall_start_d, currentShapes.lowSand_fall_end_d, clockConditions.getCurrent().currentSquareDur - (timeAdjust / 1000), null, 'freeze');
    }

    this.getPomo = function(part){
        return pomodoro[part];
    }

    this.setPomo = function(part, change){
        if (pomodoro[part] + (+change) < 1 || pomodoro[part] + (+change) > 60){return;}
        pomodoro[part] += (+change);
    }

    this.getCurrent = function(){
        return {
            currentDur: currentDur,
            currentSquareDur: currentSquareDur,
            currentRoundDur: currentRoundDur
        };
    }

    this.setCurrent = function(){
        currentDur = isSession? pomodoro.sessionDur: pomodoro.breakDur;
        currentSquareDur = currentDur * 60 - clockRules.sandFallEndDur();
        currentRoundDur = currentDur * 60 - clockRules.sandFallStartDur();
    }

    this.getIsSession = function(){
        return isSession;
    }

    this.setIsSession = function(bool){
        isSession = bool;
    }

    this.getIsRotating = function(){
        return isRotating;
    }

    this.setIsRotating = function(bool){
        isRotating = bool;
    }

    this.getIsIter = function(){
        return isIter;
    }

    this.setIsIter = function(bool){
        isIter = bool;
    }

    this.getIsOn = function(){
        return isOn;
    }

    this.setIsOn = function(bool){
        isOn = bool;
    }

    this.setanimDelay = function(value){
        animDelay
    }

    this.resetAll = function(){
        animDelay = clockRules.roundAnimaDelay();
    }

}

const Shapes = function(){
    var originProperties = {
        lowSand_rotate_begin_d: 'M219 364C212.3 326.8 201 296 190 280.2 179 264.4 184.2 268.7 171.4 257.7 158.5 246.8 148.1 242.6 129.8 259.2 111.6 275.9 116.6 270.9 110.6 280.2 98.4 298.8 88 326.8 81 364L219 364Z',
        lowSand_rotate_middle_d: 'M219 364C219 336 219 308 219 280 197.7 260.3 176.3 240.7 155 221 151.7 221 148.3 221 145 221 128.3 245.7 102.7 262.3 95 295 87.3 327.7 127.7 344 150 364L219 364Z',
        lowSand_rotate_end_d: 'M219 364C219 336 219 308 219 280 197.7 260.3 176.3 240.7 155 221 151.7 221 148.3 221 145 221 123.7 240.7 102.3 260.3 81 280 81 298.3 81 316.7 81 335L219 364Z',

        lowSand_fall_start_d: 'M219 364C219 336 219 308 219 280 197.7 260.3 176.3 240.7 155 221 151.7 221 148.3 221 145 221 123.7 240.7 102.3 260.3 81 280 81 298.3 81 316.7 81 335L219 364Z',
        lowSand_fall_end_d: 'M219 221.5C219 221.5 219 221.5 219 221.5 197.7 221.5 176.3 221.5 155 221.5 151.7 221.5 148.3 221.5 145 221.5 123.7 221.5 102.3 221.5 81 221.5 81 221.5 81 221.5 81 221.5L219 221.5Z',

        upSand_rise_start_d: 'M81-77C88.3-39.7 98.7-11.8 110.7 6.8 116.7 16.1 128.3 24.8 136.5 29.5 144.7 34.3 152.1 34.7 162.2 30.5 172.4 26.4 183.3 16.1 189.3 6.8 201.3-11.8 211.8-39.8 219-77L81-77Z',
        upSand_rise_end_d: 'M81 36C88.3 73.3 98.7 101.2 110.7 119.8 116.7 129.1 128.3 137.8 136.5 142.5 144.7 147.3 152.1 147.7 162.2 143.5 172.4 139.4 183.3 129.1 189.3 119.8 201.3 101.2 211.8 73.2 219 36L81 36Z',

        fallingSand_begin_from_height: '0',
        fallingSand_begin_to_height: '182',
        fallingSand_begin_from_y: '220',
        fallingSand_begin_to_y: '36',
        fallingSand_middle_from_y: '39',
        fallingSand_middle_to_y: '36',
        fallingSand_end_from_height: '182',
        fallingSand_end_to_height: '107'
    }

    var currentProperties = this.getOriginalSpec();

    this.getOriginalSpec = function(){
        return originProperties;
    }

    this.resetShapes = function(){
        currentProperties = this.getOriginalSpec();
    }

    this.getProperties = function(){
        return currentProperties;
    }

    this.setProperty = function(prop, newVal){
        // console.log(`changing prop ${prop}: `, newVal)
        currentProperties[prop] = newVal;
    }

    this.resetProperties = function(){
        currentProperties = originProperties;
    }
}

const clockRules = new Settings();
const clockConditions = new Clock();
const shapesConditions = new Shapes();

let currentShapes;



// html elements
var seesionMinus = document.querySelector("#session-minus");
var seesionPlus = document.querySelector("#session-plus");
var breakMinus = document.querySelector("#break-minus");
var breakPlus = document.querySelector("#break-plus");
var sessionLength = document.querySelector("#session-length");
var breakLength = document.querySelector("#break-length");

// svg elements
var svgContainer = document.querySelector("#svg-container");
var lowSand = document.querySelector("#low_sand");
var fallingSand = document.querySelector("#falling_sand");
var upSand = document.querySelector("#up_sand");

// text elements
var minutes = document.querySelector("#minutes");
var seconds = document.querySelector("#seconds");


svgContainer.addEventListener("click", function(){
    if(clockConditions.getIsRotating()){return;}

    if (!clockConditions.getIsOn()) {
        start();
    }
    else {
        // flipping the Sand Clock
        animateTransform();

        // setting the timer value
        clockConditions.setCurrent();
        const current = clockConditions.getCurrent();
        minutes.innerHTML = current.currentDur > 9? current.currentDur: '0' + current.currentDur;
        
        // sand slipping animation
        animateValue(lowSand, 'd', `${currentShapes.lowSand_rotate_begin_d}; ${currentShapes.lowSand_rotate_middle_d}; ${currentShapes.lowSand_rotate_end_d}`, 2, null, 'freeze')

        // flickering the text while rotating
        minutes.classList.add("flick-rotate");
        seconds.classList.add("flick-rotate");
    }
})

minutes.addEventListener("animationend", function(event){
    clockConditions.setIsOn(true);

    minutes.classList.remove("flick-rotate");
    seconds.classList.remove("flick-rotate");

    clockConditions.startInt();

    clockConditions.startPomoAnim();

    clockConditions.startTimeout();

}, false)

document.querySelectorAll(".btnSettings").forEach((btn) => {
    btn.addEventListener("click", function(event){
        clockConditions.setPomo(this.dataset.target, this.dataset.action);

        
        var lengthContainer = event.target.parentNode.children[2]

        lengthContainer.innerHTML = clockConditions.getPomo(this.dataset.target) > 9? clockConditions.getPomo(this.dataset.target): "0" + clockConditions.getPomo(this.dataset.target);
    
        if(clockConditions.getIsSession()){
            minutes.innerHTML = clockConditions.getPomo('sessionDur') > 9? clockConditions.getPomo('sessionDur'): "0" + clockConditions.getPomo('sessionDur');
        }
        else{
            minutes.innerHTML = clockConditions.getPomo('breakDur') > 9? clockConditions.getPomo('breakDur'): "0" + clockConditions.getPomo('breakDur');
        }
    })
})

document.querySelectorAll(".btnControl").forEach((btn) => {
    btn.addEventListener("click", function(event){
        if (clockConditions.getIsRotating()){return;}

        var action = this.dataset.action;

        if (action === 'start'){
            start()
        }
        else if (action === 'stop'){
            stop()
        }
        else if (action === 'pause'){
            pause()
        }

    })
})

function animate(elem, attrName, from, to, dur, repCount, fill){

    var anima = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anima.setAttributeNS('', 'attributeType', 'XML');
    anima.setAttributeNS('', 'attributeName', attrName);
    anima.setAttributeNS('', 'from', from);
    anima.setAttributeNS('', 'to', to);
    anima.setAttributeNS('', 'dur', dur + 's');
    if(repCount){
        anima.setAttributeNS('', 'repeatCount', repCount);
    }
    if(fill){
        anima.setAttributeNS('', 'fill', fill);
    }
    elem.appendChild(anima);

    elem.lastChild.beginElement();
}

function animateValue(elem, attrName, values, dur, repCount, fill){

    var anima = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anima.setAttributeNS('', 'attributeType', 'XML');
    anima.setAttributeNS('', 'attributeName', attrName);
    anima.setAttributeNS('', 'values', values);
    anima.setAttributeNS('', 'dur', dur + 's');
    if(repCount){
        anima.setAttributeNS('', 'repeatCount', repCount);
    }
    if(fill){
        anima.setAttributeNS('', 'fill', fill);
    }
    elem.appendChild(anima);

    elem.lastChild.beginElement();
}

function animateTransform(){

    var anima = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
    anima.setAttributeNS('', 'attributeType', 'XML');
    anima.setAttributeNS('', 'attributeName', 'transform');
    anima.setAttributeNS('', 'type', 'rotate');
    anima.setAttributeNS('', 'from', "0 150 200");
    anima.setAttributeNS('', 'to', "180 150 200");
    anima.setAttributeNS('', 'dur', '2s');
    anima.setAttributeNS('', 'fill', 'freeze');

    svgContainer.appendChild(anima);

    svgContainer.lastChild.beginElement();
}

function time(){
    min = +minutes.innerHTML;
    sec = +seconds.innerHTML;
    if (min === 0 && sec < 10){
        if (sec === 5){
            minutes.classList.add("flick-end");
            seconds.classList.add("flick-end");
            // sound.currentTime = 0;
            // sound.play();
        }

        else if (sec === 1){
            animate(fallingSand, 'height', currentShapes.fallingSand_end_from_height, currentShapes.fallingSand_end_to_height, 1.17, '0', 'freeze');
        }

        else if (sec === 0){
            clockConditions.stopInt();
            // sound.pause();
            minutes.classList.remove("flick-end");
            seconds.classList.remove("flick-end");
            
            console.log('stop');

            debugShapes('end of iteration before resetting')

            fallingSand.innerHTML = null;

            clockConditions.setIsSession(!clockConditions.getIsSession());
            svgContainer.lastChild.remove();
            upSand.innerHTML = null;
            upSand.setAttribute('d', 'M81-77C88.3-39.7 98.7-11.8 110.7 6.8 116.7 16.1 128.3 24.8 136.5 29.5 144.7 34.3 152.1 34.7 162.2 30.5 172.4 26.4 183.3 16.1 189.3 6.8 201.3-11.8 211.8-39.8 219-77L81-77Z');
            lowSand.innerHTML = null;

            shapesConditions.resetProperties();

            debugShapes('end of iteration before resetting')

            var event = new CustomEvent('click', {bubbles: true, cancelable: true});
            svgContainer.dispatchEvent(event);

            return;
        }
        
    }

    if (sec === 0){
        minutes.innerHTML = minutes.innerHTML > 10? min - 1: '0' + (min - 1);
        sec = 60;
    }

    seconds.innerHTML = sec > 10? sec - 1: '0' + (sec - 1);
    return;
}

var start = function(){
    debugClock('before start');
    debugShapes('before start')

    if(clockConditions.getIsOn()){return;} // clock already working, prevent second start!!!

    // updating the animations start points
    currentShapes = shapesConditions.getProperties();

    if (!clockConditions.getIsIter()){ // starting a new iteration

        clockConditions.setIsIter(true);

        // flipping the Sand Clock
        animateTransform();

        // setting the timer value
        clockConditions.setCurrent();
        const current = clockConditions.getCurrent();
        minutes.innerHTML = current.currentDur > 9? current.currentDur: '0' + current.currentDur;
        
        // sand slipping animation
        animateValue(lowSand, 'd', `${currentShapes.lowSand_rotate_begin_d}; ${currentShapes.lowSand_rotate_middle_d}; ${currentShapes.lowSand_rotate_end_d}`, 2, null, 'freeze')

        // flickering the text while rotating
        minutes.classList.add("flick-rotate");
        seconds.classList.add("flick-rotate");
    }

    // else if ()
    
    else { // resuming last iteration

        clockConditions.resumeInt();
        clockConditions.startPomoAnim();
        clockConditions.startTimeout();

    }
}

var pause = function(){
    debugClock('before pause')
    clockConditions.setIsOn(false);

    if (lowSand.lastChild && lowSand.lastChild.tagName === 'animate') lowSand.lastChild.endElement();
    shapesConditions.setProperty('lowSand_fall_start_d', lowSand.getAttribute('d'));

    fallingSand.childNodes.forEach((animate, index) => {
        animate.endElement();
        if(index === 0){
            shapesConditions.setProperty('fallingSand_begin_from_height', fallingSand.getAttribute('height'));
        }
        else if(index === 1){
            shapesConditions.setProperty('fallingSand_begin_from_y', fallingSand.getAttribute('y'));
        }
        else if(index === 3){
            shapesConditions.setProperty('fallingSand_end_from_height', fallingSand.getAttribute('height'));
        }
        
    })

    if (upSand.lastChild && upSand.lastChild.tagName === 'animate') {
        upSand.lastChild.endElement();
        shapesConditions.setProperty('upSand_rise_start_d', upSand.getAttribute('d'));
    }
    else {
        clockConditions.stopTimeout();
    }

    clockConditions.pauseInt();

    
        // shapesConditions.setProperty('fallingSand_begin_from_height', fallingSand.getAttribute('height'));
        // shapesConditions.setProperty('fallingSand_begin_from_y', fallingSand.getAttribute('d'));
        
}

var stop = function(){
    debugClock('before stop')
    clockConditions.setIsIter(false);

    if (lowSand.lastChild && lowSand.lastChild.tagName === 'animate') lowSand.lastChild.endElement();


    fallingSand.childNodes.forEach((animate) => {
        animate.endElement();
    })

    if (upSand.lastChild && upSand.lastChild.tagName === 'animate') {
        console.log(upSand.lastChild)
        upSand.lastChild.endElement();
    }
    else {
        clockConditions.stopTimeout();
    }

    clockConditions.setIsOn(false);

    clockConditions.stopInt();

    const current = clockConditions.getCurrent();

    minutes.innerHTML = current.currentDur > 9? current.currentDur: '0' + current.currentDur;
    seconds.innerHTML = '00';

    svgContainer.lastChild.remove();
    upSand.innerHTML = null;
    fallingSand.innerHTML = null;
    lowSand.innerHTML = null;
}

function debugClock(place){
    log('debuging clock in: ', place);
    log('==========================')
    log('isOn', clockConditions.getIsOn())
    log('isIter', clockConditions.getIsIter())
    log('isRotate', clockConditions.getIsRotating())
    log('isSession', clockConditions.getIsSession())
    log('Pomo', clockConditions.getPomo())


    log('//////////////////////////////////')
}

function debugShapes(place){
    log('debuging shapes in: ', place);
    log('==========================')
    log('low sand d', lowSand.getAttribute('d'))
    log('falling sand y', fallingSand.getAttribute('y'))
    log('falling sand height', fallingSand.getAttribute('height'))
    log('up sand d', upSand.getAttribute('d'))


    log('//////////////////////////////////')
}