export const getMinIndex = (arr) => {
  const min = Math.min(...arr);
  const index = arr.indexOf(min);

  return index;
};

export const getMaxIndex = (arr) => {
    const max = Math.max(...arr);
    const index = arr.indexOf(max);

    return index;
    }


export const getIAE = () => {
  const r = Math.random();
  const iae = Math.log(-r + 1) / -0.0006;
  return iae;
};

const equiprobableFDP = (minValue, maxValue) =>
  minValue + (maxValue - minValue) * Math.random();

const getTAR = () => equiprobableFDP(1, 2);
const getTAIP = () => equiprobableFDP(5, 6);
const getTAIH = () => equiprobableFDP(4, 5);

export const getTA = () => {
  const r1 = Math.random();

  if (r1 <= 0.8) {
    return getTAR();
  } else {
    const r2 = Math.random();
    if (r2 <= 0.3) {
      return getTAIP();
    } else {
      return getTAIH();
    }
  }
};
