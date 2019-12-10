
import decorator from '../utils/decorator'
import './styles/audio';
import name from './names/audio';

export default (...children: any) => <HTMLAudioElement><unknown>decorator(name, children);
