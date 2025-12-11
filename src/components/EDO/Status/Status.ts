export function WayBillStatus() {
  const states = [
    { id: 1, name: 'Оформление' },
    { id: 2, name: 'Утверждено' },
    { id: 3, name: 'Одобрение' },
    { id: 4, name: 'Одобрен' },
  ]

  return states
}

export function ContractStatus() {
  const states = [
    { id: 1, name: 'Подготовка' },
    { id: 2, name: 'Ожидает подписания' },
    { id: 3, name: 'Подписан 1-ой стороной' },
    { id: 4, name: 'Подписан всеми сторонами' },
  ]

  return states
}

export function InvoiceStatus() {
  const states = [
    { id: 1, name: 'Оформление' },
    { id: 2, name: 'Утверждено' },
    { id: 3, name: 'Одобрение' },
    { id: 4, name: 'Одобрено' },
  ]

  return states
}

export function ProxyStatus() {
  const states = [
    { id: 1, name: 'Оформление' },
    { id: 2, name: 'Утверждено' },
    { id: 3, name: 'Утверждено' },
  ]

  return states
}

export function TravelStatus() {
  const states = [
    { id: 1, name: 'Оформление' },
    { id: 2, name: 'Утверждение' },
    { id: 3, name: 'Утверждено' },
  ]

  return states
}
