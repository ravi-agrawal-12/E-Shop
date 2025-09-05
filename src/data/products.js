const products = [
  {
    id: 1,
    title: "Active JR",
    price: "$64.00",
    image: "https://picsum.photos/seed/shoes1/400/300",
  },
  {
    id: 2,
    title: "Bio Original",
    price: "$119.00",
    image: "https://picsum.photos/seed/shoes2/400/300",
  },
  {
    id: 3,
    title: "Bio Platform",
    price: "$99.00",
    image: "https://picsum.photos/seed/shoes3/400/300",
  },
  {
    id: 4,
    title: "Limited DL",
    price: "$129.00",
    image: "https://picsum.photos/seed/shoes4/400/300",
  },
  {
    id: 5,
    title: "Runner X",
    price: "$149.00",
    image: "https://picsum.photos/seed/shoes5/400/300",
  },
];

// Generate more products dynamically
for (let i = 6; i <= 50; i++) {
  products.push({
    id: i,
    title: `Product ${i}`,
    price: `$${(50 + i * 3).toFixed(2)}`,
    image: `https://picsum.photos/seed/shoes${i}/400/300`,
  });
}

export default products;
