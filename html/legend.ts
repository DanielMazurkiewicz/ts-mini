
import decorator from '../utils/decorator'
import './styles/legend';
import name from './names/legend';

export default (...children: any) => <HTMLLegendElement><unknown>decorator(name, children);
