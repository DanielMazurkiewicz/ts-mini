
import decorator from '../utils/decorator'
import './styles/track';
import name from './names/track';

export default (...children: any) => <HTMLTrackElement><unknown>decorator(name, children);
