import {EntityFieldInfo, EntityFieldType, EntityFieldValidation, EntityFieldMask} from "react-entity-plane";
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import emailMask from 'text-mask-addons/dist/emailMask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {ComponentType} from "react";

const eurMask = createNumberMask({
    prefix: '',
    suffix: ' €', // This will put the dollar sign at the end, with a space.
    includeThousandsSeparator: true,
})

const percentMask = createNumberMask({
    prefix: '',
    suffix: ' %', // This will put the dollar sign at the end, with a space.
    includeThousandsSeparator: true,
})

export interface FieldDefaults{
    match: string | RegExp | (string | RegExp)[]
    info: Partial<EntityFieldInfo>
}
export const fieldDefaults: FieldDefaults[] = [
    {
        match: [/^(is|are)/],
        info: {
            type: EntityFieldType.boolean
        }
    },{
        match: [/external/],
        info: {
            icon: 'asterisk',
        }
    },{
        match: [/town/, 'province'],
        info: {
            icon: 'map',
        }
    },
    {
        match: [/state/, /country/],
        info: {
            icon: 'globe',
        }
    },
    {
        match: [/address/],
        info: {
            icon: 'geolocation',
        }
    },{
        match: [/key/],
        info: {
            icon: 'key',
        }
    },{
        match: [/comment/],
        info: {
            icon: 'comment',
            type: EntityFieldType.textarea
        }
    },{
        match: [/password/],
        info: {
            icon: 'lock',
        }
    },
    {
        match: ['companyName', 'centerName'],
        info: {
            icon: 'office'
        }
    }, {
        match: ['creditCard', 'bankAccount', 'iban'],
        info: {
            icon: 'credit-card'
        }
    },
    {
        match: ['nif', 'cif'],
        info: {
            icon: 'id-number',
            mask: {
                mask: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[TRWAGMYFPDXBNJZSQVHLCKE]$/]
            },
        }
    },
    {
        match: [/[Pp]rice/],
        info: {
            icon: 'euro',
            type: EntityFieldType.number
        },
    },
    {
        match: ['active'],
        info: {
            icon: 'segmented-control',
            type: EntityFieldType.boolean
        }
    },{
        match: ['ip', 'ipAddress'],
        info: {
            icon: 'ip-address',
            type: EntityFieldType.string
        }
    },{
        match: ['code', 'barcode', /product/],
        info: {
            icon: 'barcode',
            type: EntityFieldType.string
        }
    },
    {
        match: [/phone/, /mobile/],
        info: {
            icon: 'phone',
            // Add mask
            type: EntityFieldType.number
        }
    },
    {
        match: [/book/, /book/],
        info: {
            icon: 'book',
            // Add mask
            type: EntityFieldType.number
        }
    },
    {
        match: [/email/],
        info: {
            icon: 'envelope',
            label: 'Email',
            type: EntityFieldType.email,
            mask: {
                mask: emailMask
            }
        }
    },
    {
        match: ['postalCode'],
        info: {
            icon: 'map',
            type: EntityFieldType.email,
            mask: {
                mask: [/\d/, /\d/, /\d/, /\d/, /\d/]
            }
        }
    },
    {
        match: [/[Dd]ate/],
        info: {
            icon: 'calendar',
            // Add mask
            type: EntityFieldType.date,
            mask: {
                mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
                pipe: createAutoCorrectedDatePipe('dd/mm/yyyy'),
                keepCharPositions: true,
                showMask: true
            }
        }
    },
    {
        match: [/percent/],
        info: {
            icon: 'percentage',
            // Add mask
            type: EntityFieldType.number,
            mask: {
                mask: percentMask
            }
        }
    },
    {
        match: [/tag/],
        info: {
            icon: 'tag',
        }
    },

]
