
import decorator from '../../utils/decorator'
// import '../styles/video';
import name from '../names/e/video';

export default (...children: any) => <HTMLVideoElement><unknown>decorator(name, children);
