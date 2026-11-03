import { Order } from "../types";

export const orders: Order[] = [
  {
    id: "ORD-1028",
    status: "shipping",
    date: "04/06/2026",
    total: 1510000,
    items: 2,
    subtotal: 1510000,
    shippingFee: 0,
    customerName: "Nguyễn Phúc Thành",
    customerPhone: "0901234567",
    shippingAddress: "12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "COD - Thanh toán khi nhận hàng",
    products: [
      {
        id: "2",
        name: "Đầm midi nữ thanh lịch",
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
        color: "Đỏ",
        size: "M",
        price: 890000,
        quantity: 1,
      },
      {
        id: "1",
        name: "Áo sơ mi Oxford nam",
        image:
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=800&fit=crop",
        color: "Trắng",
        size: "M",
        price: 620000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-1019",
    status: "delivered",
    date: "28/05/2026",
    total: 890000,
    items: 1,
    subtotal: 890000,
    shippingFee: 0,
    customerName: "Nguyễn Phúc Thành",
    customerPhone: "0901234567",
    shippingAddress: "12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "COD - Thanh toán khi nhận hàng",
    products: [
      {
        id: "2",
        name: "Đầm midi nữ thanh lịch",
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
        color: "Đen",
        size: "M",
        price: 890000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-1011",
    status: "pending",
    date: "22/05/2026",
    total: 540000,
    items: 1,
    subtotal: 540000,
    shippingFee: 0,
    customerName: "Nguyễn Phúc Thành",
    customerPhone: "0901234567",
    shippingAddress: "12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "COD - Thanh toán khi nhận hàng",
    products: [
      {
        id: "4",
        name: "Quần culottes nữ cạp cao",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
        color: "Kem",
        size: "S",
        price: 540000,
        quantity: 1,
      },
    ],
  },
];
