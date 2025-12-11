export enum ActStates {
    Registartion = 1,
    Approving = 2,
    Approve = 3,
    Approved = 4,
    Delete = 100,
}

export enum ContractStates {
    Prepare = 1,
    WaitSign = 2,
    FirstSign = 3,
    SecondSign = 4,
    Delete = 100,
}

export enum InvoiceStates {
    Registartion = 1,
    Approving = 2,
    Approve = 3,
    Approved = 4,
    Delete = 100,
}

export enum ProxyStates {
    Registartion = 1,
    Approving = 2,
    Approved = 3,
    Delete = 100,
}

// travel
export enum TravelStates {
    Registartion = 1,
    Approving = 2,
    Approved = 3,
    Delete = 100,
}

export const travelStates = [
    { id: 1, name: 'Оформление' },
    { id: 2, name: 'Утверждено' },
    { id: 3, name: 'Утвержден' },
]

// waybills
export enum WaybillStates {
    Registration = 1,
    Approving = 2,
    Approve = 3,
    Approved = 4,
    Delete = 100,
}