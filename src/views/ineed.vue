<template>
  <div>
    <div class="overflow-x-auto">
      <table class="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Date of Delivery</th>
            <th class="border px-4 py-2">Date of Purchase</th>
            <th class="border px-4 py-2">Status</th>
            <th class="border px-4 py-2">Note</th>
            <th class="border px-4 py-2">Warehouse</th>
            <th class="border px-4 py-2">Supplier</th>
            <th class="border px-4 py-2">Product Name</th>
            <th class="border px-4 py-2">Sales Price</th>
            <th class="border px-4 py-2">Quantity</th>
            <th class="border px-4 py-2">Amount</th>
            <th class="border px-4 py-2">Product Quantity</th>
            <th class="border px-4 py-2">Purchase Price</th>
            <th class="border px-4 py-2">Bar Code</th>
            <th class="border px-4 py-2">Previous</th>
            <th class="border px-4 py-2">Remaining</th>
            <th class="border px-4 py-2">Transaction</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td class="border px-4 py-2">{{ product.id }}</td>
            <td class="border px-4 py-2">{{ product.dateOfDelivery }}</td>
            <td class="border px-4 py-2">{{ product.dateOfPurchase }}</td>
            <td class="border px-4 py-2">{{ product.status ? 'True' : 'False' }}</td>
            <td class="border px-4 py-2">{{ product.note }}</td>
            <td class="border px-4 py-2">{{ product.warehouse }}</td>
            <td class="border px-4 py-2">{{ product.supplier }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].productName }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].salesPrice }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].quantity }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].amount }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].productQuantity }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].purchasePrice }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].barCode }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].previous }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].remaining }}</td>
            <td class="border px-4 py-2">{{ product.purchases[0].Transaction }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          "id": 36,
          "dateOfDelivery": "Mon  2024-04-01 ",
          "dateOfPurchase": "Sun  2024-03-31 ",
          "status": false,
          "note": "yes",
          "slug": "alngvs3nhi",
          "user_id": 2,
          "creator": "admin",
          "warehouse": "Gerji branch",
          "supplier": "Solomon",
          "purchases": [
            {
              "id": 5,
              "productName": "Daniel Galoti",
              "salesPrice": "15000",
              "quantity": 2,
              "amount": 15000,
              "survey_id": 5,
              "user_id": 2,
              "productQuantity": "49",
              "purchasePrice": "10000",
              "barCode": "395188206",
              "previous": 0,
              "remaining": 0,
              "Transaction": "Stock In"
            },
            {
              "id": 6,
              "productName": "Mario",
              "salesPrice": "30000",
              "quantity": 1,
              "amount": 30000,
              "survey_id": 6,
              "user_id": 2,
              "productQuantity": "41",
              "purchasePrice": "10000",
              "barCode": "65474583",
              "previous": 0,
              "remaining": 0,
              "Transaction": "Stock In"
            },
            {
              "id": 2,
              "productName": "Mirinda",
              "salesPrice": "40",
              "quantity": 1,
              "amount": 40,
              "survey_id": 2,
              "user_id": 2,
              "productQuantity": "49",
              "purchasePrice": "20",
              "barCode": "71578377",
              "previous": 0,
              "remaining": 0,
              "Transaction": "Stock In"
            },
            {
              "id": 1,
              "productName": "Dashn",
              "salesPrice": "60",
              "quantity": 1,
              "amount": 60,
              "survey_id": 1,
              "user_id": 2,
              "productQuantity": "362",
              "purchasePrice": "20",
              "barCode": "20344058",
              "previous": 0,
              "remaining": 0,
              "Transaction": "Stock In"
            }
          ],
          "created_at": "Sun  2024-03-31 "
        }
      ]
    }
  }
}
</script>
