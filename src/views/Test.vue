<template>
  <div>
    <button @click="exportToPDF">Export to PDF</button>
    <div ref="content">
      <!-- Your HTML content to be exported -->
      <h1>{{ data.supplier }}</h1>
      <p>Date of Purchase: {{ data.dateOfPurchase }}</p>
      <p>Date of Delivery: {{ data.dateOfDelivery }}</p>
      <p>Note: {{ data.note }}</p>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Sales Price</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in data.purchases" :key="index">
            <td>{{ purchase.productName }}</td>
            <td>{{ purchase.salesPrice }}</td>
            <td>{{ purchase.quantity }}</td>
            <td>{{ purchase.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  data: function () {
    return {
      data: [
        {
          id: 1,
          dateOfDelivery: "Thu  2024-03-28 ",
          dateOfPurchase: "Thu  2024-03-28 ",
          note: "jared addisu",
          slug: "aoj1lc3uwg",
          user_id: 2,
          supplier: {
            id: 1,
            user_id: 2,
            fullname: "yared addisu",
            email: "yaredaddisu1997@gmail.com",
            address: "Addis Ababa, Ethiopia",
            note: "Yas",
            phone: "0923423589",
            created_at: "2024-03-28T08:31:25.000000Z",
            updated_at: "2024-03-28T08:31:25.000000Z",
          },
          purchases: [
            {
              id: 3,
              productName: "Mirinda",
              salesPrice: "40",
              quantity: 10,
              amount: 0,
            },
            {
              id: 2,
              productName: "Mirinda",
              salesPrice: "40",
              quantity: 20,
              amount: 0,
            },
            {
              id: 4,
              productName: "Waliya",
              salesPrice: "60",
              quantity: 60,
              amount: 0,
            },
          ],
          created_at: "Thu  2024-03-28 ",
        },
      ],
    };
  },
  methods: {
    exportToPDF() {
      const content = this.$refs.content;
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("purchase_details.pdf");
      });
    },
  },
};
</script>
