
import decorator from '../utils/decorator'
import './styles/datalist';
import name from './names/datalist';

export default (...children: any) => <HTMLDataListElement><unknown>decorator(name, children);
