import { HIGH_VALUE } from './constants.js';
import { getIAE, getMaxIndex, getMinIndex, getTA } from './utils.js';
import config from './config.js';

// Control
let n = config.attentionPosts;

// CI
let tf = 131400;
let tpll = 0;
let tps = new Array(n).fill(HIGH_VALUE);
let sto = new Array(n).fill(0);
let ito = new Array(n).fill(0);
let sps = 0;
let ns = 0;
let t = 0;
let nt = 0;
let sta = 0;


const arrival = () => {
    sps = sps + ((tpll - t) * ns);
    t = tpll;
    
    const iae = getIAE();

    tpll = t + iae;
    ns = ns + 1;
    nt = nt + 1;
    
    if (ns <= n) {
        const ta = getTA();
        const j = getMaxIndex(tps);
    
        tps[j] = t + ta;
        sto[j] = sto[j] + (t - ito[j]);
        sta = sta + ta;
    }
};


const exit = (i) => {
    sps = sps + ((tps[i] - t) * ns);
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
    if (tpll <= tps[i]) {
        arrival();
    } else {
        exit(i);
    }
    console.log('------------------------------------------------------------------------\n');
    console.log('SPS: '+ sps + '\tSTA: '+ sta + '\tNS: '+ ns + '\tNT: '+ nt);

}

if(ns != 0) {
    console.log('\n\nVACIAMIENTO');
    tpll = HIGH_VALUE;
    while(ns > 0) {
        let i = getMinIndex(tps);
        exit(i); 
        console.log('------------------------------------------------------------------------\n');
        console.log('SPS: '+ sps + '\tSTA: '+ sta + '\tNS: '+ ns + '\tNT: '+ nt);  
    }
}


// RESULTS
console.log('\nRESULTADOS');
console.log('N: ' + n + ' puesto/s de entrada');
console.log('NT: '+ nt + ' vehiculos');
const pec = (sps - sta) / nt;
console.log('PEC: ' + pec + ' minutos');
for (let j = 0; j < n; j++) {
    const pto = (sto[j] * 100) / t;
    console.log('PTO['+j+']: ' + pto + '%');
}
console.log('-----------------------------------------------------');
