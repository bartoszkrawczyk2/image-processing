let s1          = document.getElementById('s1');
let s2          = document.getElementById('s2');
let v           = document.getElementById('v');
let vk          = document.getElementById('vk');
let vr          = document.getElementById('vr');
let res         = document.getElementById('res');
let p1          = document.getElementById('p1');
let p2          = document.getElementById('p2');
let p3          = document.getElementById('p3');
let p4          = document.getElementById('p4');
let btn         = document.querySelector('button');
let input       = document.querySelector('input');
let t           = 1000;
let currentStep = 0;
let isPlaying   = false;
let playInterv;

let delay = (t) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t)
    });
}

btn.addEventListener('click', () => {
    btn.className = isPlaying ? '' : 'play';
    isPlaying = !isPlaying;
    input.disabled = isPlaying;
});

input.addEventListener('input', (e) => {
    currentStep = parseInt(e.target.value);
    console.log(currentStep);
    steps[currentStep]();
});

let steps = [
    () => {
        v.style.left = '0';
        vk.style.left = '0';
        v.style.transform = 'translateY(0)';
        vk.style.transform = 'translateY(0)';

        res.innerText = '(80 * -1)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';
        v.style.transform = 'translateY(0)';
        vk.style.transform = 'translateY(0)';

        res.innerText = '(80 * -1) + (120 * -1)';
    },
    () => {
        v.style.left = '60px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(0)';
        vk.style.transform = 'translateY(0)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0)';
    },
    () => {
        v.style.left = '0px';
        vk.style.left = '0px'
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1) + (101 * 1)';
    },
    () => {
        v.style.left = '60px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1) + (101 * 1) + (153 * 1)';
    },
    () => {
        v.style.left = '0px';
        vk.style.left = '0px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1) + (101 * 1) + (153 * 1) + (87 * 0)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1) + (101 * 1) + (153 * 1) + (87 * 0) + (45 * 1)';
        p1.style.display = 'none';
    },
    () => {
        v.style.left = '60px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';

        p1.style.transform = 'translate(0, 0)';

        res.innerText = '(80 * -1) + (120 * -1) + (198 * 0) + (68 * -1) + (101 * 1) + (153 * 1) + (87 * 0) + (45 * 1) + (92 * 2) = ';
        p1.style.display = 'block';
    },
    () => {
        v.style.left = '60px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';
        res.innerText = '';
        p1.style.transform = 'translate(-152px, -114px)';
        s1.style.left = '-1px';
        s2.style.left = '-1px';
        vr.style.left = '29px';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '0';
        v.style.transform = 'translateY(0)';
        vk.style.transform = 'translateY(0)';
        s1.style.left = '28px';
        s2.style.left = '28px';
        vr.style.left = '59px';

        res.innerText = '(120 * -1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(120 * -1) + (198 * -1)';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0)';
        v.style.transform = 'translateY(0)';
        vk.style.transform = 'translateY(0)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '0';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1) + (153 * 1)';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1) + (153 * 1) + (65 * 1)';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(31px)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '0';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1) + (153 * 1) + (65 * 1) + (45 * 0)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1) + (153 * 1) + (65 * 1) + (45 * 0) + (92 * 1)';
        p2.style.display = 'none';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(120 * -1) + (198 * -1) + (51 * 0) + (101 * -1) + (153 * 1) + (65 * 1) + (45 * 0) + (92 * 1) + (48 * 2) = ';
        p2.style.display = 'block';
        p2.style.transform = 'translate(0, 0)';
        p2.innerText = '-13';
    },
    () => {
        res.innerText = '';
        p2.style.transform = 'translate(-116px, -114px)';
        p2.innerText = '0';
        vr.style.left = '59px';
        vr.style.transform = 'translateY(0)';
        s1.style.transform = 'translateY(0)';
        s2.style.transform = 'translateY(0)';
        s1.style.left = '28px';
        s2.style.left = '28px';

        v.style.left = '88px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(62px)';
    },
    () => {
        v.style.left = '0';
        vk.style.left = '0';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(0)';
        s1.style.left = '-1px';
        s2.style.left = '-1px';
        s1.style.transform = 'translateY(31px)';
        s2.style.transform = 'translateY(31px)';
        vr.style.left = '29px';
        vr.style.transform = 'translateY(31px)';

        res.innerText = '(68 * -1)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';

        res.innerText = '(68 * -1) + (101 * -1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(0)';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0)';
    },
    () => {
        v.style.left = '0';
        vk.style.left = '0';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1) + (45 * 1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '59px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1) + (45 * 1) + (92 * 1)';
    },
    () => {
        v.style.left = '0';
        vk.style.left = '0';
        v.style.transform = 'translateY(93px)';
        vk.style.transform = 'translateY(62px)';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1) + (45 * 1) + (92 * 1) + (100 * 0)';
    },
    () => {
        v.style.left = '30px';
        vk.style.left = '29px';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1) + (45 * 1) + (92 * 1) + (100 * 0) + (56 * 1)';
        p3.style.display = 'none';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '59px';

        res.innerText = '(68 * -1) + (101 * -1) + (153 * 0) + (87 * -1) + (45 * 1) + (92 * 1) + (100 * 0) + (56 * 1) + (68 * 2) = ';
        p3.style.display = 'block';
        p3.style.transform = 'translate(0, 0)';
    },
    () => {
        res.innerText = '';
        p3.style.transform = 'translate(-144px, -83px)';
        v.style.transform = 'translateY(93px)';
        vk.style.transform = 'translateY(62px)';
        v.style.left = '59px';
        vk.style.left = '59px';

        s1.style.left = '-1px';
        s2.style.left = '-1px';
        s1.style.transform = 'translateY(31px)';
        s2.style.transform = 'translateY(31px)';
        vr.style.left = '29px';
        vr.style.transform = 'translateY(31px)';
    },
    // ------------------------------------------------------------------------------------------
    () => {
        v.style.left = '29px';
        vk.style.left = '0';
        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(0)';
        s1.style.left = '28px';
        s2.style.left = '28px';
        vr.style.left = '59px';

        res.innerText = '(101 * -1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(101 * -1) + (153 * -1)';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0)';

        v.style.transform = 'translateY(31px)';
        vk.style.transform = 'translateY(0)';
    },
    () => {
        v.style.left = '29px';
        vk.style.left = '0px';
        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(31px)';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1) + (92 * 1)';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1) + (92 * 1) + (48 * 1)';

        v.style.transform = 'translateY(62px)';
        vk.style.transform = 'translateY(31px)';
    },
    () => {
        v.style.left = '29px';
        vk.style.left = '0px';
        v.style.transform = 'translateY(93px)';
        vk.style.transform = 'translateY(62px)';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1) + (92 * 1) + (48 * 1) + (56 * 0)';
    },
    () => {
        v.style.left = '59px';
        vk.style.left = '29px';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1) + (92 * 1) + (48 * 1) + (56 * 0) + (90 * 1)';
        p4.style.display = 'none';
    },
    () => {
        v.style.left = '88px';
        vk.style.left = '59px';

        res.innerText = '(101 * -1) + (153 * -1) + (65 * 0) + (45 * -1) + (92 * 1) + (48 * 1) + (56 * 0) + (90 * 1) + (68 * 2) =';
        p4.style.display = 'block';
        p4.style.transform = 'translate(0, 0)';
    },
    () => {
        res.innerText = '';
        p4.style.transform = 'translate(-106px, -83px)';
    }
];

setInterval(() => {
    if (isPlaying) {
        steps[currentStep]();
        currentStep++;
        input.value = currentStep;
    }
}, t);