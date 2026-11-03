import { UserProfile } from "../types";

export const initialProfile: UserProfile = {
  name: "Nguyễn Phúc Thành",
  email: "customer@example.com",
  phone: "0901234567",
  province: "TP. Hồ Chí Minh",
  district: "Quận 1",
  ward: "Phường Bến Nghé",
  detailAddress: "12 Nguyễn Huệ",
};

export function formatProfileAddress(profile: UserProfile) {
  return [
    profile.detailAddress,
    profile.ward,
    profile.district,
    profile.province,
  ]
    .filter(Boolean)
    .join(", ");
}
