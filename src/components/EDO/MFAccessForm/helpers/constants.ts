export enum MfAccessFormStates {
    Registration = 1,
    Agreement = 2,
    Approve = 3,
    Checked = 4,
    Delete = 100,
}

export enum SignType {
    Kurator = 1,
    NachOtdel = 2,
    Rukovoditel = 3,
}

export const docType = [
    { id: 1, name: 'Подготовка бюджета' },
    { id: 2, name: 'Испольнение бюджета' },
    { id: 3, name: 'Руководитель' },
]