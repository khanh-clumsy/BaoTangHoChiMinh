import type { Exhibit } from '../types'

// Nội dung prototype dựa trên các mô tả công khai của Bảo tàng Hồ Chí Minh.
// Geometry và vị trí trong bản đồ này là mô phỏng, chưa phải digital twin chính xác.
export const exhibits: Exhibit[] = [
  {
    id: 'grand-hall-statue',
    index: 1,
    title: 'Tượng Chủ tịch Hồ Chí Minh',
    period: 'Gian long trọng',
    zone: 'Sảnh trung tâm',
    summary: 'Điểm mở đầu của hành trình tham quan.',
    narration:
      'Gian long trọng mở đầu hệ thống trưng bày. Trung tâm là tượng đồng Chủ tịch Hồ Chí Minh cao 3,5 mét, phía sau có hình tượng mặt trời và cây đa.',
    kind: 'statue',
    position: [0, 0, 5.8],
    approach: [0, 8.1],
    map: [50, 20],
  },
  {
    id: 'homeland-family',
    index: 2,
    title: 'Quê hương và gia đình',
    period: '1890–1911',
    zone: 'Không gian Làng Sen',
    summary: 'Không gian gợi lại quê hương và tuổi thơ.',
    narration:
      'Tổ hợp quê hương, gia đình tái hiện hình ảnh Làng Sen và những đồ dùng gắn với gia đình như giường, khung cửi, bàn ghế, giá sách và các vật dụng sinh hoạt.',
    kind: 'heritage',
    position: [-6.4, 0, 1.5],
    approach: [-3.9, 1.5],
    map: [23, 40],
  },
  {
    id: 'journey-documents',
    index: 3,
    title: 'Tư liệu hành trình',
    period: '1911–1941',
    zone: 'Tuyến tiểu sử',
    summary: 'Tủ kính tư liệu về hành trình hoạt động ở nước ngoài.',
    narration:
      'Prototype dùng một tủ kính số hóa để kể hành trình qua ảnh, tư liệu và bút tích. Khi có tư liệu ảnh chính thức, phần này có thể thay trực tiếp bằng texture hoặc slideshow.',
    kind: 'document',
    position: [6.4, 0, 1.5],
    approach: [3.9, 1.5],
    map: [77, 40],
  },
  {
    id: 'rubber-sandals',
    index: 4,
    title: 'Đôi dép cao su',
    period: 'Kỷ vật đời thường',
    zone: 'Tủ hiện vật',
    summary: 'Một kỷ vật được Bảo tàng Hồ Chí Minh giới thiệu trong trưng bày.',
    narration:
      'Bảo tàng Hồ Chí Minh cho biết đôi dép cao su Chủ tịch Hồ Chí Minh từng sử dụng hiện được trưng bày tại bảo tàng. Trong prototype, hiện vật được mô hình hóa tối giản bên trong tủ kính.',
    kind: 'sandals',
    position: [-6.4, 0, -5.2],
    approach: [-3.9, -5.2],
    map: [23, 68],
  },
  {
    id: 'khaki-outfit',
    index: 5,
    title: 'Bộ quần áo kaki',
    period: '1959',
    zone: 'Tủ hiện vật',
    summary: 'Kỷ vật gắn với chuyến thăm Xí nghiệp May 10.',
    narration:
      'Bảo tàng lưu giữ bộ quần áo kaki gắn với sự kiện Chủ tịch Hồ Chí Minh thăm Xí nghiệp May 10 vào mùa xuân năm 1959. Bản dựng 3D ở đây chỉ là hình tượng minh họa.',
    kind: 'clothing',
    position: [6.4, 0, -5.2],
    approach: [3.9, -5.2],
    map: [77, 68],
  },
  {
    id: 'memorial-space',
    index: 6,
    title: 'Gian tưởng niệm',
    period: 'Điểm cuối tuyến',
    zone: 'Không gian tưởng niệm',
    summary: 'Điểm kết thúc của tuyến tham quan prototype.',
    narration:
      'Trưng bày thường xuyên của Bảo tàng Hồ Chí Minh có một tổ hợp gian tưởng niệm. Prototype dùng điểm này để khép lại tuyến tham quan và mở phần tổng kết hoặc quiz.',
    kind: 'memorial',
    position: [0, 0, -10.5],
    approach: [0, -8.0],
    map: [50, 90],
  },
]
