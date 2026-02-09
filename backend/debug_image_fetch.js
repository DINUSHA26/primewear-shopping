async function checkImage() {
    const url = 'http://localhost:5000/uploads/products/1770204599374-690658044.png';
    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        console.log(`Content-Length: ${res.headers.get('content-length')}`);
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}

checkImage();
