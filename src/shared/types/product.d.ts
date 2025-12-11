declare namespace Products {
  interface ProductShort {
    id: number
    name: string
    category: string
    measure: string
  }
  interface Product {
    id: number
    name: string
    category: {
      id: string
      value: string
    }
    measure: {
      id: string
      value: string
    }
  }
}
