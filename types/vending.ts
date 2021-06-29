export interface vendings {
  id: number,
  map: string,
  x: number,
  y: number,
  title: string,
  char: string,
}

export interface vending_items {
  ids: number[]
  names: string[],
  amounts: number[],
  prices: number[],
}

export interface cart_inventory {
  id: number,
  nameid: number,

}

export interface item_db_re {
  id: number,
  name: string,
}

export interface char {
  id: number,
  name: string
}

export interface VendingData {
  vending: vendings,
  items: vending_items,
}