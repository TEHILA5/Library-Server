
export const books = [
  {
    id: 1,
    name: "Duplicatim",
    category: "Fantasy",
    price: 80,
    isBorrowed: false,
    borrows: [] 
  },
  {
    id: 2,
    name: "Hitnakshut",
    category: "Voltage",
    price: 120,
    isBorrowed: true,
    borrows: [{ date: "2025-10-20", userId: 101 },]
  },
  {
    id:3,
    name:"Gam Ki Elech",
    category:"Emotion",
    price:100,
    isBorrowed:false,
    borrows:[
        {date:"2025-09-30",userId:100},
        {date:"2025-10-25",userId:102},
    ]
  },
];