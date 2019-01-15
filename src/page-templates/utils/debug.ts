export const D = (name) => (...args) => {
    if(args.length === 0) return d();
    return d(`[${name}] `, ...args);
}
export const d = (...args) => {
    let isDebug = (window as any).c1_d;
    if(args.length > 0) console.log(...args);
    return isDebug
}
(window as any).d = () => {
    let newValue = !(window as any).c1_d;
    console.log(`Debug mode is now %c${newValue ? 'ENABLED' : 'DISABLED'}`, `color: ${newValue ? 'green' : 'red'}`);
    return (window as any).c1_d = newValue;
}
