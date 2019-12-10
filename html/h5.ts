
import decorator from '../utils/decorator'
import './styles/h5';
import name from './names/h5';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
