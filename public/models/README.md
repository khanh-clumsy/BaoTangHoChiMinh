# Models

Đặt model GLB/GLTF của Bảo tàng Hồ Chí Minh tại đây.

Khuyến nghị:
- 1 đơn vị Blender = 1 mét.
- Apply Transform trước khi export.
- Tách model theo scene/zone: exterior.glb, lobby.glb, floor-1.glb, floor-2.glb, floor-3.glb.
- Texture 2K cho kiến trúc chính; 1K hoặc atlas cho props lặp lại.
- Dùng Draco/Meshopt khi model bắt đầu nặng.

Khi đã có model thật, tạo `src/three/MuseumModel.tsx` dùng `useGLTF('/models/...glb')` rồi thay `<MuseumPlaceholder />` trong `Experience.tsx`.
