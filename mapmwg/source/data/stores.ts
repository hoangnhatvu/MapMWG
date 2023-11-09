export interface StoreData {
  id: string;
  name: string;
  coordinates: [number, number];
  address: string;
}

export const storesData: readonly StoreData[] = [
  {
    id: '1',
    name: 'Bách hóa XANH 195 Hoàng Hữu Nam',
    coordinates: [106.813339, 10.858243],
    address: "195 Hoàng Hữu Nam",
  },
  {
    id: '2',
    name: 'Bách hóa XANH 94 Linh Trung',
    coordinates: [106.772149, 10.860582],
    address: "94 Linh Trung",
  },
  {
    id: '3',
    name: 'Bách hóa XANH 153 Tân Lập 2',
    coordinates: [106.781742, 10.849015],
    address: '153 Tân Lập 2',
  },
  {
    id: '4',
    name: 'Bách hóa XANH 142 Lê Văn Việt',
    coordinates: [106.780460, 10.844768],
    address: '142 Lê Văn Việt',
  },
  {
    id: '5',
    name: 'Bách hóa XANH 227 Đình Phong Phú',
    coordinates: [106.783911, 10.832488],
    address: '227 Đình Phong Phú',
  },

];
