
import decorator from '../utils/decorator'
import './styles/picture';
import name from './names/picture';

export default (...children: any) => <HTMLPictureElement><unknown>decorator(name, children);
