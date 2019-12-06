
import { decorator } from '../utils/base'
import './styles/frame';
import name from './names/frame';

export default (...children: any) => <HTMLFrameElement><unknown>decorator(name, children);
