
import decorator from '../utils/decorator'
import './styles/form';
import name from './names/form';

export default (...children: any) => <HTMLFormElement><unknown>decorator(name, children);
