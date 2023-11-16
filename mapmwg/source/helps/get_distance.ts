import { useDispatch, useSelector } from 'react-redux';
import RootState from '../../redux';
import { callRoutingAPI } from '../services/fetchAPI';
import { setInstructions } from '../redux/slices/instructionsSlice';

export const getDistance = async () => {
  const current = useSelector((state: RootState) => state.destination.value);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const dispatch = useDispatch();

  const route = await callRoutingAPI(current, destination);
  dispatch(
    setInstructions(
      route.Data?.features[0]?.properties?.segments[0]?.steps,
    ),
  );
  const distance = route.Data.features[0].properties.summary.distance as number;
  console.log(distance);
  return distance;
}
