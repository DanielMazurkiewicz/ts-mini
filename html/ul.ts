
import decorator from '../utils/decorator'
import './styles/ul';
import name from './names/ul';

export default (...children: any) => <HTMLUListElement><unknown>decorator(name, children);
