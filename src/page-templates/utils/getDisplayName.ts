export const getDisplayName = (item: any = {name: '---'}) => item.name || item.title || item.companyName || item.centerName || item.fullName || item.id;
