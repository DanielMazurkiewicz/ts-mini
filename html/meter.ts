
import decorator from '../utils/decorator'
import './styles/meter';
import name from './names/meter';

export default (...children: any) => <HTMLMeterElement><unknown>decorator(name, children);
