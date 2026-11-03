export type WardOption = {
  name: string;
};

export type DistrictOption = {
  name: string;
  wards: WardOption[];
};

export type ProvinceOption = {
  name: string;
  districts: DistrictOption[];
};

export const addressOptions: ProvinceOption[] = [
  {
    name: "TP. Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        wards: [
          { name: "Phường Bến Nghé" },
          { name: "Phường Bến Thành" },
          { name: "Phường Nguyễn Thái Bình" },
        ],
      },
      {
        name: "Quận 3",
        wards: [
          { name: "Phường Võ Thị Sáu" },
          { name: "Phường 11" },
          { name: "Phường 12" },
        ],
      },
      {
        name: "Thành phố Thủ Đức",
        wards: [
          { name: "Phường Thảo Điền" },
          { name: "Phường An Phú" },
          { name: "Phường Linh Trung" },
        ],
      },
    ],
  },
  {
    name: "Hà Nội",
    districts: [
      {
        name: "Quận Hoàn Kiếm",
        wards: [
          { name: "Phường Hàng Bạc" },
          { name: "Phường Hàng Trống" },
          { name: "Phường Tràng Tiền" },
        ],
      },
      {
        name: "Quận Ba Đình",
        wards: [
          { name: "Phường Điện Biên" },
          { name: "Phường Đội Cấn" },
          { name: "Phường Kim Mã" },
        ],
      },
    ],
  },
  {
    name: "Đà Nẵng",
    districts: [
      {
        name: "Quận Hải Châu",
        wards: [
          { name: "Phường Hải Châu I" },
          { name: "Phường Hải Châu II" },
          { name: "Phường Thạch Thang" },
        ],
      },
      {
        name: "Quận Sơn Trà",
        wards: [
          { name: "Phường An Hải Bắc" },
          { name: "Phường An Hải Đông" },
          { name: "Phường Phước Mỹ" },
        ],
      },
    ],
  },
];
