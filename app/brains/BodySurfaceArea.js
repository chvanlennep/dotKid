//Mosteller Method:[1]

// BSA (m2) = (height (cm) x weight (kg)/3600)½

// eg, BSA (m2) = square root of (height (cm) x weight (kg)/3600)

const BodySurfaceArea = (height, weight) => {
  output = Math.sqrt((height * weight) / 3600).toFixed(2);

  return output;
};

export default BodySurfaceArea;
