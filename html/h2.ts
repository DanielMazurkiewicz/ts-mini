
import decorator from '../utils/decorator'
import './styles/h2';
import name from './names/h2';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
