// 상태 관리
let state = {
  selectedBrands: ['전체'],
  selectedCategories: ['전체'],
  sortBy: 'low',
  searchTerm: '',
  selectedProducts: []
};

// 브랜드와 카테고리 목록 추출
const brands = ['전체', ...new Set(products.map(p => p.brand))];
const categories = ['전체', ...new Set(products.map(p => p.category))];

// 각설탕 개수 계산 (각설탕 1개 = 약 4g)
function getSugarCubes(sugar) {
  return Math.ceil(sugar / 4);
}

// 각설탕 시각화 생성
function renderSugarCubes(sugar) {
  const cubeCount = getSugarCubes(sugar);
  const maxDisplay = 20; // 최대 표시 개수
  
  if (cubeCount === 0) {
    return '<span class="sugar-text">당류 없음</span>';
  }
  
  let cubesHTML = '';
  const displayCount = Math.min(cubeCount, maxDisplay);
  
  for (let i = 0; i < displayCount; i++) {
    cubesHTML += '<span class="sugar-cube">🧊</span>';
  }
  
  if (cubeCount > maxDisplay) {
    cubesHTML += ` <span class="sugar-text">+${cubeCount - maxDisplay}개</span>`;
  }
  
  return cubesHTML;
}

// 태그 렌더링
function renderTags(product) {
  if (product.tags.length === 0) return '';
  
  return product.tags.map(tag => {
    let className = 'tag';
    if (tag === '제로슈가' || tag === '제로') {
      className += ' tag-zero';
    } else if (tag.includes('에리스리톨') || tag.includes('스테비아') || tag.includes('알룰로스')) {
      className += ' tag-sweetener';
    } else {
      className += ' tag-unknown';
    }
    return `<span class="${className}">${tag}</span>`;
  }).join('');
}

// 감미료 정보 태그 생성
function getSweetenerTag(product) {
  if (product.sugar === 0 && product.sweetener) {
    return `<span class="tag tag-sweetener">${product.sweetener}</span>`;
  } else if (product.sugar === 0 && !product.sweetener && !product.tags.includes('제로슈가')) {
    return `<span class="tag tag-unknown">감미료 확인불가</span>`;
  }
  return '';
}

// 필터 버튼 초기화
function initFilters() {
  // 브랜드 필터
  const brandFilters = document.getElementById('brandFilters');
  brandFilters.innerHTML = brands.map(brand => `
    <button class="filter-btn ${state.selectedBrands.includes(brand) ? 'active' : ''}" 
            onclick="toggleBrand('${brand}')">
      ${brand}
    </button>
  `).join('');

  // 카테고리 필터
  const categoryFilters = document.getElementById('categoryFilters');
  categoryFilters.innerHTML = categories.map(category => `
    <button class="filter-btn ${state.selectedCategories.includes(category) ? 'active' : ''}" 
            onclick="toggleCategory('${category}')">
      ${category}
    </button>
  `).join('');

  // 정렬 셀렉트
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // 메인 검색
  const mainSearch = document.getElementById('mainSearch');
  mainSearch.addEventListener('input', (e) => {
    state.searchTerm = e.target.value;
    renderProducts();
  });
}

// 브랜드 필터 토글
function toggleBrand(brand) {
  if (brand === '전체') {
    state.selectedBrands = ['전체'];
  } else {
    if (state.selectedBrands.includes(brand)) {
      state.selectedBrands = state.selectedBrands.filter(b => b !== brand);
    } else {
      state.selectedBrands = [...state.selectedBrands.filter(b => b !== '전체'), brand];
    }
    if (state.selectedBrands.length === 0) {
      state.selectedBrands = ['전체'];
    }
  }
  initFilters();
  renderProducts();
}

// 카테고리 필터 토글
function toggleCategory(category) {
  if (category === '전체') {
    state.selectedCategories = ['전체'];
  } else {
    if (state.selectedCategories.includes(category)) {
      state.selectedCategories = state.selectedCategories.filter(c => c !== category);
    } else {
      state.selectedCategories = [...state.selectedCategories.filter(c => c !== '전체'), category];
    }
    if (state.selectedCategories.length === 0) {
      state.selectedCategories = ['전체'];
    }
  }
  initFilters();
  renderProducts();
}

// 제품 선택/해제
function toggleProductSelection(productId) {
  const product = products.find(p => p.id === productId);
  const index = state.selectedProducts.findIndex(p => p.id === productId);
  
  if (index > -1) {
    state.selectedProducts.splice(index, 1);
  } else {
    state.selectedProducts.push(product);
  }
  
  renderProducts();
  updateCompareSection();
}

// 선택 제품 제거
function removeProduct(productId) {
  state.selectedProducts = state.selectedProducts.filter(p => p.id !== productId);
  renderProducts();
  updateCompareSection();
}

// 필터링된 제품 목록 가져오기
function getFilteredProducts() {
  let filtered = [...products];

  // 브랜드 필터
  if (!state.selectedBrands.includes('전체')) {
    filtered = filtered.filter(p => state.selectedBrands.includes(p.brand));
  }

  // 카테고리 필터
  if (!state.selectedCategories.includes('전체')) {
    filtered = filtered.filter(p => state.selectedCategories.includes(p.category));
  }

  // 검색어 필터 (제품명, 브랜드, 태그 검색)
  if (state.searchTerm) {
    const searchLower = state.searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (p.sweetener && p.sweetener.toLowerCase().includes(searchLower))
    );
  }

  // 정렬
  if (state.sortBy === 'low') {
    filtered.sort((a, b) => a.sugar - b.sugar);
  } else {
    filtered.sort((a, b) => b.sugar - a.sugar);
  }

  return filtered;
}

// 제품 카드 렌더링
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const resultCount = document.getElementById('resultCount');
  const filtered = getFilteredProducts();

  resultCount.textContent = `${filtered.length}개 메뉴`;

  grid.innerHTML = filtered.map(product => {
    const isSelected = state.selectedProducts.find(p => p.id === product.id);
    const cubes = renderSugarCubes(product.sugar);
    const cubeCount = getSugarCubes(product.sugar);
    const tags = renderTags(product);
    const sweetenerTag = getSweetenerTag(product);
    
    return `
      <div class="product-card ${isSelected ? 'selected' : ''}">
        <div class="product-header">
          <span class="product-brand">${product.brand}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category} · ${product.size}</p>
        
        <div class="product-tags">
          ${tags}
          ${sweetenerTag}
        </div>
        
        <div class="sugar-visual">
          <div class="sugar-info-row">
            <span class="sugar-amount">${product.sugar}</span>
            <span class="sugar-unit">g</span>
          </div>
          <div class="sugar-cubes">
            ${cubes}
          </div>
          ${product.sugar > 0 ? `<p class="sugar-text">각설탕 약 ${cubeCount}개</p>` : ''}
        </div>
        
        <button class="add-compare-btn ${isSelected ? 'selected' : ''}" 
                onclick="toggleProductSelection(${product.id})">
          ${isSelected ? '✓ 비교 목록에 담김' : '+ 비교 담기'}
        </button>
      </div>
    `;
  }).join('');
}

// 비교 섹션 업데이트
function updateCompareSection() {
  const selectedCount = document.getElementById('selectedCount');
  const compareTableWrapper = document.getElementById('compareTableWrapper');
  const emptyState = document.getElementById('emptyState');
  const compareBadge = document.getElementById('compareBadge');
  
  selectedCount.textContent = `${state.selectedProducts.length}개 선택`;
  
  // 배지 업데이트
  if (state.selectedProducts.length > 0) {
    compareBadge.textContent = state.selectedProducts.length;
    compareBadge.classList.add('active');
  } else {
    compareBadge.classList.remove('active');
  }

  if (state.selectedProducts.length === 0) {
    compareTableWrapper.classList.remove('active');
    emptyState.classList.remove('hidden');
  } else {
    compareTableWrapper.classList.add('active');
    emptyState.classList.add('hidden');
    renderCompareTable();
  }
}

// 비교 테이블 렌더링
function renderCompareTable() {
  const tbody = document.getElementById('compareTableBody');
  
  tbody.innerHTML = state.selectedProducts.map(product => {
    const cubeCount = getSugarCubes(product.sugar);
    const tags = renderTags(product);
    const sweetenerTag = getSweetenerTag(product);
    
    return `
      <tr>
        <td><strong>${product.name}</strong><br><small style="color: var(--text-muted);">${product.size}</small></td>
        <td>${product.brand}</td>
        <td><span class="sugar-value">${product.sugar}g</span></td>
        <td>
          ${product.sugar === 0 ? '-' : `🧊 약 ${cubeCount}개`}
        </td>
        <td>
          ${tags}
          ${sweetenerTag}
        </td>
        <td>
          <button class="remove-btn" onclick="removeProduct(${product.id})">
            제거
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 플로팅 버튼 기능
function initFloatingButtons() {
  const topBtn = document.getElementById('topBtn');
  const compareBtn = document.getElementById('compareBtn');
  
  // Top 버튼
  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 비교 보기 버튼
  compareBtn.addEventListener('click', () => {
    const compareSection = document.getElementById('compareSection');
    compareSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderProducts();
  updateCompareSection();
  initFloatingButtons();
});
