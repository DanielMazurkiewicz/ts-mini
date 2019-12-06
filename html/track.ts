
import { decorator } from '../utils/base'
import './styles/track';
import name from './names/track';

export default (...children: any) => <HTMLTrackElement><unknown>decorator(name, children);
