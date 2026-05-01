async function test() {
  try {
    // 1. Register
    const email = "test" + Date.now() + "@test.com";
    const regRes = await fetch("http://localhost:3005/auth/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "TestUser",
        email: email,
        password: "password123"
      })
    });
    console.log("Register:", regRes.status, await regRes.text());

    // 2. Login
    const loginRes = await fetch("http://localhost:3005/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: "password123"
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login:", loginRes.status);

    // 3. Get products to find an ID
    const prodRes = await fetch("http://localhost:3005/products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const prodData = await prodRes.json();
    
    if (!prodData.products || prodData.products.length === 0) {
      console.log("No products found to review");
      return;
    }
    const productId = prodData.products[0]._id || prodData.products[0].id;
    console.log("Product ID:", productId);

    // 4. Submit review
    const reviewRes = await fetch(`http://localhost:3005/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: 4,
        comment: "Great product!"
      })
    });
    console.log("Review response status:", reviewRes.status);
    console.log("Review response data:", await reviewRes.text());

  } catch (err) {
    console.log("Error:", err);
  }
}

test();
