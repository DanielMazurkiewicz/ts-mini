
import { decorator } from '../utils/base'
import './styles/iframe';
import name from './names/iframe';

export default (...children: any) => <HTMLIFrameElement><unknown>decorator(name, children);
