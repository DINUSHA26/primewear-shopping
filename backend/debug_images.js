async function checkProducts() {
    try {
        const res = await fetch('http://localhost:5000/api/v1/products?limit=100');
        const data = await res.json();

        data.data.forEach(p => {
            console.log(`Product: ${p.name}, Images: ${p.images}`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

checkProducts();
