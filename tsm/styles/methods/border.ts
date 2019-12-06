import size from './size'
export default (thickness = 0.2, color = 'black', style = 'solid') => 
({
    border: size(thickness) + ' ' + style + ' ' + color
})