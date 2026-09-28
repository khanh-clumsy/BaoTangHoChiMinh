# Bảo tàng Hồ Chí Minh — 2.5D prototype

Prototype React + Three.js theo hướng **interactive 2.5D museum**:

- camera isometric/orthographic;
- click trên sàn để nhân vật tự di chuyển;
- click marker trên scene hoặc pin trên mini map để đi tới hiện vật;
- khi tới nơi tự mở panel thuyết minh;
- đánh dấu các điểm đã khám phá;
- tủ kính và hiện vật đang là low-poly placeholder, có thể thay bằng GLB sau.

## Chạy local

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Cấu trúc

```text
src/
├── components/
│   ├── ExhibitPanel.tsx
│   ├── MapPanel.tsx
│   └── MuseumScene.tsx
├── data/
│   └── exhibits.ts
├── App.tsx
├── main.tsx
├── styles.css
└── types.ts
```

## Thay model thật

Bản v0.1 chưa tái dựng chính xác mặt bằng Bảo tàng Hồ Chí Minh. Khi có model Blender/GLB:

1. đặt model trong `public/models/`;
2. dùng `useGLTF()` trong `MuseumScene.tsx`;
3. giữ nguyên hệ tọa độ X/Z của hotspot hoặc cập nhật `position` + `approach` trong `src/data/exhibits.ts`;
4. có thể thay từng artifact placeholder bằng GLB riêng.

## Nguồn nội dung prototype

Nội dung mô tả được rút gọn từ thông tin công khai trên website Bảo tàng Hồ Chí Minh, gồm: gian long trọng, tổ hợp quê hương - gia đình, các tổ hợp trưng bày thường xuyên, đôi dép cao su và bộ quần áo kaki. Layout 3D trong repo chỉ là graybox minh họa, không tuyên bố là sơ đồ chính xác của bảo tàng ngoài đời.
