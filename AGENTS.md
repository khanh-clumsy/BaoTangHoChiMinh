# 🏛️ AI Agent & Developer Guidelines — Bảo tàng Hồ Chí Minh 2.5D / 3D

Tài liệu hướng dẫn phát triển, quy chuẩn mã nguồn và lộ trình tính năng dành cho tất cả thành viên trong nhóm và AI Agent.

---

## 1. ⚠️ Quy tắc Git & Workflow (BẮT BUỘC)
- **KHÔNG TỰ Ý COMMIT & PUSH**: Tuyệt đối không tự động chạy `git commit` hoặc `git push` trừ khi người dùng có yêu cầu rõ ràng bằng lời nhắc.
- Luôn kiểm tra `git status` trước và sau khi thực hiện các tác vụ mã nguồn nếu được yêu cầu.

---

## 2. 🚀 Hướng dẫn Cài đặt & Chạy dự án

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển (Dev server)
npm run dev

# 3. Kiểm tra kiểu dữ liệu và build production
npm run build
```

---

## 3. 📂 Cấu trúc Thư mục Dự án

```text
BaoTangHoChiMinh/
├── public/                  # Assets tĩnh (3D models .glb, textures, audio)
├── src/
│   ├── components/          # React & Three.js components
│   │   ├── MuseumScene.tsx  # Không gian 3D, camera, ánh sáng, floor raycast, controls
│   │   ├── Artifacts.tsx    # Các mẫu hiện vật 3D chi tiết (tượng, dép cao su, kỷ vật,...)
│   │   ├── ExhibitPanel.tsx # Panel chi tiết hiện vật và thuyết minh
│   │   └── MapPanel.tsx     # Sơ đồ mini-map các phòng trưng bày
│   ├── data/
│   │   └── exhibits.ts      # Danh sách dữ liệu hiện vật, tọa độ không gian và tọa độ map
│   ├── utils/
│   │   └── pathfinding.ts   # Thuật toán A* Pathfinding và Collision Avoidance
│   ├── store/               # State management (Zustand)
│   ├── types.ts             # TypeScript interfaces & types chuẩn
│   ├── App.tsx              # Component gốc quản lý layout & routing
│   ├── main.tsx             # Entry point
│   └── styles.css           # Toàn bộ CSS hệ thống giao diện
├── AGENTS.md                # Tài liệu quy chuẩn cho nhóm và Agent
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. 🛠️ Quy chuẩn Kỹ thuật (Technical Guidelines)

### 4.1. Hệ tọa độ 3D & Sàn bảo tàng
- Sàn chính: Kích thước `26m x 30m` trên mặt phẳng XZ (Y = 0).
- Trục X: Ngang `[-12.5, +12.5]`.
- Trục Z: Dọc `[-14.5, +14.5]` (Z dương hướng ra lối vào, Z âm hướng về gian tưởng niệm).
- Góc nhìn Isometric 2.5D mặc định: `Camera: [18, 22, 18]` hướng về `Target: [0, 0, 0]`.

### 4.2. Cách thêm một Hiện vật mới (`Exhibit`)
Mở file `src/data/exhibits.ts` và thêm một object mới tuân thủ interface `Exhibit`:
```typescript
{
  id: 'unique-id',
  index: 7,
  title: 'Tên hiện vật',
  period: 'Mốc thời gian (VD: 1911–1941)',
  zone: 'Tên phòng trưng bày',
  summary: 'Tóm tắt ngắn gọn hiển thị trên thẻ',
  narration: 'Nội dung thuyết minh chi tiết lịch sử',
  kind: 'statue' | 'sandals' | 'document' | 'clothing' | 'heritage' | 'memorial',
  position: [x, 0, z],       // Tọa độ đặt tủ trưng bày trong không gian 3D
  approach: [x_app, z_app],   // Điểm đứng của nhân vật khi tiếp cận xem hiện vật
  map: [percentX, percentY],  // Tọa độ điểm ghim trên mini-map (0% - 100%)
}
```

---

## 5. 🎮 Đề xuất Ý tưởng Minigame Lịch sử Thực tế (Interactive Minigames)

Dưới đây là các ý tưởng minigame mang tính giáo dục lịch sử cao, gắn liền trực tiếp với tư liệu của Bảo tàng Hồ Chí Minh:

### 🧩 Minigame 1: "Hải trình Vượt đại dương 1911" (Hành trình tìm đường cứu nước)
- **Bối cảnh**: Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành rời bến cảng Nhà Rồng trên con tàu Đô đốc Latouche-Tréville.
- **Cách chơi**: 
  - Người chơi điều hướng tàu vượt qua hải trình qua các châu lục: *Sài Gòn ➔ Marseille ➔ London ➔ Boston/New York ➔ Paris ➔ Quảng Châu ➔ Pác Bó (Cao Bằng)*.
  - Tại mỗi điểm dừng chân, trả lời câu hỏi lịch sử ngắn hoặc ghép mảnh ghép tài liệu để mở khóa trang nhật ký hành trình.
- **Phần thưởng**: Mở khóa tư liệu hiếm và huy hiệu *"Hải trình Lịch sử"*.

### 📜 Minigame 2: "Phục chế & Khắc họa Bút tích Lịch sử" (Document Restoration)
- **Bối cảnh**: Bảo tàng lưu giữ rất nhiều bản thảo quý giá (Lời kêu gọi toàn quốc kháng chiến, Tuyên ngôn Độc lập, Bản Di chúc).
- **Cách chơi**:
  - Người chơi dùng chuột tương tác 3D ghép các mảnh ghép bản thảo lịch sử bị phai mờ theo thời gian.
  - Sau khi hoàn thành, hệ thống phát đoạn audio giọng đọc gốc lịch sử của Bác Hồ và hiển thị bản dịch/giải nghĩa chi tiết.

### 🎒 Minigame 3: "Sưu tầm Bộ Kỷ vật Đời thường" (Artifact Scavenger Hunt)
- **Bối cảnh**: Những kỷ vật giản dị gắn liền với cuộc đời Bác (Đôi dép cao su, Bộ quần áo kaki, Chiếc máy chữ cổ, Chiếc quạt lá cọ, Chiếc vali mây).
- **Cách chơi**:
  - Người chơi nhận danh sách manh mối ẩn trong các phòng trưng bày.
  - Điều khiển nhân vật tìm đúng các kỷ vật, giải mã câu đố về hoàn cảnh ra đời của từng kỷ vật.
- **Phần thưởng**: Ghép đủ bộ sưu tập để nhận danh hiệu *"Người gìn giữ Di sản"*.

### 🎙️ Minigame 4: "Thử tài Thuyết minh viên Nhí" (Museum Guide Challenge)
- **Bối cảnh**: Hóa thân thành một hướng dẫn viên tại Bảo tàng Hồ Chí Minh.
- **Cách chơi**:
  - Sau khi tham quan xong các phòng, khách tham quan ảo (NPC) sẽ đưa ra các câu hỏi tình huống thú vị.
  - Người chơi chọn đáp án chính xác để nhận điểm uy tín và chứng nhận Hướng dẫn viên xuất sắc.
