async function checkTrouser() {
    try {
        const res = await fetch('http://localhost:5000/api/v1/products?limit=100');
        const data = await res.json();

        const trousers = data.data.filter(p => p.name.toLowerCase().includes('trouser'));
        trousers.forEach(p => {
            console.log(`Product: ${p.name}, Images: ${JSON.stringify(p.images)}`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

checkTrouser();
