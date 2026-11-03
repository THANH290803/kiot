import { Product } from "../types";

export const categories = ["Tất cả", "Nam", "Nữ", "Trẻ em"];
export const audienceCategories = categories.slice(1);
export const catalogCategories = [
  { id: "men", name: "Nam", parent_id: null },
  { id: "women", name: "Nữ", parent_id: null },
  { id: "kids", name: "Trẻ em", parent_id: null },
  { id: "men-shirts", name: "Áo", parent_id: "men" },
  { id: "men-pants", name: "Quần", parent_id: "men" },
  { id: "men-outerwear", name: "Áo khoác", parent_id: "men" },
  { id: "women-shirts", name: "Áo", parent_id: "women" },
  { id: "women-pants", name: "Quần", parent_id: "women" },
  { id: "women-dresses", name: "Đầm", parent_id: "women" },
  { id: "kids-sets", name: "Set đồ", parent_id: "kids" },
  { id: "kids-pants", name: "Quần", parent_id: "kids" },
  { id: "kids-outerwear", name: "Áo khoác", parent_id: "kids" },
  { id: "kids-dresses", name: "Váy", parent_id: "kids" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Áo sơ mi Oxford nam",
    category: "Nam",
    type: "Áo",
    price: 620000,
    originalPrice: 720000,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=800&fit=crop",
    rating: 4.8,
    reviews: 96,
    colors: ["Trắng", "Xanh", "Đen"],
    sizes: ["M", "L", "XL"],
    stock: 18,
    description:
      "Form regular dễ mặc, chất vải đứng vừa cho đi làm và dạo phố.",
  },
  {
    id: "2",
    name: "Đầm midi nữ thanh lịch",
    category: "Nữ",
    type: "Đầm",
    price: 890000,
    originalPrice: 1050000,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
    rating: 4.9,
    reviews: 132,
    colors: ["Đỏ", "Đen", "Kem"],
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    description:
      "Thiết kế ôm vừa, tôn dáng, dễ phối với giày cao gót hoặc sandal.",
  },
  {
    id: "3",
    name: "Áo khoác bomber nam",
    category: "Nam",
    type: "Áo khoác",
    price: 1290000,
    originalPrice: 1490000,
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&h=800&fit=crop",
    rating: 4.7,
    reviews: 74,
    colors: ["Đen", "Navy", "Rêu"],
    sizes: ["M", "L", "XL"],
    stock: 7,
    description:
      "Chất liệu nhẹ, dễ phối áo thun hoặc sơ mi cho phong cách năng động.",
  },
  {
    id: "4",
    name: "Quần culottes nữ cạp cao",
    category: "Nữ",
    type: "Quần",
    price: 540000,
    originalPrice: 640000,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
    rating: 4.6,
    reviews: 58,
    colors: ["Kem", "Đen", "Nâu"],
    sizes: ["S", "M", "L"],
    stock: 23,
    description:
      "Dáng quần rộng vừa, dễ di chuyển và phù hợp nhiều dáng người.",
  },
  {
    id: "5",
    name: "Set áo thun trẻ em",
    category: "Trẻ em",
    type: "Set đồ",
    price: 360000,
    originalPrice: 420000,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=800&fit=crop",
    rating: 4.8,
    reviews: 88,
    colors: ["Vàng", "Xanh", "Trắng"],
    sizes: ["2Y", "4Y", "6Y"],
    stock: 16,
    description:
      "Chất cotton mềm, thoáng, phù hợp mặc hằng ngày cho bé.",
  },
  {
    id: "6",
    name: "Áo hoodie trẻ em",
    category: "Trẻ em",
    type: "Áo khoác",
    price: 480000,
    originalPrice: 580000,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=800&fit=crop",
    rating: 4.5,
    reviews: 41,
    colors: ["Be", "Nâu", "Xanh"],
    sizes: ["4Y", "6Y", "8Y"],
    stock: 20,
    description:
      "Hoodie mềm, ấm vừa, dễ phối cùng quần jeans hoặc jogger cho bé.",
  },
  {
    id: "7",
    name: "Quần jeans nam slim",
    category: "Nam",
    type: "Quần",
    price: 760000,
    originalPrice: 890000,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop",
    rating: 4.7,
    reviews: 64,
    colors: ["Xanh", "Đen", "Xám"],
    sizes: ["M", "L", "XL"],
    stock: 12,
    description:
      "Dáng slim gọn, co giãn nhẹ, phù hợp đi làm lẫn cuối tuần.",
  },
  {
    id: "8",
    name: "Áo blouse nữ tay bồng",
    category: "Nữ",
    type: "Áo",
    price: 520000,
    originalPrice: 620000,
    image:
      "https://images.unsplash.com/photo-1564257631407-3deb25e9c8e0?w=800&h=800&fit=crop",
    rating: 4.8,
    reviews: 71,
    colors: ["Trắng", "Be", "Hồng"],
    sizes: ["S", "M", "L"],
    stock: 15,
    description:
      "Chất vải mềm, tay bồng nhẹ, dễ phối cùng chân váy hoặc quần jeans.",
  },
  {
    id: "9",
    name: "Quần jogger trẻ em",
    category: "Trẻ em",
    type: "Quần",
    price: 390000,
    originalPrice: 460000,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=800&fit=crop",
    rating: 4.6,
    reviews: 39,
    colors: ["Xám", "Navy", "Be"],
    sizes: ["2Y", "4Y", "6Y"],
    stock: 18,
    description:
      "Jogger mềm, lưng thun thoải mái, hợp cho bé vận động cả ngày.",
  },
  {
    id: "10",
    name: "Váy cotton trẻ em",
    category: "Trẻ em",
    type: "Váy",
    price: 430000,
    originalPrice: 520000,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=800&fit=crop",
    rating: 4.7,
    reviews: 45,
    colors: ["Hồng", "Trắng", "Vàng"],
    sizes: ["2Y", "4Y", "6Y"],
    stock: 11,
    description:
      "Váy cotton nhẹ, thoáng, phù hợp đi chơi hoặc mặc hằng ngày.",
  },
];

export const categoryGroups = catalogCategories
  .filter((category) => category.parent_id === null)
  .map((parentCategory) => {
    const categoryProducts = products.filter((product) => product.category === parentCategory.name);
    const childCategories = catalogCategories.filter(
      (category) => category.parent_id === parentCategory.id,
    );
    const types = childCategories
      .filter((category) => categoryProducts.some((product) => product.type === category.name))
      .map((category) => ({
        type: category.name,
        count: categoryProducts.filter((product) => product.type === category.name).length,
      }));

    return {
      category: parentCategory.name,
      count: categoryProducts.length,
      types,
    };
  });
