export const calCoorCenter = (
  coor1: [number, number],
  coor2: [number, number],
): [number, number] => {
  const x = (coor1[0] + coor2[0]) / 2;
  const y = (coor1[1] + coor2[1]) / 2;
  return [x, y];
};

export const calZoom = (
  coor1: [number, number],
  coor2: [number, number],
): number => {
  // Calculate the bounds based on the coordinates
  const bounds = {
    ne: coor1,
    sw: coor2,
  };

  // Calculate the maximum distance between the two points
  const maxDistance = Math.max(
    Math.abs(bounds.ne[0] - bounds.sw[0]),
    Math.abs(bounds.ne[1] - bounds.sw[1]),
  );

  // Calculate the zoom level using the provided formula
  const zoom = Math.ceil(
    Math.log2(maxDistance / 256)
  );  
  // Return the calculated zoom level
  return Math.abs(zoom);
};
