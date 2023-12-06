import {haversine} from './haversine';

export const findNearestCoordinate = (
  targetCoordinate: [number, number],
  coordinatesArray: [number, number][],
): [number, number] | null => {
  if (!coordinatesArray) {
    return null;
  }

  let minDistance = Infinity;
  let nearestCoordinate: [number, number] | null = null;

  for (let i = 0; i < coordinatesArray.length; i++) {
    let distance = haversine(
      targetCoordinate[0],
      targetCoordinate[1],
      coordinatesArray[i][0],
      coordinatesArray[i][1],
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCoordinate = coordinatesArray[i];
    } else if (minDistance !== Infinity && distance > minDistance) {
      return nearestCoordinate;
    }
  }

  return nearestCoordinate;
};
