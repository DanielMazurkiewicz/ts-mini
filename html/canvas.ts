
import decorator from '../utils/decorator'
import './styles/canvas';
import name from './names/canvas';

export default (...children: any) => <HTMLCanvasElement><unknown>decorator(name, children);
