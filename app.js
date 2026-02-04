let allDrinks = [];      // 전체 브랜드 통합 데이터
let filteredDrinks = []; // 검색/필터가 적용된 결과
let displayCount = 20;   // 현재 화면에 보여줄 개수
let compareCart = [];    // 비교함에 담긴 음료 (최대 3개)

const brands = ['mega', 'starbucks', 'compose']; // 로드할 브랜드 리스트

// 1. 초기 데이터 로드 및 캐싱
async function initData() {
    const cached = localStorage.getItem('all-drinks-cache');
    
    if (cached) {
        allDrinks = JSON.parse(cached);
        filteredDrinks = [...allDrinks];
        renderInitialData();
    } else {
        try {
            // 모든 브랜드 JSON을 동시에 가져오기
            const promises = brands.map(b => fetch(`./data/${b}.json`).then(res => res.json()));
            const results = await Promise.all(promises);
            allDrinks = results.flat();
            
            localStorage.setItem('all-drinks-cache', JSON.stringify(allDrinks));
            filteredDrinks = [...allDrinks];
            renderInitialData();
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        }
    }
}

// 2. 브랜드 필터링
function filterByBrand(brandName) {
    if (brandName === 'all') {
        filteredDrinks = [...allDrinks];
    } else {
        filteredDrinks = allDrinks.filter(d => d.brand === brandName);
    }
    renderInitialData();
}

// 3. 검색 핸들러
function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();
    filteredDrinks = allDrinks.filter(drink => 
        drink.name.toLowerCase().includes(keyword) || 
        drink.brand.includes(keyword) ||
        (drink.tags && drink.tags.some(tag => tag.includes(keyword)))
    );
    renderInitialData();
}

// 4. 정렬 기능
function handleSort(criteria) {
    if (criteria === 'lowSugar') {
        filteredDrinks.sort((a, b) => a.sugar - b.sugar);
    } else if (criteria === 'highSugar') {
        filteredDrinks.sort((a, b) => b.sugar - a.sugar);
    } else if (criteria === 'name') {
        filteredDrinks.sort((a, b) => a.name.localeCompare(b.name));
    }
    renderInitialData();
}

// 5. 비교함 담기 로직
function toggleCompare(id) {
    const drink = allDrinks.find(d => d.id === id);
    const index = compareCart.findIndex(item => item.id === id);

    if (index > -1) {
        compareCart.splice(index, 1);
    } else {
        if (compareCart.length >= 3) {
            alert("비교는 최대 3개까지만 가능합니다!");
            return;
        }
        compareCart.push(drink);
    }
    updateCompareUI();
    
    // 선택 상태 시각화를 위해 현재 렌더링된 카드들만 업데이트
    renderInitialData(); 
}

// 6. 비교함 UI 업데이트
function updateCompareUI() {
    const cartContainer = document.getElementById('compare-cart-ui');
    const btnArea = document.getElementById('battle-btn-area');

    if (compareCart.length === 0) {
        cartContainer.innerHTML = '<span>음료를 선택하여 당류를 비교해보세요</span>';
        btnArea.innerHTML = '';
        return;
    }

    cartContainer.innerHTML = compareCart.map(item => `
        <div class="compare-chip">
            ${item.brand.substring(0,1)} | ${item.name}
            <span onclick="event.stopPropagation(); toggleCompare('${item.id}')" style="cursor:pointer; margin-left:5px;">✕</span>
        </div>
    `).join('');

    btnArea.innerHTML = `<button class="battle-btn" onclick="openCompareModal()">배틀 시작!</button>`;
}

// 7. 렌더링 엔진
function renderInitialData() {
    displayCount = 20;
    document.getElementById('drink-list').innerHTML = '';
    renderDrinks();
}

function renderDrinks() {
    const container = document.getElementById('drink-list');
    const nextBatch = filteredDrinks.slice(displayCount - 20, displayCount);
    
    const html = nextBatch.map(drink => {
        const isSelected = compareCart.some(item => item.id === drink.id);
        return `
            <div class="card ${isSelected ? 'selected' : ''}" onclick="toggleCompare('${drink.id}')">
                <div class="brand-tag">${drink.brand}</div>
                <h3>${drink.name}</h3>
                <p>당류: <strong>${drink.sugar}g</strong></p>
                <div class="sugar-bar-bg">
                    <div class="sugar-bar-fill" style="width: ${Math.min(drink.sugar * 1.5, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.insertAdjacentHTML('beforeend', html);
}

// 8. 모달 제어
function openCompareModal() {
    const modal = document.getElementById('compare-modal');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    const sortedBattle = [...compareCart].sort((a, b) => b.sugar - a.sugar);
    
    content.innerHTML = sortedBattle.map((item, index) => `
        <div style="margin-bottom: 20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span><strong>${index + 1}위</strong> ${item.brand} ${item.name}</span>
                <span>${item.sugar}g</span>
            </div>
            <div style="background:#eee; height:15px; border-radius:10px; overflow:hidden;">
                <div style="background:${index === 0 ? '#ff4757' : '#ffa502'}; width:${Math.min(item.sugar * 1.5, 100)}%; height:100%;"></div>
            </div>
        </div>
    `).join('');

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function closeModal() {
    document.getElementById('compare-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}

// 9. 무한 스크롤 관찰자
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && displayCount < filteredDrinks.length) {
        displayCount += 20;
        renderDrinks();
    }
}, { threshold: 0.1 });

observer.observe(document.getElementById('sentinel'));

// 실행
initData();
