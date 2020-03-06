export default (...elements: any | any[] | undefined): any[] => 
[].concat.apply([], 
    elements.filter((e: any) => e !== undefined)
    .map((e: any) => Array.isArray(e) ? e : [e])
)