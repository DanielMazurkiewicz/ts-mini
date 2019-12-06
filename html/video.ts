
import { decorator } from '../utils/base'
import './styles/video';
import name from './names/video';

export default (...children: any) => <HTMLVideoElement><unknown>decorator(name, children);
