
import decorator from '../utils/decorator'
import './styles/h4';
import name from './names/h4';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
