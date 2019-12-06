import '../../html/styles/html';
import '../../html/styles/body';
import { tss } from '../../tss/tss';
import html from '../../html/names/html';
import body from '../../html/names/body';

export default tss({
    E: html,
    font_size: '16px',
    white_space: `pre-wrap`
}, {
    E: body,
    height: `100vh`
}, {
    E: '*',
    box_sizing: `border-box`,   // Since there is no option including margin, DO NOT use margin property
    margin: '0',                // use instead padding and gap properties
    overflow: 'auto',
})