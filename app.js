// 상태 관리
const state = {
  metadata: [], // 경량 메타데이터 (검색용: name, brand, sweetener, tags만)
  fullDataCache: {}, // 전체 데이터 캐시 (표시용: id를 키로)
  displayedMenus: [],
  filteredIds: [], // 필터링된 메뉴 ID 목록
  selectedBrand: '전체',
  sortBy: 'low',
  searchTerm: '',
  compareList: [],
  currentPage: 0,
  itemsPerPage: 12,
  isLoading: false,
  bannerIndex: 0
};

// 메타데이터 로드 (빠른 검색용)
async function loadMetadata() {
  try {
    // ========================================
    // 🔥 새 브랜드 추가 방법:
    // 1. /data 폴더에 브랜드명.json 파일 생성
    // 2. 아래 fetch 배열에 추가
    // 예: fetch('data/투썸플레이스.json').then(r => r.json())
    // ========================================
    
    const [starbucks, mega] = await Promise.all([
      fetch('data/starbucks.json').then(r => r.json()),
      fetch('data/mega-coffee.json').then(r => r.json())
      // 새 브랜드 추가 예시:
      // fetch('data/twosome.json').then(r => r.json()),
      // fetch('data/ediya.json').then(r => r.json())
    ]);
    
    // ========================================
    // 3. allData 배열에 새 브랜드 추가
    // ========================================
    const allData = [...starbucks, ...mega];
    // 새 브랜드 추가 시:
    // const allData = [...starbucks, ...mega, ...twosome, ...ediya];
    
    // 검색용 메타데이터만 추출 (경량화)
    state.metadata = allData.map(menu => ({
      id: menu.id,
      name: menu.name,
      brand: menu.brand,
      sweetener: menu.sweetener || [],
      tags: menu.tags || [],
      sugar: menu.sugar, // 정렬용
      등록일: menu.등록일 // 신상품 정렬용
    }));
    
    // 전체 데이터는 캐시에 저장 (표시용)
    allData.forEach(menu => {
      state.fullDataCache[menu.id] = menu;
    });
    
    console.log(`✅ 메타데이터 ${state.metadata.length}개 로드 완료`);
    console.log(`📦 전체 데이터 캐시 준비 완료`);
    
    applyFilters();
    renderBrandFilter();
    loadMoreItems();
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

// 브랜드 필터 렌더링
function renderBrandFilter() {
  const brands = ['전체', ...new Set(state.metadata.map(m => m.brand))];
  const container = document.getElementById('brandFilter');
  
  container.innerHTML = brands.map(brand => `
    <button class="brand-btn ${state.selectedBrand === brand ? 'active' : ''}" 
            onclick="selectBrand('${brand}')">
      ${brand}
    </button>
  `).join('');
}

// 브랜드 선택
function selectBrand(brand) {
  state.selectedBrand = brand;
  state.currentPage = 0;
  state.displayedMenus = [];
  applyFilters();
  renderBrandFilter();
  document.getElementById('menuGrid').innerHTML = '';
  loadMoreItems();
}

// 정렬 변경
function changeSort(sortType) {
  state.sortBy = sortType;
  state.currentPage = 0;
  state.displayedMenus = [];
  document.getElementById('menuGrid').innerHTML = '';
  
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.sort === sortType) {
      btn.classList.add('active');
    }
  });
  
  applyFilters();
  loadMoreItems();
}

// 검색 (메타데이터에서만 검색)
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  state.searchTerm = searchInput.value.trim();
  state.currentPage = 0;
  state.displayedMenus = [];
  document.getElementById('menuGrid').innerHTML = '';
  applyFilters();
  loadMoreItems();
}

// 필터 및 정렬 적용 (메타데이터 기반)
function applyFilters() {
  let filtered = [...state.metadata];
  
  // 브랜드 필터
  if (state.selectedBrand !== '전체') {
    filtered = filtered.filter(m => m.brand === state.selectedBrand);
  }
  
  // 검색 필터 (메타데이터의 name, brand, sweetener, tags에서 검색)
  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(term) ||
      m.brand.toLowerCase().includes(term) ||
      m.tags.some(tag => tag.toLowerCase().includes(term)) ||
      m.sweetener.some(sw => sw.toLowerCase().includes(term))
    );
  }
  
  // 정렬
  if (state.sortBy === 'low') {
    filtered.sort((a, b) => a.sugar - b.sugar);
  } else if (state.sortBy === 'high') {
    filtered.sort((a, b) => b.sugar - a.sugar);
  } else if (state.sortBy === 'new') {
    // 신상품 태그 우선, 그 다음 등록일순
    filtered.sort((a, b) => {
      const aIsNew = a.tags.includes('신상품') || a.tags.includes('new') || a.tags.includes('NEW');
      const bIsNew = b.tags.includes('신상품') || b.tags.includes('new') || b.tags.includes('NEW');
      
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      
      return new Date(b.등록일) - new Date(a.등록일);
    });
  }
  
  // 필터링된 ID 목록만 저장
  state.filteredIds = filtered.map(m => m.id);
  updateResultCount();
}

// 결과 수 업데이트
function updateResultCount() {
  document.getElementById('resultCount').textContent = state.filteredIds.length;
}

// 무한 스크롤 - 더 많은 아이템 로드
function loadMoreItems() {
  if (state.isLoading) return;
  
  state.isLoading = true;
  document.getElementById('loading').style.display = 'block';
  
  setTimeout(() => {
    const start = state.currentPage * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const newIds = state.filteredIds.slice(start, end);
    
    // 캐시에서 전체 데이터 가져오기
    const newMenus = newIds.map(id => state.fullDataCache[id]);
    
    state.displayedMenus.push(...newMenus);
    renderMenus(newMenus);
    
    state.currentPage++;
    state.isLoading = false;
    document.getElementById('loading').style.display = 'none';
  }, 300);
}

// 각설탕 개수 계산
function getSugarCubes(sugar) {
  return Math.ceil(sugar / 4);
}

// 각설탕 렌더링
function renderSugarCubes(sugar) {
  const count = getSugarCubes(sugar);
  const maxDisplay = 20;
  
  if (count === 0) return '<span class="sugar-text">당류 없음</span>';
  
  let html = '';
  for (let i = 0; i < Math.min(count, maxDisplay); i++) {
    html += '<span class="cube">🧊</span>';
  }
  
  if (count > maxDisplay) {
    html += ` <span class="sugar-text">+${count - maxDisplay}개</span>`;
  }
  
  return html;
}

// 텍스트 하이라이트
function highlightText(text) {
  if (!state.searchTerm) return text;
  
  const regex = new RegExp(`(${state.searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// 메뉴 카드 렌더링
function renderMenus(menus) {
  const grid = document.getElementById('menuGrid');
  
  menus.forEach((menu, index) => {
    // 8번째마다 광고 삽입
    if ((state.displayedMenus.indexOf(menu) + 1) % 8 === 0) {
      const adCard = createAdCard();
      grid.appendChild(adCard);
    }
    
    const card = createMenuCard(menu);
    grid.appendChild(card);
  });
}

// 광고 카드 생성
function createAdCard() {
  const div = document.createElement('div');
  div.className = 'ad-card';
  div.onclick = () => {
    // 광고 클릭 시 이동할 URL
    window.open('https://example.com/ad', '_blank');
  };
  
  div.innerHTML = `
    <h3>🎁 특별 제휴 혜택</h3>
    <p>저당 간식 30% 할인</p>
    <small style="color: var(--text-muted); margin-top: 0.5rem;">AD</small>
  `;
  
  return div;
}

// 메뉴 카드 생성
function createMenuCard(menu) {
  const div = document.createElement('div');
  div.className = 'menu-card';
  
  const isSelected = state.compareList.some(m => m.id === menu.id);
  if (isSelected) div.classList.add('selected');
  
  const cubes = renderSugarCubes(menu.sugar);
  const cubeCount = getSugarCubes(menu.sugar);
  
  // 태그 렌더링
  const tagsHtml = menu.tags.map(tag => {
    const highlighted = highlightText(tag);
    let className = 'tag';
    if (tag.includes('신상품') || tag.includes('new') || tag.includes('NEW')) {
      className += ' new';
    }
    if (tag.includes('제로')) {
      className += ' zero';
    }
    return `<span class="${className}">${highlighted}</span>`;
  }).join('');
  
  // 감미료(sweetener) 표시
  const sweetenerHtml = menu.sweetener && menu.sweetener.length > 0
    ? menu.sweetener.map(s => `<span class="tag">${highlightText(s)}</span>`).join('')
    : '';
  
  div.innerHTML = `
    <div class="card-header">
      <span class="brand-tag">${highlightText(menu.brand)}</span>
    </div>
    <h3 class="menu-name">${highlightText(menu.name)}</h3>
    <div class="tags">
      ${tagsHtml}
      ${sweetenerHtml}
    </div>
    <div class="sugar-info">
      <div class="sugar-amount">${menu.sugar}g</div>
      <div class="sugar-cubes">${cubes}</div>
      ${menu.sugar > 0 ? `<div class="sugar-text">각설탕 약 ${cubeCount}개</div>` : ''}
      <div class="calorie-info">칼로리: ${menu.칼로리}kcal</div>
    </div>
    <button class="compare-add-btn ${isSelected ? 'selected' : ''}" onclick="toggleCompare('${menu.id}')">
      ${isSelected ? '✓ 비교 목록에 담김' : '+ 비교 담기'}
    </button>
  `;
  
  return div;
}

// 비교 목록 토글
function toggleCompare(menuId) {
  const menu = state.fullDataCache[menuId];
  const index = state.compareList.findIndex(m => m.id === menuId);
  
  if (index > -1) {
    state.compareList.splice(index, 1);
  } else {
    state.compareList.push(menu);
  }
  
  updateCompareBadge();
  rerenderMenuCards();
  renderCompareList();
}

// 비교 목록 제거
function removeFromCompare(menuId) {
  state.compareList = state.compareList.filter(m => m.id !== menuId);
  updateCompareBadge();
  rerenderMenuCards();
  renderCompareList();
}

// 메뉴 카드 다시 렌더링
function rerenderMenuCards() {
  document.getElementById('menuGrid').innerHTML = '';
  renderMenus(state.displayedMenus);
}

// 비교 배지 업데이트
function updateCompareBadge() {
  const badge = document.getElementById('compareBadge');
  badge.textContent = state.compareList.length;
  
  if (state.compareList.length > 0) {
    badge.classList.add('active');
  } else {
    badge.classList.remove('active');
  }
}

// 비교 모달 토글
function toggleCompareModal() {
  const modal = document.getElementById('compareModal');
  modal.classList.toggle('active');
  
  if (modal.classList.contains('active')) {
    renderCompareList();
  }
}

// 비교 목록 렌더링
function renderCompareList() {
  const container = document.getElementById('compareList');
  const empty = document.getElementById('emptyCompare');
  
  if (state.compareList.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  
  const tableHtml = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>메뉴명</th>
          <th>브랜드</th>
          <th>당류</th>
          <th>각설탕</th>
          <th>칼로리</th>
          <th>감미료</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${state.compareList.map(menu => {
          const cubeCount = getSugarCubes(menu.sugar);
          const sweetenerText = menu.sweetener && menu.sweetener.length > 0 
            ? menu.sweetener.join(', ') 
            : '-';
          
          return `
            <tr>
              <td><strong>${menu.name}</strong></td>
              <td>${menu.brand}</td>
              <td><strong style="color: var(--primary-dark); font-size: 1.2rem;">${menu.sugar}g</strong></td>
              <td>${menu.sugar === 0 ? '-' : `🧊 약 ${cubeCount}개`}</td>
              <td>${menu.칼로리}kcal</td>
              <td><small>${sweetenerText}</small></td>
              <td>
                <button class="remove-btn" onclick="removeFromCompare('${menu.id}')">
                  제거
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHtml;
}

// 맨 위로 스크롤
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 검색창 토글
function toggleSearch() {
  const searchMiddle = document.getElementById('searchMiddle');
  const searchBtn = document.querySelector('.search-icon-btn');
  const searchInput = document.getElementById('searchInput');
  
  searchMiddle.classList.toggle('active');
  searchBtn.classList.toggle('active');
  
  if (searchMiddle.classList.contains('active')) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
}

// 배너 인디케이터로 이동
function goToBanner(index) {
  const slides = document.querySelectorAll('.banner-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  slides[state.bannerIndex].classList.remove('active');
  indicators[state.bannerIndex].classList.remove('active');
  
  state.bannerIndex = index;
  
  slides[state.bannerIndex].classList.add('active');
  indicators[state.bannerIndex].classList.add('active');
}

// 배너 슬라이드 변경
function changeBanner(direction) {
  const slides = document.querySelectorAll('.banner-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  slides[state.bannerIndex].classList.remove('active');
  indicators[state.bannerIndex].classList.remove('active');
  
  state.bannerIndex += direction;
  if (state.bannerIndex < 0) state.bannerIndex = slides.length - 1;
  if (state.bannerIndex >= slides.length) state.bannerIndex = 0;
  
  slides[state.bannerIndex].classList.add('active');
  indicators[state.bannerIndex].classList.add('active');
}

// 스크롤 이벤트
function handleScroll() {
  // Top 버튼 표시/숨김
  const topBtn = document.getElementById('topBtn');
  if (window.scrollY > 300) {
    topBtn.classList.add('visible');
  } else {
    topBtn.classList.remove('visible');
  }
  
  // 무한 스크롤
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;
  
  if (scrollTop + clientHeight >= scrollHeight - 500) {
    if (state.displayedMenus.length < state.filteredIds.length) {
      loadMoreItems();
    }
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 검색
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearch);
  
  // 정렬 버튼
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => changeSort(btn.dataset.sort));
  });
  
  // 스크롤
  window.addEventListener('scroll', handleScroll);
  
  // 모달 외부 클릭 시 닫기
  document.getElementById('compareModal').addEventListener('click', (e) => {
    if (e.target.id === 'compareModal') {
      toggleCompareModal();
    }
  });
  
  // 배너 자동 슬라이드
  setInterval(() => changeBanner(1), 5000);
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadMetadata();
  setupEventListeners();
});
