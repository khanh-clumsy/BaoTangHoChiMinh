import type { Exhibit } from '../types'

// Danh sách các hiện vật 3D thực tế của Bảo tàng Hồ Chí Minh với tỷ lệ và góc dựng chuẩn xác
export const exhibits: Exhibit[] = [
  {
    id: 'grand-hall-statue',
    index: 1,
    title: 'Tượng Chủ tịch Hồ Chí Minh Toàn Thân',
    period: 'Gian Long Trọng',
    zone: 'Sảnh Trung Tâm',
    summary: 'Tác phẩm điêu khắc toàn thân Chủ tịch Hồ Chí Minh uy nghiêm tại gian mở đầu bảo tàng.',
    narration:
      'Gian long trọng mở đầu hệ thống trưng bày với tượng đồng Chủ tịch Hồ Chí Minh toàn thân cao 3,5 mét. Phía sau tượng là biểu tượng mặt trời tỏa sáng và cây đa đại thụ, biểu trưng cho sự nghiệp vĩ đại của Người soi rọi con đường giải phóng dân tộc.',
    historicalContext:
      'Đây là điểm khởi đầu của cuộc tham quan: từ một con người cụ thể đến một hành trình lịch sử rộng lớn. Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành với tên Văn Ba rời Bến Nhà Rồng, mang theo lòng yêu nước và quyết tâm tìm con đường cứu đồng bào.',
    keyIdea:
      'Tư tưởng nổi bật là độc lập dân tộc phải gắn với quyền sống, quyền tự do và hạnh phúc của nhân dân; người lãnh đạo phải đặt lợi ích của Tổ quốc và nhân dân lên trước lợi ích riêng.',
    reflectionQuestion: 'Nếu bắt đầu một hành trình lớn như Nguyễn Tất Thành, em sẽ chuẩn bị hành trang tinh thần nào?',
    reflectionAnswer:
      'Không chỉ là lòng dũng cảm, hành trang ấy còn là mục tiêu vì con người, năng lực học hỏi và khả năng tự suy nghĩ trước những vấn đề của thời đại.',
    audioText:
      'Điểm dừng đầu tiên là tượng Chủ tịch Hồ Chí Minh toàn thân. Hãy xem đây như lời mở đầu cho một hành trình: ngày 5 tháng 6 năm 1911, người thanh niên Nguyễn Tất Thành, với tên Văn Ba, rời Bến Nhà Rồng để tìm đường cứu nước. Điều Người tìm kiếm không phải danh vọng cho riêng mình, mà là con đường đem lại độc lập cho dân tộc và tự do, hạnh phúc cho nhân dân. Khi ngắm tượng, hãy tự hỏi: một lý tưởng lớn bắt đầu từ đâu? Với Hồ Chí Minh, nó bắt đầu từ lòng yêu nước, thương dân và ý chí học hỏi không ngừng.',
    kind: 'statue',
    modelPath: '/models/tuong_bac_ho_toan_than.glb',
    targetHeight: 1.85,
    rotation: [0, 0, 0],
    modelOffsetY: 0.02,
    position: [0, 0, 7.5],
    approach: [0, 9.8],
    map: [50, 18],
  },
  {
    id: 'bust-statue',
    index: 2,
    title: 'Bộ Sưu Tập Kỷ Vật Đời Thường Của Bác Hồ',
    period: '1911–1969 · Kỷ vật đời thường',
    zone: 'Không Gian Đời Thường',
    summary: 'Cụm trưng bày các vật dụng giản dị gắn với sinh hoạt, lao động, rèn luyện và phong cách sống gần gũi của Chủ tịch Hồ Chí Minh.',
    narration:
      'Cụm trưng bày giới thiệu những kỷ vật đời thường gắn với Chủ tịch Hồ Chí Minh: đôi guốc mộc, chiếc gậy song, quạt lá cọ, máy đánh chữ, bút, thước, hòn đá chặn giấy và dụng cụ tập thể dục. Những vật dụng không cầu kỳ nhưng giúp người xem nhận ra một phong cách sống giản dị, tự rèn luyện và gần gũi với nhân dân.',
    documentContent:
      'Bộ sưu tập còn gợi mở các bản thảo và sách từng gắn với hoạt động viết, đọc, làm việc của Người. Khi quan sát, hãy phân biệt đâu là đồ dùng sinh hoạt, đâu là công cụ làm việc và đâu là tư liệu chữ viết; mỗi nhóm hiện vật cho thấy một mặt của đời sống và phương pháp hoạt động của Bác.',
    historicalContext:
      'Kỷ vật đời thường không tách khỏi lịch sử. Từ hành trình ra đi tìm đường cứu nước đến những năm tháng lãnh đạo cách mạng, các vật dụng bên cạnh Người phản ánh sự bền bỉ, tiết chế và tinh thần làm việc vì Tổ quốc, vì nhân dân.',
    keyIdea:
      'Tư tưởng và đạo đức được thể hiện qua việc nhỏ hằng ngày: sống giản dị, quý trọng của công, tự rèn luyện, làm việc có phương pháp và luôn giữ mối liên hệ với nhân dân.',
    reflectionQuestion: 'Vì sao những vật dụng giản dị có thể giúp ta hiểu tư tưởng và phong cách Hồ Chí Minh?',
    reflectionAnswer:
      'Vì hiện vật làm cho phẩm chất trở nên cụ thể: sự giản dị, cần kiệm, tự rèn luyện và tinh thần làm việc vì lợi ích chung được thể hiện trong chính nếp sống hằng ngày.',
    audioText:
      'Đây là bộ sưu tập những vật dụng rất đỗi bình dị quanh Chủ tịch Hồ Chí Minh. Một đôi guốc, chiếc quạt lá cọ, cây bút hay chiếc máy đánh chữ đều gợi nhắc nếp sống giản dị và tinh thần làm việc bền bỉ của Người. Hãy quan sát từng nhóm hiện vật và tự hỏi: làm thế nào một lựa chọn nhỏ trong đời sống lại có thể phản ánh một quan niệm lớn về cần, kiệm, trách nhiệm và phụng sự nhân dân?',
    discoverySteps: [
      {
        id: 'everyday-relics',
        title: 'Bước 1 · Nhận diện kỷ vật',
        prompt: 'Nhóm nào phù hợp nhất với bộ sưu tập trong cụm trưng bày?',
        options: ['Đồ dùng đời thường, công cụ làm việc và tư liệu gắn với Bác Hồ', 'Chỉ gồm vũ khí quân sự', 'Chỉ gồm bản đồ các châu lục', 'Chỉ gồm các tác phẩm hội họa hiện đại'],
        answer: 0,
        explanation: 'Đúng. Cụm trưng bày tập hợp nhiều kỷ vật đời thường và tư liệu gắn với sinh hoạt, công việc của Người.',
      },
      {
        id: 'simple-lifestyle',
        title: 'Bước 2 · Đọc từ hiện vật',
        prompt: 'Bài học nổi bật nào có thể rút ra từ những vật dụng giản dị?',
        options: ['Sống giản dị, cần kiệm và có trách nhiệm với việc chung', 'Coi trọng sự xa hoa hơn hiệu quả công việc', 'Tách đời sống cá nhân khỏi đạo đức', 'Chỉ chú ý đến giá trị vật chất của hiện vật'],
        answer: 0,
        explanation: 'Đúng. Kỷ vật giúp liên hệ nếp sống giản dị với đạo đức và phong cách Hồ Chí Minh.',
      },
    ],
    kind: 'heritage',
    modelPath: '/models/bo_suu_tap_bac_ho.glb',
    targetHeight: 1.85,
    rotation: [0, 0, 0],
    modelOffsetY: 0.02,
    position: [0, 0, 1.8],
    approach: [0, 4.0],
    map: [50, 36],
  },
  {
    id: 'french-branch',
    index: 3,
    title: 'Gian Trưng Bày Chi Bộ Đảng & Kỷ Vật Kháng Chiến',
    period: '1920 – 1923',
    zone: 'Tuyến Hoạt Động Quốc Tế',
    summary: 'Không gian tư liệu vách ảnh và tủ kính hiện vật tái hiện hành trình hoạt động cách mạng quốc tế của Bác.',
    narration:
      'Mô hình 3D số hóa nguyên bản gian trưng bày tại Bảo tàng. Phía trên là vách ảnh tư liệu lịch sử thời kỳ Nguyễn Ái Quốc tham gia Đại hội Tours và sáng lập Đảng Cộng sản Pháp (12/1920), phía dưới là hệ thống tủ kính lưu giữ các kỷ vật, tư liệu và vũ khí kháng chiến quý giá.',
    historicalContext:
      'Sau những năm quan sát thế giới và hoạt động trong phong trào công nhân, Nguyễn Ái Quốc đến với chủ nghĩa Mác - Lênin và tham gia Đại hội Tours tháng 12/1920. Từ đây, lòng yêu nước được soi sáng bởi một lý luận cách mạng và gắn với phong trào giải phóng các dân tộc thuộc địa.',
    keyIdea:
      'Giải phóng dân tộc cần có tổ chức, đường lối và sức mạnh đoàn kết của nhân dân; độc lập không tách rời tinh thần đoàn kết quốc tế của những người bị áp bức.',
    reflectionQuestion: 'Theo em, vì sao lòng yêu nước cần đi cùng tri thức và tổ chức?',
    reflectionAnswer:
      'Lòng yêu nước tạo động lực, còn tri thức giúp nhìn đúng con đường và tổ chức giúp biến khát vọng của cá nhân thành sức mạnh của cộng đồng.',
    audioText:
      'Gian trưng bày này đánh dấu một bước chuyển quan trọng trong hành trình của Nguyễn Ái Quốc. Sau khi quan sát thực tế ở nhiều nơi, Người tiếp cận chủ nghĩa Mác - Lênin và tham gia Đại hội Tours vào tháng 12 năm 1920. Lòng yêu nước từ đây gắn với một nhận thức mới về lực lượng và con đường cách mạng. Bài học của hiện vật không chỉ nằm ở một sự kiện, mà còn ở cách Người kết hợp trải nghiệm thực tế, tư duy độc lập và tổ chức quần chúng để hướng tới mục tiêu giải phóng dân tộc.',
    kind: 'heritage',
    modelPath: '/models/chi_bo_dang_cong_san_phap.glb',
    targetHeight: 1.95,
    rotation: [0, Math.PI / 2, 0],
    modelOffsetY: 0.02,
    position: [-8.9, 0, 4.0],
    approach: [-5.0, 4.0],
    map: [22, 30],
  },
  {
    id: 'letter-workers',
    index: 4,
    title: 'Thư gửi Công nhân và Cán bộ Mỏ Apatit Lào Cai',
    period: 'Tháng 1 năm 1959 · Xây dựng miền Bắc',
    zone: 'Tư Liệu Bút Tích',
    summary: 'Bút tích bức thư Bác Hồ gửi công nhân và cán bộ mỏ Apatit Lào Cai, động viên phong trào thi đua hoàn thành vượt mức kế hoạch 10%.',
    narration:
      'Mô hình số hóa tái hiện bút tích bức thư Chủ tịch Hồ Chí Minh gửi công nhân và cán bộ mỏ Apatit Lào Cai vào tháng 1 năm 1959. Bác vui mừng khen tập thể đã giữ đúng lời hứa, thi đua hoàn thành vượt mức kế hoạch 10%, đồng thời mong mọi người tiếp tục hoàn thành vượt mức kế hoạch năm đó. Bác cũng hỏi thăm các chuyên gia và chúc công nhân, cán bộ đoàn kết chặt chẽ, tiến bộ nhiều. Đây là hiện vật tiêu biểu cho phong trào thi đua lao động trong giai đoạn xây dựng miền Bắc sau hòa bình lập lại.',
    historicalContext:
      'Sau Hiệp định Genève, miền Bắc bước vào thời kỳ khôi phục và xây dựng. Mỏ Apatit Lào Cai là một cơ sở công nghiệp quan trọng; bức thư ghi nhận thành tích của công nhân, cán bộ và sự đóng góp của các chuyên gia.',
    keyIdea:
      'Tư tưởng nổi bật là thi đua gắn với lời hứa, đoàn kết gắn với tiến bộ và thành tích gắn với trách nhiệm tiếp tục phấn đấu. Xây dựng miền Bắc cũng là chuẩn bị cơ sở cho sự nghiệp thống nhất nước nhà.',
    reflectionQuestion: 'Một bức thư gửi công nhân có thể liên quan thế nào đến hành trình tìm đường cứu nước?',
    reflectionAnswer:
      'Hành trình cứu nước không dừng ở ngày giành chính quyền. Nó tiếp tục bằng việc khôi phục sản xuất, xây dựng miền Bắc và tạo nền tảng cho một nước Việt Nam độc lập, thống nhất, có đời sống tốt hơn cho nhân dân.',
    audioText:
      'Đây là bút tích thư Chủ tịch Hồ Chí Minh gửi công nhân và cán bộ mỏ Apatit Lào Cai vào tháng 1 năm 1959. Bác khen tập thể đã thi đua hoàn thành vượt mức kế hoạch 10%, mong tiếp tục cố gắng, hỏi thăm các chuyên gia và chúc mọi người đoàn kết, tiến bộ. Hiện vật cho thấy một nội dung quan trọng trong tư tưởng của Người: thành tích phải đi cùng khiêm tốn, đoàn kết và nỗ lực bền bỉ. Từ hành trình ra đi năm 1911 đến công cuộc xây dựng miền Bắc, mục tiêu cuối cùng vẫn là độc lập, thống nhất và cuộc sống tốt đẹp hơn cho nhân dân.',
    discoverySteps: [
      {
        id: 'identify-letter',
        title: 'Bước 1 · Nhận diện tư liệu',
        prompt: 'Bức thư được gửi tới tập thể nào?',
        options: ['Công nhân và cán bộ mỏ Apatit Lào Cai', 'Học sinh một trường phổ thông', 'Các chiến sĩ trên mặt trận Điện Biên Phủ', 'Nông dân một hợp tác xã'],
        answer: 0,
        explanation: 'Đúng. Đây là thư Bác Hồ gửi công nhân và cán bộ mỏ Apatit Lào Cai.',
      },
      {
        id: 'find-date',
        title: 'Bước 2 · Đặt vào dòng thời gian',
        prompt: 'Bức thư được gửi vào thời điểm nào?',
        options: ['Tháng 1 năm 1959', '07/09/1968', '05/06/1911', '02/09/1945'],
        answer: 0,
        explanation: 'Đúng. Bức thư được viết vào tháng 1 năm 1959 và được lưu tại Bảo tàng Hồ Chí Minh.',
      },
      {
        id: 'understand-achievement',
        title: 'Bước 3 · Đọc thành tích',
        prompt: 'Điều gì khiến Bác gửi lời khen tới mỏ Apatit Lào Cai?',
        options: ['Công nhân thi đua hoàn thành vượt mức kế hoạch 10%', 'Mỏ mở thêm một tuyến du lịch', 'Mỏ nhận được viện trợ từ nước ngoài', 'Mỏ chuyển toàn bộ sang khai thác thủ công'],
        answer: 0,
        explanation: 'Đúng. Bác khen các cô, các chú đã làm đúng lời hứa và thi đua hoàn thành vượt mức kế hoạch 10%.',
      },
      {
        id: 'learn-from-advice',
        title: 'Bước 4 · Hiểu lời căn dặn',
        prompt: 'Sau khi đạt thành tích, Bác căn dặn điều gì?',
        options: ['Không tự mãn, đoàn kết chặt chẽ và tiếp tục cố gắng', 'Chỉ cần tăng sản lượng, không cần quan tâm an toàn', 'Mỗi người làm việc riêng, không cần phối hợp', 'Dừng thi đua để nghỉ ngơi dài ngày'],
        answer: 0,
        explanation: 'Đúng. Bác mong mọi người tiếp tục cố gắng, đoàn kết chặt chẽ và tiến bộ nhiều.',
      },
      {
        id: 'connect-journey',
        title: 'Bước 5 · Nối với hành trình cứu nước',
        prompt: 'Mối nối phù hợp nhất giữa bức thư năm 1959 và hành trình ra đi năm 1911 là gì?',
        options: ['Độc lập phải được bảo vệ và xây dựng bằng lao động, đoàn kết, tự lực', 'Hai sự kiện đều diễn ra trên cùng một con tàu', 'Bức thư kể lại toàn bộ hải trình qua các châu lục', 'Hai sự kiện không có liên hệ về tư tưởng'],
        answer: 0,
        explanation: 'Đúng. Từ khát vọng tìm đường cứu nước đến xây dựng đất nước, tư tưởng luôn hướng về độc lập và hạnh phúc của nhân dân.',
      },
    ],
    kind: 'document',
    modelPath: '/models/thu_bac_ho_gui_cong_nhan.glb',
    targetHeight: 1.45,
    rotation: [0, -Math.PI / 2, 0],
    modelOffsetY: 0.08,
    position: [8.9, 0, 4.0],
    approach: [5.0, 4.0],
    map: [78, 30],
  },
  {
    id: 'declaration-letter',
    index: 5,
    title: 'Thư Của Chủ Tịch HCM và Bản Tuyên Cáo',
    period: '1945',
    zone: 'Bút Tích Lịch Sử',
    summary: 'Tập tư liệu quý gồm thư và các văn kiện tuyên cáo lịch sử mang tính bước ngoặt của dân tộc.',
    narration:
      'Tư liệu ghi lại những văn bản chỉ đạo và tuyên cáo quan trọng của Chủ tịch Hồ Chí Minh trong những ngày đầu thành lập nước Việt Nam Dân chủ Cộng hòa, khẳng định quyền tự do, độc lập thiêng liêng của Tổ quốc.',
    documentContent:
      'Mô hình tái hiện các trang báo và văn bản tuyên cáo lịch sử năm 1945. Phần tư liệu gồm những trang in ghi lại sự kiện, chủ trương và tiếng nói của thời đại, cùng các bản tuyên cáo khẳng định quyền tự do, độc lập của dân tộc Việt Nam. Khi quan sát, hãy chú ý tiêu đề, ngày tháng, con dấu và bố cục trang báo — đó là những dấu vết giúp kết nối hiện vật với bối cảnh khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    historicalContext:
      'Từ Bản Yêu sách của nhân dân An Nam năm 1919 đến Tuyên ngôn Độc lập ngày 2/9/1945 là một quá trình đấu tranh lâu dài để biến khát vọng của một dân tộc thành quyền chính trị được tuyên bố trước quốc dân và thế giới.',
    keyIdea:
      'Độc lập dân tộc là quyền thiêng liêng của mọi dân tộc. Tuyên ngôn cũng mở ra trách nhiệm xây dựng một nhà nước của nhân dân, nơi tự do phải đi cùng nghĩa vụ và đoàn kết.',
    reflectionQuestion: 'Điều gì thay đổi khi một khát vọng tự do trở thành một lời tuyên bố trước toàn thế giới?',
    reflectionAnswer:
      'Khát vọng ấy trở thành một cam kết chính trị và đạo lý: dân tộc tự quyết định tương lai của mình, đồng thời phải đoàn kết để bảo vệ nền độc lập đã giành được.',
    audioText:
      'Nhóm tư liệu này kể về bước ngoặt từ khát vọng đến sự kiện lập quốc. Năm 1919, Nguyễn Ái Quốc gửi Bản Yêu sách của nhân dân An Nam, đòi các quyền tự do và dân chủ. Ngày 2 tháng 9 năm 1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khẳng định quyền tự do và độc lập của dân tộc Việt Nam. Khi quan sát từng trang tư liệu, hãy nhớ rằng một lời tuyên bố lịch sử luôn đi kèm trách nhiệm: đoàn kết, bảo vệ chủ quyền và xây dựng cuộc sống tự do cho nhân dân.',
    kind: 'document',
    modelPath: '/models/thu_va_tuyen_cao.glb',
    targetHeight: 1.45,
    // Dựng đứng và giữ cố định một hướng trưng bày chính diện.
    rotation: [Math.PI / 2, 0, 0],
    wrapperRotationY: Math.PI / 2,
    modelOffsetY: 0.08,
    position: [-8.9, 0, -4.8],
    approach: [-5.0, -4.8],
    map: [22, 65],
  },
  {
    id: 'brown-silk-shirt',
    index: 6,
    title: 'Áo Lụa Nâu Của Chủ Tịch Hồ Chí Minh',
    period: 'Kỷ Vật Đời Thường',
    zone: 'Không Gian Đời Thường',
    summary: 'Chiếc áo lụa nâu mộc mạc Bác thường mặc trong những ngày làm việc tại Chiến khu Việt Bắc.',
    narration:
      'Mô hình 3D chiếc áo lụa nâu giản dị của Bác. Dù trên cương vị Chủ tịch nước, Người luôn giữ nếp sống thanh bạch, khiêm nhường, gắn bó keo sơn với đồng bào và chiến sĩ cả nước.',
    historicalContext:
      'Kỷ vật đời thường không đứng ngoài lịch sử. Nó gợi lại phong cách sống gần gũi, giản dị của một người đã đi qua nhiều hoàn cảnh nhưng không tách mình khỏi nhân dân và những người lao động.',
    keyIdea:
      'Đạo đức cách mạng thể hiện trong những lựa chọn hằng ngày: giản dị, liêm khiết, không xa hoa và luôn giữ mình trong mối quan hệ với nhân dân.',
    reflectionQuestion: 'Vì sao một chiếc áo bình dị có thể giúp người xem hiểu thêm về một nhà lãnh đạo?',
    reflectionAnswer:
      'Bởi phong cách sống làm cho lý tưởng trở nên cụ thể. Sự giản dị không chỉ là vẻ ngoài, mà thể hiện thái độ tôn trọng của cải của nhân dân và tinh thần tự rèn luyện.',
    audioText:
      'Chiếc áo lụa nâu nhắc ta nhìn lịch sử từ một góc rất gần. Hồ Chí Minh là lãnh tụ của một cuộc cách mạng, nhưng trong đời sống Người vẫn giữ sự giản dị và gần gũi. Đó không phải là sự giản đơn hóa lịch sử, mà là một biểu hiện của đạo đức: không đặt mình lên trên nhân dân, biết tiết chế nhu cầu riêng và giữ sự trong sáng trong công việc. Hãy tự hỏi: trong đời sống hôm nay, giản dị và trách nhiệm có thể được thể hiện bằng những hành động nào?',
    kind: 'silk',
    modelPath: '/models/ao_lua_nau.glb',
    targetHeight: 1.6,
    // Mặt trước quay về camera tại điểm tiếp cận ở phía trung tâm phòng.
    // Đảo 180° để mặt trước quay đúng về camera inspect.
    rotation: [0, 0, 0],
    modelOffsetY: 0.02,
    position: [8.9, 0, -4.8],
    approach: [5.0, -4.8],
    map: [78, 65],
  },
  {
    id: 'khaki-outfit',
    index: 7,
    title: 'Bộ Quần Áo Kaki Của Chủ Tịch Hồ Chí Minh',
    period: '1959',
    zone: 'Kỷ Vật Kháng Chiến',
    summary: 'Bộ quần áo kaki lịch sử gắn liền với hình ảnh Bác trong các chuyến công tác và đối ngoại.',
    narration:
      'Bộ quần áo kaki 4 túi đặc trưng được số hóa chi tiết 3D. Đây là trang phục quen thuộc của Bác trong các sự kiện trọng đại của đất nước, khi tiếp đón các nguyên thủ quốc tế cũng như khi về thăm xí nghiệp, nông trường.',
    historicalContext:
      'Bộ kaki xuất hiện trong hình ảnh một Chủ tịch nước làm việc với nhiều đối tượng: chiến sĩ, công nhân, nông dân, thiếu nhi và khách quốc tế. Nó gợi lại quan niệm lãnh đạo phải đi vào thực tiễn và gần với đời sống.',
    keyIdea:
      'Phong cách Hồ Chí Minh kết hợp tầm nhìn lớn với tác phong sâu sát: nói đi đôi với làm, tôn trọng nhân dân và học từ thực tế để phục vụ đất nước.',
    reflectionQuestion: 'Em nhận ra mối liên hệ nào giữa bộ kaki và tinh thần “nói đi đôi với làm”?',
    reflectionAnswer:
      'Bộ trang phục gắn với hình ảnh Người ở nơi làm việc và đời sống, cho thấy tư tưởng không chỉ nằm trên diễn đàn mà được kiểm nghiệm qua tiếp xúc, lao động và hành động cụ thể.',
    audioText:
      'Bộ quần áo kaki gắn với hình ảnh Hồ Chí Minh trong công việc hằng ngày: thăm xí nghiệp, nông trường, gặp chiến sĩ, đồng bào và tiếp khách quốc tế. Từ hành trình năm 1911, Người đã học cách quan sát đời sống bằng trải nghiệm trực tiếp. Khi trở thành lãnh tụ, phương pháp ấy vẫn được giữ lại: gần dân, nghe dân và nói đi đôi với làm. Hiện vật mời chúng ta suy nghĩ về một phẩm chất lãnh đạo bền vững: tầm nhìn lớn phải bắt đầu từ việc hiểu những điều cụ thể trong đời sống.',
    kind: 'clothing',
    modelPath: '/models/bo_quan_ao_kaki.glb',
    targetHeight: 1.6,
    // Mặt trước quay về camera tại điểm tiếp cận ở phía trung tâm phòng.
    // Đảo 180° để mặt trước quay đúng về camera inspect.
    rotation: [0, Math.PI, 0],
    modelOffsetY: 0.02,
    position: [-8.9, 0, -11.5],
    approach: [-5.0, -11.5],
    map: [22, 88],
  },
  {
    id: 'national-emblem',
    index: 8,
    title: 'Thư Gửi Công Nhân, Chiến Sĩ, Nhân Viên Và Cán Bộ Xưởng May 10',
    period: '24/02/1959',
    zone: 'Tư Liệu Bút Tích',
    summary: 'Bức thư Bác Hồ gửi công nhân, chiến sĩ, nhân viên và cán bộ Xưởng May 10, Cục Quân nhu, Tổng cục Hậu cần.',
    narration:
      'Ngày 24 tháng 2 năm 1959, Bác Hồ gửi thư thân ái tới công nhân, chiến sĩ, nhân viên và cán bộ Xưởng May 10, Cục Quân nhu, Tổng cục Hậu cần. Người ghi nhận những tiến bộ về đoàn kết, thi đua, cải tiến kỹ thuật, tăng gia sản xuất, thực hành tiết kiệm và quản lý xí nghiệp; đồng thời nhắc mọi người không tự mãn, tự kiêu mà phải tiếp tục cố gắng.',
    documentContent:
      'Bức thư cũng ghi nhận món quà là bộ áo do Xưởng May 10 biếu Bác. Người gửi lại bộ áo làm giải thưởng cho một đợt thi đua, để tập thể bình nghị người có thành tích tốt. Đây là chi tiết thể hiện cách Bác biến tình cảm thành động lực thi đua và khuyến khích tinh thần tập thể.',
    historicalContext:
      'Năm 1959, miền Bắc đang khôi phục và xây dựng cơ sở vật chất cho chủ nghĩa xã hội. Xưởng May 10 thuộc Cục Quân nhu, Tổng cục Hậu cần là một tập thể lao động vừa sản xuất vừa phục vụ nhiệm vụ quốc phòng; bức thư cho thấy sự quan tâm của Bác tới công nhân và cách Người gắn thi đua với kỷ luật, kỹ thuật, tiết kiệm và đoàn kết.',
    keyIdea:
      'Thi đua phải đi cùng đoàn kết, cải tiến, tiết kiệm và tinh thần không tự mãn. Thành tích chỉ có ý nghĩa khi mở ra động lực tiến bộ tiếp theo và phục vụ nhiệm vụ chung.',
    reflectionQuestion: 'Vì sao Bác vừa khen thành tích vừa nhắc công nhân không được tự mãn?',
    reflectionAnswer:
      'Vì thành tích cần được biến thành động lực tiến bộ bền vững. Khiêm tốn, đoàn kết và tiếp tục cải tiến giúp kết quả phục vụ tốt hơn cho tập thể và nhân dân.',
    audioText:
      'Điểm số tám giới thiệu bức thư Bác Hồ gửi Xưởng May 10 ngày 24 tháng 2 năm 1959. Bác vui mừng trước những tiến bộ về đoàn kết, thi đua, kỹ thuật, sản xuất, tiết kiệm và quản lý; nhưng Người cũng căn dặn không được tự mãn, tự kiêu. Bộ áo do công nhân biếu Bác được Người gửi lại làm giải thưởng thi đua. Qua hiện vật, ta thấy tư tưởng thi đua gắn với tinh thần tập thể, khiêm tốn và tiến bộ không ngừng.',
    discoverySteps: [
      {
        id: 'identify-may10-letter',
        title: 'Bước 1 · Xác định người nhận',
        prompt: 'Bức thư ngày 24/02/1959 được gửi tới tập thể nào?',
        options: ['Công nhân, chiến sĩ, nhân viên và cán bộ Xưởng May 10, Cục Quân nhu', 'Công nhân mỏ Apatit Lào Cai', 'Học sinh một trường phổ thông', 'Các chiến sĩ Điện Biên Phủ'],
        answer: 0,
        explanation: 'Đúng. Bức thư gửi Xưởng May 10 thuộc Cục Quân nhu, Tổng cục Hậu cần.',
      },
      {
        id: 'may10-lessons',
        title: 'Bước 2 · Hiểu lời căn dặn',
        prompt: 'Sau khi ghi nhận tiến bộ, Bác nhắc tập thể May 10 điều gì?',
        options: ['Không tự mãn, tự kiêu; phải tiếp tục cố gắng để tiến bộ mãi', 'Dừng thi đua vì đã hoàn thành nhiệm vụ', 'Chỉ chú trọng sản lượng, không cần cải tiến kỹ thuật', 'Giữ phần thưởng cho riêng người lãnh đạo'],
        answer: 0,
        explanation: 'Đúng. Bác nhấn mạnh thái độ khiêm tốn, tiếp tục phấn đấu và tiến bộ bền bỉ.',
      },
      {
        id: 'may10-reward',
        title: 'Bước 3 · Đọc chi tiết hiện vật',
        prompt: 'Bộ áo do công nhân May 10 biếu Bác được Người xử lý như thế nào?',
        options: ['Gửi lại làm giải thưởng cho một đợt thi đua', 'Cất riêng làm vật kỷ niệm cá nhân', 'Đổi lấy một hiện vật khác', 'Gửi cho một cơ quan nước ngoài'],
        answer: 0,
        explanation: 'Đúng. Bác gửi lại bộ áo để tập thể bình nghị người khá nhất nhận làm giải thưởng.',
      },
    ],
    kind: 'document',
    modelPath: '/models/thu_bac_ho_gui_cong_nhan.glb',
    targetHeight: 1.45,
    rotation: [0, -Math.PI / 2, 0],
    modelOffsetY: 0.08,
    position: [0, 0, -11.5],
    approach: [0, -8.8],
    map: [50, 90],
  },
]
