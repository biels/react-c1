import {EntityFieldInfo, EntityFieldType} from "react-entity-plane";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

export interface TypeDefaults {
    match: EntityFieldType | (EntityFieldType)[]
    info: Partial<EntityFieldInfo>
}

const simpleNumberMask = createNumberMask({
    prefix: '',
    suffix: '', // This will put the dollar sign at the end, with a space.
    includeThousandsSeparator: false,
    allowDecimal: true,
})

export const typeDefaults: TypeDefaults[] = [
    {
        match: EntityFieldType.number,
        info: {
            mask: {
                mask: simpleNumberMask
            }
        },
    }
]
1
