export const getMinIndex = (arr) => {
  const min = Math.min(...arr);
  const index = arr.indexOf(min);

  return index;
};

export const getMaxIndex = (arr) => {
    const max = Math.max(...arr);
    const index = arr.indexOf(max);

    return index;
    };

export const getIAE = () => {
  const r = Math.random();
  const iae = Math.log(-r + 1) / -0.0013;
  return iae/60;
};

const equiprobableFDP = (minValue, maxValue) =>
  minValue + (maxValue - minValue) * Math.random();

const getTAIP = () => equiprobableFDP(8, 16);
const getTAIH = () => equiprobableFDP(5, 10);

export const getTA = () => {
  const r = Math.random();

  if (r <= 0.65) {
    return getTAIH();
  } else {
      return getTAIP();
    }
};