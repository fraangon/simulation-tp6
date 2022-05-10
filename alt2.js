/* eslint-disable indent */
/* eslint-disable quotes */
import { HIGH_VALUE } from "./constants.js";
import { getIAE, getIAS, getTAS, getTA } from "./utils.js";

const printStats = 0;

// CI
let tf = 131400;
let tplli = 0;
let tplls = 0;
let tpsi = HIGH_VALUE;
let tpss = HIGH_VALUE;
let stos = 0;
let stoi = 0;
let itos = 0;
let itoi = 0;
let sps = 0;
let nsi = 0;
let nss = 0;
let t = 0;
let nt = 0;
let sta = 0;

let cambio_cola = false;

const llega_alguien_para_ingresar = () => {
  sps = sps + (tplli - t) * (nsi + nss);
  t = tplli;

  const iae = getIAE();

  tplli = t + iae;
  nsi = nsi + 1;
  nt = nt + 1;

  if (nsi == 1) {
    const ta = getTA();
    tpsi = t + ta;
    stoi = stoi + (t - itoi);
    sta = sta + ta;
  } else if (nsi == 2 && nss == 0) {
    //cambio de cola
    nsi = nsi - 1;
    nss = nss + 1;
    const ta = getTA();
    tpss = t + ta;
    stos = stos + (t - itos);
    sta = sta + ta;
    cambio_cola = true;
  }
};

const llega_alguien_para_salir = () => {
  sps = sps + (tplls - t) * (nsi + nss);
  t = tplls;

  const ias = getIAS();

  tplls = t + ias;
  nss = nss + 1;
  nt = nt + 1;

  if (nss == 1) {
    const tas = getTAS();

    tpss = t + tas;
    stos = stos + (t - itos);

    sta = sta + tas;
  }
};

const paso_el_check_in = () => {
  sps = sps + (tpsi - t) * (nsi + nss);
  t = tpsi;
  nsi = nsi - 1;

  if (nsi > 0) {
    const ta = getTA();

    tpsi = t + ta;
    sta = sta + ta;
  } else {
    tpsi = HIGH_VALUE;
    itoi = t;
  }
};

const paso_el_check_out = () => {
  sps = sps + (tpss - t) * (nss + nsi);
  t = tpss;
  nss = nss - 1;

  if (nss > 0) {
    if (cambio_cola) {
      cambio_cola = false;

      const ta = getTA();
      tpss = t + ta;
      sta = sta + ta;
    } else {
      const tas = getTAS();
      tpss = t + tas;
      sta = sta + tas;
    }
  } else if (nsi > 1) {
    nsi = nsi - 1;
    nss = nss + 1;
    const ta = getTA();
    tpss = t + ta;
    sta = sta + ta;
    cambio_cola = true;
  } else {
    tpss = HIGH_VALUE;
    itos = t;
  }
};

while (t < tf) {
  if (tpsi <= tpss) {
    if (tplli <= tpsi) {
      llega_alguien_para_ingresar();
    } else if (tplls <= tpsi) {
      llega_alguien_para_salir();
    } else {
      paso_el_check_in();
    }
  } else if (tplli <= tpss) {
    llega_alguien_para_ingresar();
  } else if (tplls <= tpss) {
    llega_alguien_para_salir();
  } else {
    paso_el_check_out();
  }
}

if (nss != 0) {
  if(printStats) console.log("\n\nVACIAMIENTO NSS");
  tplls = HIGH_VALUE;
  while (nss > 0) {
    paso_el_check_out();
  }
}

if (nsi != 0) {
  if(printStats) console.log("\n\nVACIAMIENTO NSI");
  tplli = HIGH_VALUE;
  while (nsi > 0) {
    paso_el_check_in();
  }
}

// RESULTS
console.log("\n\tRESULTADOS\n");
console.log("\tNT: " + nt + " vehiculos");

const pec = (sps - sta) / nt;
console.log("\tPEC: " + pec + " minutos");

const ptoi = (stoi * 100) / t;
console.log("\tPTOI: " + ptoi + "%");

const ptos = (stos * 100) / t;
console.log("\tPTOS: " + ptos + "%");
