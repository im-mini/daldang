const drinkData = [
  // --- 커피 (Coffee) ---
  { id: 'mega-01', brand: '메가커피', name: '아메리카노(HOT)', category: '커피', sugar: 0, size: '20oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['기본', '무당'] },
  { id: 'mega-02', brand: '메가커피', name: '아메리카노(ICE)', category: '커피', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['기본', '무당'] },
  { id: 'mega-03', brand: '메가커피', name: '할메가커피', category: '커피', sugar: 32.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['당충전', '달달'] },
  { id: 'mega-04', brand: '메가커피', name: '카페라떼', category: '커피', sugar: 9.2, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['우유당'] },
  { id: 'mega-05', brand: '메가커피', name: '바닐라아메리카노', category: '커피', sugar: 18.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['시럽'] },
  { id: 'mega-06', brand: '메가커피', name: '바닐라라떼', category: '커피', sugar: 25.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['베스트'] },
  { id: 'mega-07', brand: '메가커피', name: '헤이즐넛라떼', category: '커피', sugar: 23.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['향긋'] },
  { id: 'mega-08', brand: '메가커피', name: '카라멜마끼아또', category: '커피', sugar: 31.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['카라멜'] },
  { id: 'mega-09', brand: '메가커피', name: '카페모카', category: '커피', sugar: 28.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['초코'] },
  { id: 'mega-10', brand: '메가커피', name: '큐브라떼', category: '커피', sugar: 19.8, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['연유'] },

  // --- 제로/저당 시리즈 ---
  { id: 'mega-11', brand: '메가커피', name: '제로 복숭아 아이스티', category: '티', sugar: 0, size: '24oz', sweetenerType: 'safe', sweetenerName: '에리스리톨/스테비아', tags: ['제로', '무설탕'] },
  { id: 'mega-12', brand: '메가커피', name: '라이트 바닐라라떼', category: '커피', sugar: 9.8, size: '24oz', sweetenerType: 'safe', sweetenerName: '스테비아 혼합', tags: ['저당', '다이어트'] },
  { id: 'mega-13', brand: '메가커피', name: '제로 슈가 청포도에이드', category: '에이드', sugar: 0.5, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '청량'] },
  { id: 'mega-14', brand: '메가커피', name: '제로 슈가 자몽에이드', category: '에이드', sugar: 0.8, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '쌉싸름'] },
  { id: 'mega-15', brand: '메가커피', name: '제로 슈가 레몬에이드', category: '에이드', sugar: 0.5, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '상큼'] },

  // --- 라떼 & 초코 ---
  { id: 'mega-16', brand: '메가커피', name: '딸기라떼', category: '라떼', sugar: 42.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['과일라떼'] },
  { id: 'mega-17', brand: '메가커피', name: '메가초코', category: '라떼', sugar: 48.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['초코뿜뿜'] },
  { id: 'mega-18', brand: '메가커피', name: '녹차라떼', category: '라떼', sugar: 29.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['녹차'] },
  { id: 'mega-19', brand: '메가커피', name: '고구마라떼', category: '라떼', sugar: 35.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['든든'] },
  { id: 'mega-20', brand: '메가커피', name: '로얄밀크티라떼', category: '라떼', sugar: 33.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['홍차'] },

  // --- 에이드 & 주스 ---
  { id: 'mega-21', brand: '메가커피', name: '메가에이드', category: '에이드', sugar: 58.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['레몬자몽라임'] },
  { id: 'mega-22', brand: '메가커피', name: '유니콘에이드', category: '에이드', sugar: 45.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['비주얼'] },
  { id: 'mega-23', brand: '메가커피', name: '청포도에이드', category: '에이드', sugar: 42.8, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['달콤상큼'] },
  { id: 'mega-24', brand: '메가커피', name: '딸기주스', category: '주스', sugar: 38.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['생과일'] },
  { id: 'mega-25', brand: '메가커피', name: '샤인머스캣그린주스', category: '주스', sugar: 41.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['건강식'] },

  // --- 스무디 & 프라페 ---
  { id: 'mega-26', brand: '메가커피', name: '플레인요거트스무디', category: '스무디', sugar: 62.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['요거트'] },
  { id: 'mega-27', brand: '메가커피', name: '딸기요거트스무디', category: '스무디', sugar: 68.9, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['달달구리'] },
  { id: 'mega-28', brand: '메가커피', name: '쿠키프라페', category: '프라페', sugar: 72.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['칼로리폭탄'] },
  { id: 'mega-29', brand: '메가커피', name: '민트프라페', category: '프라페', sugar: 55.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['민초단'] },
  { id: 'mega-30', brand: '메가커피', name: '리얼초코프라페', category: '프라페', sugar: 78.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['당류최강'] },

  // --- 티 ---
  { id: 'mega-31', brand: '메가커피', name: '허니자몽블랙티', category: '티', sugar: 45.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['스테디셀러'] },
  { id: 'mega-32', brand: '메가커피', name: '사과유자차', category: '티', sugar: 39.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['따뜻'] },
  { id: 'mega-33', brand: '메가커피', name: '페퍼민트', category: '티', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['클린'] },
  { id: 'mega-34', brand: '메가커피', name: '캐모마일', category: '티', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['안정'] }

  const drinkData = [
  // --- 커피 (Coffee) ---
  { id: 'mega-01', brand: '메가커피', name: '아메리카노(HOT)', category: '커피', sugar: 0, size: '20oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['기본', '무당'] },
  { id: 'mega-02', brand: '메가커피', name: '아메리카노(ICE)', category: '커피', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['기본', '무당'] },
  { id: 'mega-03', brand: '메가커피', name: '할메가커피', category: '커피', sugar: 32.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['당충전', '달달'] },
  { id: 'mega-04', brand: '메가커피', name: '카페라떼', category: '커피', sugar: 9.2, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['우유당'] },
  { id: 'mega-05', brand: '메가커피', name: '바닐라아메리카노', category: '커피', sugar: 18.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['시럽'] },
  { id: 'mega-06', brand: '메가커피', name: '바닐라라떼', category: '커피', sugar: 25.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['베스트'] },
  { id: 'mega-07', brand: '메가커피', name: '헤이즐넛라떼', category: '커피', sugar: 23.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['향긋'] },
  { id: 'mega-08', brand: '메가커피', name: '카라멜마끼아또', category: '커피', sugar: 31.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['카라멜'] },
  { id: 'mega-09', brand: '메가커피', name: '카페모카', category: '커피', sugar: 28.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['초코'] },
  { id: 'mega-10', brand: '메가커피', name: '큐브라떼', category: '커피', sugar: 19.8, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['연유'] },

  // --- 제로/저당 시리즈 ---
  { id: 'mega-11', brand: '메가커피', name: '제로 복숭아 아이스티', category: '티', sugar: 0, size: '24oz', sweetenerType: 'safe', sweetenerName: '에리스리톨/스테비아', tags: ['제로', '무설탕'] },
  { id: 'mega-12', brand: '메가커피', name: '라이트 바닐라라떼', category: '커피', sugar: 9.8, size: '24oz', sweetenerType: 'safe', sweetenerName: '스테비아 혼합', tags: ['저당', '다이어트'] },
  { id: 'mega-13', brand: '메가커피', name: '제로 슈가 청포도에이드', category: '에이드', sugar: 0.5, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '청량'] },
  { id: 'mega-14', brand: '메가커피', name: '제로 슈가 자몽에이드', category: '에이드', sugar: 0.8, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '쌉싸름'] },
  { id: 'mega-15', brand: '메가커피', name: '제로 슈가 레몬에이드', category: '에이드', sugar: 0.5, size: '24oz', sweetenerType: 'safe', sweetenerName: '알룰로스/스테비아', tags: ['제로', '상큼'] },

  // --- 라떼 & 초코 ---
  { id: 'mega-16', brand: '메가커피', name: '딸기라떼', category: '라떼', sugar: 42.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['과일라떼'] },
  { id: 'mega-17', brand: '메가커피', name: '메가초코', category: '라떼', sugar: 48.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['초코뿜뿜'] },
  { id: 'mega-18', brand: '메가커피', name: '녹차라떼', category: '라떼', sugar: 29.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['녹차'] },
  { id: 'mega-19', brand: '메가커피', name: '고구마라떼', category: '라떼', sugar: 35.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['든든'] },
  { id: 'mega-20', brand: '메가커피', name: '로얄밀크티라떼', category: '라떼', sugar: 33.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['홍차'] },

  // --- 에이드 & 주스 ---
  { id: 'mega-21', brand: '메가커피', name: '메가에이드', category: '에이드', sugar: 58.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['레몬자몽라임'] },
  { id: 'mega-22', brand: '메가커피', name: '유니콘에이드', category: '에이드', sugar: 45.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['비주얼'] },
  { id: 'mega-23', brand: '메가커피', name: '청포도에이드', category: '에이드', sugar: 42.8, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['달콤상큼'] },
  { id: 'mega-24', brand: '메가커피', name: '딸기주스', category: '주스', sugar: 38.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['생과일'] },
  { id: 'mega-25', brand: '메가커피', name: '샤인머스캣그린주스', category: '주스', sugar: 41.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['건강식'] },

  // --- 스무디 & 프라페 ---
  { id: 'mega-26', brand: '메가커피', name: '플레인요거트스무디', category: '스무디', sugar: 62.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['요거트'] },
  { id: 'mega-27', brand: '메가커피', name: '딸기요거트스무디', category: '스무디', sugar: 68.9, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['달달구리'] },
  { id: 'mega-28', brand: '메가커피', name: '쿠키프라페', category: '프라페', sugar: 72.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['칼로리폭탄'] },
  { id: 'mega-29', brand: '메가커피', name: '민트프라페', category: '프라페', sugar: 55.4, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['민초단'] },
  { id: 'mega-30', brand: '메가커피', name: '리얼초코프라페', category: '프라페', sugar: 78.1, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['당류최강'] },

  // --- 티 ---
  { id: 'mega-31', brand: '메가커피', name: '허니자몽블랙티', category: '티', sugar: 45.5, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['스테디셀러'] },
  { id: 'mega-32', brand: '메가커피', name: '사과유자차', category: '티', sugar: 39.2, size: '24oz', sweetenerType: 'unknown', sweetenerName: '정보없음', tags: ['따뜻'] },
  { id: 'mega-33', brand: '메가커피', name: '페퍼민트', category: '티', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['클린'] },
  { id: 'mega-34', brand: '메가커피', name: '캐모마일', category: '티', sugar: 0, size: '24oz', sweetenerType: 'none', sweetenerName: '없음', tags: ['안정'] }
];
];
