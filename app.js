let allDrinks = [];      
let filteredDrinks = []; 
let displayCount = 20;   
let compareCart = [];    // 비교함 장바구니

const brands = ['mega', 'starbucks', 'compose']; 

// 1. 초기 로드 및 캐싱 (동일)
async function initData() {
    const cached = localStorage.getItem('all-drinks-cache');
    if (cached) {
        allDrinks = JSON.parse(cached);
        filteredDrinks = [...allDrinks];
        renderInitialData();
    } else {
        try {
            const promises = brands.map(b => fetch(`./data/${b}.json`).then(res => res.json()));
            const results = await Promise.all(promises);
            allDrinks = results.flat();
            localStorage.setItem('all-drinks-cache', JSON.stringify(allDrinks));
            filteredDrinks = [...allDrinks];
            renderInitialData();
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    }
}

// 2. 비교함 담기/제거 함수
function toggleCompare(id) {
    const drink = allDrinks.find(d => d.id === id);
    const index = compareCart.findIndex(item => item.id === id);

    if (index > -1) {
        compareCart.splice(index, 1); // 이미 있으면 제거
    } else {
        if (compareCart.length >= 3) {
            alert("비교는 최대 3개까지만 가능합니다!");
            return;
        }
        compareCart.push(drink); // 없으면 추가
    }
    updateCompareUI();
    renderDrinks(); // 카드 선택 상태 표시를 위해 재렌더링
}

// 3. 비교함 UI 업데이트
function updateCompareUI() {
    const cartEl = document.getElementById('compare-cart');
    if (compareCart.length === 0) {
        cartEl.innerHTML = '<p>비교할 음료를 선택하세요 (최대 3개)</p>';
        return;
    }

    cartEl.innerHTML = compareCart.map(item => `
        <div class="compare-item">
            <span>${item.name} (${item.sugar}g)</span>
            <button onclick="toggleCompare('${item.id}')">❌</button>
        </div>
    `).join('') + `<button onclick="openCompareModal()" class="battle-btn">당류 배틀 시작!</button>`;
}

// 4. 렌더링 (카드에 클릭 이벤트 추가)
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
                    <div class="sugar-bar-fill" style="width: ${Math.min(drink.sugar * 2, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.insertAdjacentHTML('beforeend', html);
}

// 3. 검색 기능 (브랜드 상관없이 전체 검색)
function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();
    filteredDrinks = allDrinks.filter(drink => 
        drink.name.toLowerCase().includes(keyword) || 
        drink.brand.includes(keyword) ||
        drink.tags.some(tag => tag.includes(keyword))
    );
    renderInitialData();
}

// 4. 정렬 기능 (기존 handleSort 유지 + 최적화)
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

// 5. 렌더링 엔진 (무한 스크롤 포함)
function renderInitialData() {
    displayCount = 20;
    document.getElementById('drink-list').innerHTML = ''; // 기존 목록 비우기
    renderDrinks();
}

function renderDrinks() {
    const container = document.getElementById('drink-list');
    const nextBatch = filteredDrinks.slice(displayCount - 20, displayCount);
    
    const html = nextBatch.map(drink => `
        <div class="card ${drink.sugar > 50 ? 'danger' : ''}">
            <div class="brand-tag">${drink.brand}</div>
            <h3>${drink.name}</h3>
            <div class="sugar-info">
                <span>당류: ${drink.sugar}g</span>
                <div class="sugar-bar" style="width: ${Math.min(drink.sugar * 2, 100)}%"></div>
            </div>
            <p class="tags">${drink.tags.map(t => `#${t}`).join(' ')}</p>
        </div>
    `).join('');
    
    container.insertAdjacentHTML('beforeend', html);
}

// 6. 무한 스크롤 감지 (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && displayCount < filteredDrinks.length) {
        displayCount += 20;
        renderDrinks();
    }
}, { threshold: 1.0 });

observer.observe(document.getElementById('sentinel'));

// 실행
initData();
