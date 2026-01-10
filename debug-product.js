
// Native fetch

async function debugProduct() {
    try {
        console.log("Fetching http://localhost:3000/api/v1/products/2...");
        const res = await fetch('http://localhost:3000/api/v1/products/2');
        if (!res.ok) {
            console.error("Status:", res.status);
            console.error("Text:", await res.text());
            return;
        }
        const json = await res.json();
        // Check fields
        const data = json.data || json;
        console.log("Category ID:", data.category ? data.category.id : "No Category");

        if (data.category && data.category.id) {
            console.log(`Fetching related for category ${data.category.id}...`);
            const related = await fetch(`http://localhost:3000/api/v1/products?category_id=${data.category.id}&limit=4`);
            const relatedText = await related.text();
            console.log("Related Products Response:", relatedText.substring(0, 500)); // Log first 500 chars (could be large)
        } else {
            console.log("No category ID found.");
        }

        console.log("Vehicle Fitment present:", !!data.vehicle_fitment || !!data.vehicleFitment);
        console.log("Specs present:", !!data.specifications);
    } catch (err) {
        console.error("Error:", err);
    }
}

debugProduct();
