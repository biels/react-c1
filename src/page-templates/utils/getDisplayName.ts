import {EntityInfo} from "react-entity-plane/src/types/entities";

export const getDisplayName = (entityInfo: EntityInfo, item: any = {name: '---'}) => {
    if(item == null) return '----';
    let render = entityInfo.display.render;
    if(render){
        let rendered = render(item);
        if(rendered != null) return rendered;
    }
    return item.name || item.title || item.companyName || item.centerName || item.fullName || item.id || '----';
};
