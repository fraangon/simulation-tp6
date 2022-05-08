import { HIGH_VALUE } from './constants.js';
import { getIAE, getMaxIndex, getMinIndex, getTA } from './utils.js';
import config from './config.js';

// Control
let n = config.attentionPosts;

// CI
let tf = 100000;
let tpll = 0;
let tps = new Array(n).fill(0);
let sto = new Array(n).fill(0);
let ito = new Array(n).fill(0);
let sps = 0;
let ns = 0;
let t = 0;
let nt = 0;
let sta = 0;


const arrival = () => {
    sps = sps + (tpll - t) * ns;
    t = tpll;
    
    const iae = getIAE();
    tpll = t + iae;
    ns = ns + 1;
    nt = nt + 1;
    
    if (ns <= n) {
        const ta = getTA();
        const j = getMaxIndex(tps);
    
        tps[j] = tps[j] + ta;
        sto[j] = sto[j] + (t - ito[j]);
        sta = sta + ta;
    }
};


const exit = (i) => {
    sps = sps + (tps[i] - t) * ns;
    t = tps[i];
    ns = ns - 1;
    if (ns >= n){
        const ta = getTA();
        tps[i] = t + ta;
        sta = sta + ta;
    } else {
        ito[i] = t;
        tps[i] = HIGH_VALUE;
    }
};

while (t < tf) {
    let i = getMinIndex(tps);
    if (tpll < tps[i]) {
        arrival();
    } else {
        exit(i);
    }
}

// RESULTS
console.log('-----------------------------------------------------');
console.log('N: ' + n);
const prc = (sps / sta) /nt;
console.log('PRC: ' + prc);
for (let j = 0; j < n; j++) {
    const pto = sto[j] *100/t;
    console.log('PTO['+j+']: ' + pto);
}
console.log('-----------------------------------------------------');
