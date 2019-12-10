
import decorator from '../utils/decorator'
import './styles/head';
import name from './names/head';

export default (...children: any) => <HTMLHeadElement><unknown>decorator(name, children);
