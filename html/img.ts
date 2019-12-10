
import decorator from '../utils/decorator'
import './styles/img';
import name from './names/img';

export default (...children: any) => <HTMLImageElement><unknown>decorator(name, children);
