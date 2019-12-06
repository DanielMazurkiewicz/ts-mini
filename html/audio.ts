
import { decorator } from '../utils/base'
import './styles/audio';
import name from './names/audio';

export default (...children: any) => <HTMLAudioElement><unknown>decorator(name, children);
