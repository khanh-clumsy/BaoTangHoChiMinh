# 🏛️ Bảo tàng Hồ Chí Minh 3D / 2.5D — Interactive Experience

Dự án tái hiện không gian tham quan tương tác **Bảo tàng Hồ Chí Minh** theo phong cách **2.5D Isometric & 3D Interactive**, kết hợp thuyết minh lịch sử, âm thanh và các minigame giáo dục văn hóa.

---

## 🚀 Tính năng Nổi bật

- 🎮 **Di chuyển chuẩn MOBA/RPG**: Click chuột trên sàn với hiệu ứng Crosshair/Ping và đường nét đứt chỉ dẫn lộ trình (Guide Path Line).
- 🧭 **Chống đi xuyên tường (A\* Pathfinding)**: Nhân vật tự động tính toán đường đi qua các cửa và hành lang, tránh hoàn toàn vật cản.
- 🔍 **Cinematic Inspect Zoom-in**: Khi tiếp cận hiện vật, camera tự động zoom cận cảnh và hiện vật xoay 360° để người xem quan sát chi tiết.
- 🔒 **Khóa/Mở góc nhìn**: Nút chuyển đổi linh hoạt giữa góc nhìn cố định 2.5D Isometric và chế độ xoay 3D tự do 360°.
- 🗺️ **Interactive Mini-Map & Sổ tay Di sản**: Định vị các phòng trưng bày, theo dõi tiến độ khám phá hiện vật.

---

## 💻 Hướng dẫn Cài đặt & Chạy Dự án

```bash
# Cài đặt thư viện
npm install

# Khởi động server phát triển (Vite)
npm run dev

# Đóng gói sản phẩm (Production build)
npm run build
```

---

## 📁 Cấu trúc Dự án

```text
src/
├── components/
│   ├── MuseumScene.tsx  # Không gian 3D, ánh sáng, bóng đổ, điều khiển camera & người chơi
│   ├── Artifacts.tsx    # Mô hình 3D các hiện vật lịch sử
│   ├── ExhibitPanel.tsx # Panel thuyết minh chi tiết hiện vật
│   └── MapPanel.tsx     # Sơ đồ mini-map tuyến tham quan
├── data/
│   └── exhibits.ts      # Dữ liệu hiện vật, tọa độ không gian và bản đồ
├── utils/
│   └── pathfinding.ts   # Thuật toán A* Pathfinding và kiểm tra va chạm
├── types.ts             # Định nghĩa Type & Interface
├── App.tsx              # Điều phối giao diện và trạng thái chính
├── main.tsx             # Entry point
└── styles.css           # Toàn bộ CSS hệ thống giao diện
```

---

## 🎯 Đề xuất Minigame Lịch sử Tương tác

1. **Hải trình Vượt đại dương 1911**: Tái hiện hải trình tìm đường cứu nước của Bác qua các bến cảng quốc tế.
2. **Phục chế Bút tích & Bản thảo**: Ghép các mảnh ghép tư liệu (Tuyên ngôn Độc lập, Lời kêu gọi toàn quốc kháng chiến) để nghe đoạn audio tư liệu gốc.
3. **Sưu tầm Bộ Kỷ vật Đời thường**: Nhiệm vụ tìm kiếm các kỷ vật giản dị (Đôi dép cao su, Áo kaki, Máy chữ cổ) kèm câu đố lịch sử.
4. **Thử tài Thuyết minh viên Bảo tàng**: Thử thách trả lời câu hỏi và hướng dẫn khách tham quan ảo.
