<template>
  <div>
    <!-- Iterate over the array of barcode data and render the Barcode component for each item -->
    <div v-for="(barcode, index) in barcodes" :key="index">
      <!-- Render the Barcode component with necessary props -->
      <Barcode
        :code="barcode.code"
        :format="barcode.format"
        :width="barcode.width"
        :height="barcode.height"
        :text="barcode.text"
        :fontOptions="barcode.fontOptions"
        :displayValue="barcode.displayValue"
        :background="barcode.background"
        :lineColor="barcode.lineColor"
        :margin="barcode.margin"
      />
    </div>
  </div>
</template>

<script>
// Import the Barcode component from vue3-barcode
import Barcode from "vue3-barcode";

export default {
  components: {
    Barcode, // Register the Barcode component
  },
  data() {
    return {
      // Array of barcode data
      barcodes: [
        {
          code: "123456",
          format: "CODE39",
          width: 2,
          height: 100,
          text: "Barcode 1",
          fontOptions: "bold",
          displayValue: true,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 10,
        },
        {
          code: "789012",
          format: "CODE128",
          width: 2,
          height: 80,
          text: "Barcode 2",
          fontOptions: "italic",
          displayValue: true,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 10,
        },
        // Add more barcode data objects as needed
      ],
    };
  },
};
</script>
