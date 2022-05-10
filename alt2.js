/* eslint-disable quotes */
/* eslint-disable indent */
import { HIGH_VALUE, LLEGADA_I, LLEGADA_S, SALIDA_I, SALIDA_S } from "./constants.js";
import {
  getIAE,
  getIAS,
  getMinIndex,
  getTA,
  getTAS,
} from "./utils.js";

//flags
let flagMseVaciamiento = 1;
let finSimulacion = 0;

// Variable de control implicita


// CI
let tf = 500;
let tplli = 1;
let tplls = 0;
let tpsi = HIGH_VALUE;
let tpss = HIGH_VALUE;
let stoi = 0;
let stos = 0;
let itoi = 0;
let itos = 0;
let sps = 0;
let nsi = 0;
let nss = 0;
let t = 0;
let nt = 0;
let sta = 0;

//definicion de funciones de los eventos
const llegadaI = () => {
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
    nsi = nsi - 1;
    nss = nss + 1;

    const ta = getTA();
    tpss = t + ta;
    console.log("habra salida S, generada por nsi == 2 && nss == 0 en LLEGADA I");
    stos = stos + (t - itos);
    sta = sta + ta;
  }
};

const salidaI = () => {
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

const llegadaS = () => {
  sps = sps + (tplls - t) * (nsi + nss);

  t = tplls;

  const ias = getIAS();
  tplls = t + ias;

  nss = nss + 1;
  nt = nt + 1;

  if (nss == 1) {
    const tas = getTAS();
    tpss = t + tas;
    console.log("habra salida S, generada por nss == 1 en LLEGADA S");
    stos = stos + (t - itos);
    sta = sta + tas;
  }
};

const salidaS = () => {
  sps = sps + (tpss - t) * (nsi + nss);

  t = tpss;

  nss = nss - 1;

  if (nss > 0) {
    const tas = getTAS();
    tpss = t + tas;
    console.log("habra salida S, generada por nss > 0 en SALIDA S");
    sta = sta + tas;
  } else if (nsi > 1 && nss == 0) {
    //GENERAR TPSS PERO CON CAMBIO DE FILA
  }else{
    tpss = HIGH_VALUE;
    console.log("salida S en HV en SALIDA S");
    itos = t;
  }
    
};

const proxEvento = () => {
  if(t <= tf){
    return getMinIndex([tplli, tplls, tpsi, tpss]);
  }else {

      if(flagMseVaciamiento){
        console.log("\n\n\nVACIAMIENTO\n\n\n");
        flagMseVaciamiento = 0;
      }

      tplls = HIGH_VALUE;
      tplli = HIGH_VALUE;
      
      if(nsi == 0 && nss == 0){
        finSimulacion = 1;
      }

      return getMinIndex([tplli, tplls, tpsi, tpss]);
  }
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
//correr la simulacion del modelo

while (!finSimulacion) {
  sleep(1);
  const evento = proxEvento();
  switch (evento) {

  case LLEGADA_I:
    llegadaI();
    
    console.log(
      "SPS: " + sps + "\tSTA: " + sta + "\tNSI: " + nsi + "\tNSS: " + nss + "\tNT: " + nt + "\tT: " + t + "\n\n"
    );
    console.log(
      "LLEGADA I ------------------------------------------------------------------------\n"
    );
    break;

  case LLEGADA_S:
    llegadaS();
    
    console.log(
      "SPS: " + sps + "\tSTA: " + sta + "\tNSI: " + nsi + "\tNSS: " + nss + "\tNT: " + nt + "\tT: " + t  + "\n\n"
    );
    console.log(
      "LLEGADA S ------------------------------------------------------------------------\n"
    );
    break;

  case SALIDA_I:
    salidaI();
    
    console.log(
      "SPS: " + sps + "\tSTA: " + sta + "\tNSI: " + nsi + "\tNSS: " + nss + "\tNT: " + nt + "\tT: " + t  + "\n\n"
    );
    console.log(
      "SALIDA I ------------------------------------------------------------------------\n"
    );
    break;

  case SALIDA_S:
    salidaS();
    
    console.log(
      "SPS: " + sps + "\tSTA: " + sta + "\tNSI: " + nsi + "\tNSS: " + nss + "\tNT: " + nt + "\tT: " + t  + "\n\n"
    );
    console.log(
      "SALIDA S ------------------------------------------------------------------------\n"
    );
    break;
    }
}

// RESULTS
console.log("\nRESULTADOS");
console.log("NT: " + nt + " vehiculos");
const pec = (sps - sta) / nt;
console.log("PEC: " + pec + " minutos");
const ptoi = (stoi * 100) / t;
console.log("PTO puesto de ingreso: " + ptoi + "%");
const ptos = (stos * 100) / t;
console.log("PTO puesto de salidas: " + ptos + "%");
console.log("-----------------------------------------------------");

