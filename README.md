# Bảo tàng Hồ Chí Minh 3D — Three.js Starter

Starter React + React Three Fiber cho một website bảo tàng 3D theo mô-típ:
- màn hình mở đầu;
- WASD + mouse look;
- điều hướng nhanh giữa Sảnh Chính / Phòng 1 / 2 / 3;
- guided tour;
- ngày/đêm;
- counter 00/15;
- 15 hotspot có thể tìm và tương tác;
- modal nội dung;
- physics/collision cơ bản.

> Quan trọng: kiến trúc trong starter là **graybox kỹ thuật**, không phải bản sao Bảo tàng Hồ Chí Minh ngoài đời. Thay nó bằng GLB dựng từ reference thật trước khi demo môn học.

## Stack

- React 19 + TypeScript + Vite
- Three.js
- React Three Fiber
- Drei
- Rapier physics
- Zustand

## Chạy local

```bash
npm install
npm run dev
```

Mở URL mà Vite in ra, thường là `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Đẩy GitHub

```bash
git init
git add .
git commit -m "chore: bootstrap HCM museum 3D core"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Deploy Vercel

- Import repo GitHub vào Vercel.
- Framework Preset: Vite.
- Build Command: `npm run build`.
- Output Directory: `dist`.

## Controls

- `W/A/S/D`: di chuyển
- `Shift`: đi nhanh
- Mouse: nhìn xung quanh
- `E`: tương tác khi đứng gần hotspot
- `ESC`: thoát pointer lock

## Cấu trúc

```text
src/
├─ components/          # HUD, intro, modal, loading
├─ data/                # rooms, hotspots/exhibits
├─ store/               # Zustand app state
├─ three/
│  ├─ Experience.tsx    # Canvas + lights + physics + scene composition
│  ├─ MuseumPlaceholder.tsx
│  ├─ Player.tsx
│  ├─ GuidedTour.tsx
│  └─ TreasureMarker.tsx
├─ App.tsx
├─ main.tsx
└─ styles.css
```

## Thay graybox bằng Bảo tàng Hồ Chí Minh thật

1. Khảo sát/chụp reference thực tế và lấy floor plan đáng tin cậy.
2. Dựng Blender đúng scale, 1 unit = 1 mét.
3. Export GLB vào `public/models/`.
4. Tạo component `MuseumModel.tsx` dùng `useGLTF`.
5. Thay `<MuseumPlaceholder />` trong `Experience.tsx`.
6. Tạo collider low-poly riêng; không nên dùng trực tiếp toàn bộ mesh chi tiết làm collider.
7. Đổi `ROOM_SPAWNS`, `TOUR_POINTS`, `TREASURES.position` theo tọa độ model thật.

## Contract nên khóa trước khi chia team

- Coordinate: Y-up, mét.
- Tên room/zone cố định.
- GLB origin thống nhất.
- Hotspot data-driven, không hard-code từng hiện vật thành component riêng.
- Người làm Blender không sửa code core; người làm nội dung chủ yếu sửa data; người làm game/UI dùng Zustand/actions có sẵn.
