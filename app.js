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

// 당류별 이모티콘 반환
function getSugarEmoji(sugar) {
  if (sugar === 0) return '😍';
  if (sugar <= 10) return '😍';
  if (sugar <= 25) return '🙂';
  if (sugar <= 40) return '😞';
  if (sugar <= 60) return '🤪';
  return '😱';
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

  // 정렬 버튼
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.sortBy = e.target.dataset.sort;
      renderProducts();
    });
  });

  // 검색
  document.getElementById('searchInput').addEventListener('input', (e) => {
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
  renderCompareSection();
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

  // 검색어 필터
  if (state.searchTerm) {
    const searchLower = state.searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower)
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
  const filtered = getFilteredProducts();

  grid.innerHTML = filtered.map(product => {
    const isSelected = state.selectedProducts.find(p => p.id === product.id);
    return `
      <div class="product-card ${isSelected ? 'selected' : ''}" 
           onclick="toggleProductSelection(${product.id})">
        <div class="product-header">
          <span class="product-brand">${product.brand}</span>
          <span class="sugar-emoji">${getSugarEmoji(product.sugar)}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category} · ${product.size}</p>
        <div class="sugar-info">
          <span class="sugar-amount">${product.sugar}</span>
          <span class="sugar-unit">g</span>
        </div>
        <div class="sugar-bar">
          <div class="sugar-bar-fill" style="width: ${Math.min((product.sugar / 100) * 100, 100)}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// 비교 섹션 렌더링
function renderCompareSection() {
  const selectedCount = document.getElementById('selectedCount');
  const compareChart = document.getElementById('compareChart');
  const emptyState = document.getElementById('emptyState');
  
  selectedCount.textContent = `${state.selectedProducts.length}개 선택`;

  if (state.selectedProducts.length === 0) {
    compareChart.classList.remove('active');
    emptyState.classList.remove('hidden');
  } else {
    compareChart.classList.add('active');
    emptyState.classList.add('hidden');
    drawChart();
  }
}

// 차트 그리기
function drawChart() {
  const canvas = document.getElementById('chartCanvas');
  const ctx = canvas.getContext('2d');
  
  // 캔버스 크기 설정
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = 400;

  const products = state.selectedProducts;
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  
  // 배경 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (products.length === 0) return;

  // 최대값 계산
  const maxSugar = Math.max(...products.map(p => p.sugar), 50);
  const barWidth = chartWidth / products.length;
  
  // Y축 그리기
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.stroke();

  // 일일 권장량 선 그리기
  const recommendY = padding + chartHeight - (50 / maxSugar * chartHeight);
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, recommendY);
  ctx.lineTo(padding + chartWidth, recommendY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 권장량 텍스트
  ctx.fillStyle = '#EF4444';
  ctx.font = '12px Outfit';
  ctx.fillText('일일 권장량 (50g)', padding + chartWidth - 120, recommendY - 5);

  // 막대 그리기
  products.forEach((product, index) => {
    const barHeight = (product.sugar / maxSugar) * chartHeight;
    const x = padding + (index * barWidth) + barWidth * 0.1;
    const y = padding + chartHeight - barHeight;
    const width = barWidth * 0.8;

    // 막대
    const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight);
    gradient.addColorStop(0, '#2DD4BF');
    gradient.addColorStop(1, '#14B8A6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, barHeight);

    // 당류 값 표시
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 14px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(`${product.sugar}g`, x + width / 2, y - 5);

    // 제품명 표시
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Outfit';
    ctx.save();
    ctx.translate(x + width / 2, padding + chartHeight + 15);
    ctx.rotate(-Math.PI / 4);
    
    const maxNameLength = 15;
    const displayName = product.name.length > maxNameLength 
      ? product.name.substring(0, maxNameLength) + '...' 
      : product.name;
    
    ctx.fillText(displayName, 0, 0);
    ctx.restore();
  });

  // Y축 라벨
  ctx.fillStyle = '#94A3B8';
  ctx.font = '12px Outfit';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = (maxSugar / 5) * i;
    const y = padding + chartHeight - (value / maxSugar * chartHeight);
    ctx.fillText(Math.round(value) + 'g', padding - 10, y + 4);
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderProducts();
  renderCompareSection();

  // 윈도우 리사이즈 시 차트 다시 그리기
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (state.selectedProducts.length > 0) {
        drawChart();
      }
    }, 250);
  });
});
