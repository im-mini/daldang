// 1. 초기 데이터 렌더링 및 상태 관리
let filteredDrinks = [...drinkData];
let compareBasket = [];

const drinkGrid = document.getElementById('drinkGrid');
const totalCountEl = document.getElementById('totalCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const compareBar = document.getElementById('compareStickyBar');
const compareCountEl = document.getElementById('compareSelectedCount');

// 2. 음료 카드 렌더링 함수
function renderDrinks(data) {
    drinkGrid.innerHTML = '';
    totalCountEl.textContent = data.length;

    data.forEach(drink => {
        // 각설탕 개수 계산 (5g당 1개)
        const cubeCount = Math.floor(drink.sugar / 5);
        const cubes = drink.sugar > 0 ? "🧊".repeat(cubeCount || 1) : "Clean ✨";
        
        // 비교하기 버튼 활성화 여부
        const isSelected = compareBasket.find(item => item.id === drink.id);

        const card = document.createElement('div');
        card.className = 'drink-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="brand">${drink.brand}</span>
                <span class="badge ${drink.sweetenerType}">${drink.sweetenerName}</span>
            </div>
            <h3>${drink.name}</h3>
            <div class="sugar-info">${drink.sugar}g</div>
            <div class="sugar-cubes">${cubes}</div>
            <div class="tags">${drink.tags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>
            <button class="btn-compare ${isSelected ? 'active' : ''}" 
                    onclick="toggleCompare(${drink.id})">
                ${isSelected ? '선택됨' : '비교담기'}
            </button>
        `;
        drinkGrid.appendChild(card);
    });
}

// 3. 검색 로직
function handleSearch() {
    const keyword = searchInput.value.toLowerCase();
    filteredDrinks = drinkData.filter(drink => 
        drink.name.toLowerCase().includes(keyword) || 
        drink.brand.toLowerCase().includes(keyword)
    );
    handleSort(); // 검색 후 현재 정렬 상태 유지
}

// 4. 정렬 로직
function handleSort() {
    const sortValue = sortSelect.value;
    if (sortValue === 'sugar-asc') {
        filteredDrinks.sort((a, b) => a.sugar - b.sugar);
    } else if (sortValue === 'sugar-desc') {
        filteredDrinks.sort((a, b) => b.sugar - a.sugar);
    } else {
        filteredDrinks.sort((a, b) => b.id - a.id); // 최신순(ID 역순)
    }
    renderDrinks(filteredDrinks);
}

// 5. 비교하기 담기 로직
function toggleCompare(id) {
    const drink = drinkData.find(d => d.id === id);
    const index = compareBasket.findIndex(item => item.id === id);

    if (index > -1) {
        compareBasket.splice(index, 1);
    } else {
        if (compareBasket.length >= 3) {
            alert('비교는 최대 3개까지만 가능합니다!');
            return;
        }
        compareBasket.push(drink);
    }
    updateCompareBar();
    renderDrinks(filteredDrinks); // 버튼 상태 업데이트를 위해 재렌더링
}

// 6. 하단 고정 비교 바 업데이트
function updateCompareBar() {
    if (compareBasket.length > 0) {
        compareBar.classList.remove('hidden');
        compareCountEl.textContent = compareBasket.length;
    } else {
        compareBar.classList.add('hidden');
    }
}

// 7. 비교 모달 열기
function openCompareModal() {
    const modal = document.getElementById('compareModal');
    const head = document.getElementById('compareHead');
    const body = document.getElementById('compareBody');

    head.innerHTML = '<tr><th>정보</th>' + compareBasket.map(d => `<th>${d.name}</th>`).join('') + '</tr>';
    
    body.innerHTML = `
        <tr><td>브랜드</td>${compareBasket.map(d => `<td>${d.brand}</td>`).join('')}</tr>
        <tr><td>당류</td>${compareBasket.map(d => `<td>${d.sugar}g</td>`).join('')}</tr>
        <tr><td>감미료</td>${compareBasket.map(d => `<td><span class="badge ${d.sweetenerType}">${d.sweetenerName}</span></td>`).join('')}</tr>
        <tr><td>사이즈</td>${compareBasket.map(d => `<td>${d.size}</td>`).join('')}</tr>
    `;

    modal.classList.remove('hidden');
}

// 이벤트 리스너
searchInput.addEventListener('input', handleSearch);
sortSelect.addEventListener('change', handleSort);
document.getElementById('compareOpenBtn').addEventListener('click', openCompareModal);
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('compareModal').classList.add('hidden');
});
document.getElementById('compareResetBtn').addEventListener('click', () => {
    compareBasket = [];
    updateCompareBar();
    renderDrinks(filteredDrinks);
});

// 초기 실행
renderDrinks(drinkData);
