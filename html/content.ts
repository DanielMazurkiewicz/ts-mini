
import decorator from '../utils/decorator'
import './styles/content';
import name from './names/content';

// TODO: Find type that is returned
export default (...children: any) => decorator(name, children);
