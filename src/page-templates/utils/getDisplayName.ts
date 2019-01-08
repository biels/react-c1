export const getDisplayName = (item: any = {name: '---'}) => {
    if(item == null) return '----'
    return item.name || item.title || item.companyName || item.centerName || item.fullName || item.id || '----';
};
