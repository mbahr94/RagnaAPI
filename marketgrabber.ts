import {
  vendings,
  vending_items,
  cart_inventory,
  item_db_re,
  char,
  VendingData,
} from "./types/vending";
import { db } from "./db";
import {
  OkPacket,
  RowDataPacket,
} from "mysql2";

export const findAll = (callback: Function) => {
  const queryString = `
    SELECT
      v.*,
      vi.*,
      i.*,
      c.*
    FROM vendings AS v
    INNER JOIN omenrodb.char AS c ON v.char_id=c.char_id
    INNER JOIN vending_items AS vi ON v.id=vi.vending_id
    INNER JOIN cart_inventory AS cart ON cart.id=vi.cartinventory_id 
    INNER JOIN item_db_re AS i ON i.id=cart.nameid 
    `;
  
  db.query(queryString, (err, result) => {
    if (err) { callback(err) }
  
    const rows = <RowDataPacket[]> result;
    const vendings: VendingData[] = [];

    //Out of loop item tracker
    var item_ids: number[] = [];
    var item_names: string[] = [];
    var item_amounts: number[] = [];
    var item_prices: number[] = [];
    var rowIndex = 0
    var currentVend = <vendings><unknown>null;

    rows.forEach(row => {
      console.log(row);

      if(rowIndex != 0){
        if ((currentVend.id != row.vending_id) || (rowIndex == rows.length - 1)) {
          if (rowIndex == rows.length - 1) {
            item_ids.push(row.id);
            item_names.push(row.name_japanese);
            item_amounts.push(row.amount);
            item_prices.push(row.price);
          }

        const vending: VendingData = {
          vending: currentVend,
          items: {
            ids: item_ids,
            names: item_names,
            amounts: item_amounts,
            prices: item_prices
          },
        }
          
        vendings.push(vending);
        item_ids = [];
        item_names = [];
        item_amounts = [];
        item_prices = [];
        }
      }
      item_ids.push(row.id);
      item_names.push(row.name_japanese);
      item_amounts.push(row.amount);
      item_prices.push(row.price);
      var newVend: vendings = {
        id: row.vending_id,
        map: row.map,
        x: row.x,
        y: row.y,
        title: row.title,
        char: row.name
      };
      currentVend = newVend;
      rowIndex++;
    });
    callback(null, vendings);
  });
}
