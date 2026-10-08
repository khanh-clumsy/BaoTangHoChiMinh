import type { DiscoveryStep } from '../types'

// Bộ câu hỏi tổng hợp dựa trên các chuyên đề chính thống của Bảo tàng Hồ Chí Minh
// và hochiminh.vn về độc lập, vì dân, đại đoàn kết, đạo đức cách mạng và học tập
// theo Bác. Đây là nội dung giáo dục khái quát, không thay thế chú thích hiện vật.
export const thoughtReviewQuestions: DiscoveryStep[] = [
  {
    id: 'independence-for-people',
    title: 'Câu 1 · Độc lập gắn với hạnh phúc',
    prompt: 'Theo tư tưởng Hồ Chí Minh, giá trị của độc lập dân tộc phải hướng tới điều gì?',
    options: ['Để nhân dân được tự do, có cuộc sống ấm no và hạnh phúc', 'Chỉ để mở rộng lãnh thổ quốc gia', 'Chỉ để phát triển kinh tế mà không cần quan tâm con người', 'Để một nhóm người có nhiều quyền lực hơn'],
    answer: 0,
    explanation: 'Đúng. Độc lập phải gắn với tự do, đời sống ấm no và hạnh phúc thực tế của nhân dân.',
  },
  {
    id: 'great-unity',
    title: 'Câu 2 · Sức mạnh đoàn kết',
    prompt: 'Nền tảng của đại đoàn kết theo tư tưởng Hồ Chí Minh là gì?',
    options: ['Lợi ích chung của dân tộc, tôn trọng và tập hợp rộng rãi nhân dân', 'Chỉ tập hợp những người cùng một nghề nghiệp', 'Buộc mọi người phải có cùng một cách suy nghĩ', 'Tách đoàn kết dân tộc khỏi đoàn kết quốc tế'],
    answer: 0,
    explanation: 'Đúng. Đại đoàn kết cần rộng rãi, lâu dài, dựa trên lợi ích chung và sự tôn trọng lẫn nhau.',
  },
  {
    id: 'people-state',
    title: 'Câu 3 · Nhà nước vì dân',
    prompt: 'Nhà nước “của dân, do dân, vì dân” đặt nhân dân ở vị trí nào?',
    options: ['Nhân dân là chủ thể, là nền tảng và là mục tiêu phục vụ của Nhà nước', 'Nhân dân chỉ là người thực hiện mệnh lệnh', 'Nhân dân chỉ tham gia vào hoạt động văn hóa', 'Nhân dân không có quyền giám sát công việc chung'],
    answer: 0,
    explanation: 'Đúng. Tư tưởng vì dân yêu cầu quyền lực và hoạt động của Nhà nước phải hướng tới lợi ích chính đáng của nhân dân.',
  },
  {
    id: 'revolutionary-ethics',
    title: 'Câu 4 · Đạo đức cách mạng',
    prompt: 'Nhóm phẩm chất nào được Hồ Chí Minh nhấn mạnh trong rèn luyện đạo đức?',
    options: ['Cần, kiệm, liêm, chính, chí công vô tư', 'Danh vọng, quyền lực, hưởng thụ, cạnh tranh, thắng lợi', 'Im lặng, phục tùng, thành tích, hình thức, khen thưởng', 'Giàu có, nổi tiếng, nhanh chóng, riêng tư, khép kín'],
    answer: 0,
    explanation: 'Đúng. Đây là hệ phẩm chất gắn với trách nhiệm, liêm chính và đặt việc công, lợi ích chung lên trước.',
  },
  {
    id: 'learning-action',
    title: 'Câu 5 · Học đi đôi với hành',
    prompt: 'Cách học nào phù hợp nhất với phương pháp Hồ Chí Minh?',
    options: ['Gắn học tập với thực tiễn, lắng nghe nhân dân và biến hiểu biết thành hành động', 'Chỉ ghi nhớ lý thuyết, không cần kiểm nghiệm', 'Chỉ học khi có người giao nhiệm vụ', 'Học để có thành tích cá nhân, không cần chia sẻ'],
    answer: 0,
    explanation: 'Đúng. Người coi trọng học từ thực tiễn, nhân dân và luôn chuyển tri thức thành việc làm có ích.',
  },
]
