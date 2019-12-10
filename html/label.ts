
import decorator from '../utils/decorator'
import './styles/label';
import name from './names/label';

export default (...children: any) => <HTMLLabelElement><unknown>decorator(name, children);
