const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

// 샘플 데이터 (실제 조사한 데이터 기반)
const products = [
  // 스타벅스
  {
    id: 1,
    brand: '스타벅스',
    name: '아메리카노',
    category: '커피',
    sugar: 0,
    size: 'Tall (355ml)'
  },
  {
    id: 2,
    brand: '스타벅스',
    name: '카페 라떼',
    category: '커피',
    sugar: 17,
    size: 'Tall (355ml)'
  },
  {
    id: 3,
    brand: '스타벅스',
    name: '자바칩 프라푸치노',
    category: '프라푸치노',
    sugar: 48,
    size: 'Tall (355ml)'
  },
  {
    id: 4,
    brand: '스타벅스',
    name: '카라멜 마키아또',
    category: '커피',
    sugar: 25,
    size: 'Tall (355ml)'
  },
  {
    id: 5,
    brand: '스타벅스',
    name: '자몽 허니 블랙티',
    category: '티',
    sugar: 30,
    size: 'Tall (355ml)'
  },
  {
    id: 6,
    brand: '스타벅스',
    name: '아이스크림 블렌딩 콜드브루',
    category: '블렌디드',
    sugar: 53,
    size: 'Tall (355ml)'
  },
  {
    id: 7,
    brand: '스타벅스',
    name: '말차 라떼',
    category: '티',
    sugar: 32,
    size: 'Tall (355ml)'
  },
  {
    id: 8,
    brand: '스타벅스',
    name: '바닐라 라떼',
    category: '커피',
    sugar: 35,
    size: 'Tall (355ml)'
  },
  
  // 투썸플레이스
  {
    id: 9,
    brand: '투썸플레이스',
    name: '아메리카노',
    category: '커피',
    sugar: 0,
    size: '기본 (355ml)'
  },
  {
    id: 10,
    brand: '투썸플레이스',
    name: '카페 라떼',
    category: '커피',
    sugar: 15,
    size: '기본 (355ml)'
  },
  {
    id: 11,
    brand: '투썸플레이스',
    name: '20곡 오틀리 라떼',
    category: '커피',
    sugar: 24,
    size: '기본 (315ml)'
  },
  {
    id: 12,
    brand: '투썸플레이스',
    name: '초코 케이크',
    category: '디저트',
    sugar: 38,
    size: '1조각'
  },
  {
    id: 13,
    brand: '투썸플레이스',
    name: '딸기 케이크',
    category: '디저트',
    sugar: 42,
    size: '1조각'
  },
  {
    id: 14,
    brand: '투썸플레이스',
    name: '티라미수',
    category: '디저트',
    sugar: 35,
    size: '1조각'
  },
  
  // 이디야
  {
    id: 15,
    brand: '이디야',
    name: '아메리카노',
    category: '커피',
    sugar: 0,
    size: 'Large (532ml)'
  },
  {
    id: 16,
    brand: '이디야',
    name: '카페 라떼',
    category: '커피',
    sugar: 24,
    size: 'Large (532ml)'
  },
  {
    id: 17,
    brand: '이디야',
    name: '멜팅 피스타치오',
    category: '음료',
    sugar: 49,
    size: 'Large (532ml)'
  },
  {
    id: 18,
    brand: '이디야',
    name: '헤이즐넛 젤라또 카페모카',
    category: '음료',
    sugar: 71,
    size: 'Extra (680ml)'
  },
  {
    id: 19,
    brand: '이디야',
    name: '너티 초콜릿',
    category: '음료',
    sugar: 58,
    size: 'Large (532ml)'
  },
  {
    id: 20,
    brand: '이디야',
    name: '아샷추 복숭아',
    category: '음료',
    sugar: 57,
    size: 'Large (532ml)'
  },
  {
    id: 21,
    brand: '이디야',
    name: '제로슈가 달달커피',
    category: '커피',
    sugar: 0,
    size: 'Large (532ml)'
  }
];

// 당류별 이모티콘 반환
function getSugarEmoji(sugar) {
  if (sugar === 0) return '😍';
  if (sugar <= 10) return '😍';
  if (sugar <= 25) return '🙂';
  if (sugar <= 40) return '😞';
  if (sugar <= 60) return '🤪';
  return '😱';
}

// 메인 앱 컴포넌트
function App() {
  const [selectedBrands, setSelectedBrands] = useState(['전체']);
  const [selectedCategories, setSelectedCategories] = useState(['전체']);
  const [sortBy, setSortBy] = useState('당류 낮은순');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  // 브랜드 목록
  const brands = ['전체', ...new Set(products.map(p => p.brand))];
  
  // 카테고리 목록
  const categories = ['전체', ...new Set(products.map(p => p.category))];

  // 필터링된 제품 목록
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 브랜드 필터
    if (!selectedBrands.includes('전체')) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // 카테고리 필터
    if (!selectedCategories.includes('전체')) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    if (sortBy === '당류 낮은순') {
      filtered.sort((a, b) => a.sugar - b.sugar);
    } else if (sortBy === '당류 높은순') {
      filtered.sort((a, b) => b.sugar - a.sugar);
    }

    return filtered;
  }, [selectedBrands, selectedCategories, sortBy, searchTerm]);

  // 브랜드 필터 토글
  const toggleBrand = (brand) => {
    if (brand === '전체') {
      setSelectedBrands(['전체']);
    } else {
      const newBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter(b => b !== brand)
        : [...selectedBrands.filter(b => b !== '전체'), brand];
      setSelectedBrands(newBrands.length === 0 ? ['전체'] : newBrands);
    }
  };

  // 카테고리 필터 토글
  const toggleCategory = (category) => {
    if (category === '전체') {
      setSelectedCategories(['전체']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== '전체'), category];
      setSelectedCategories(newCategories.length === 0 ? ['전체'] : newCategories);
    }
  };

  // 제품 선택/해제
  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.find(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // 비교 데이터 준비
  const compareData = selectedProducts.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    fullName: p.name,
    당류: p.sugar,
    브랜드: p.brand
  }));

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>☕ 당류 비교</h1>
          <p className="subtitle">카페 음료 & 디저트의 당류를 한눈에 비교하세요</p>
        </div>
      </header>

      <div className="daily-limit-info">
        💡 <strong>일일 권장 당류 섭취량: 50g</strong> (WHO 기준)
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">브랜드</label>
          <div className="filter-buttons">
            {brands.map(brand => (
              <button
                key={brand}
                className={`filter-btn ${selectedBrands.includes(brand) ? 'active' : ''}`}
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">카테고리</label>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">정렬</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${sortBy === '당류 낮은순' ? 'active' : ''}`}
              onClick={() => setSortBy('당류 낮은순')}
            >
              당류 낮은순
            </button>
            <button
              className={`filter-btn ${sortBy === '당류 높은순' ? 'active' : ''}`}
              onClick={() => setSortBy('당류 높은순')}
            >
              당류 높은순
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">검색</label>
          <input
            type="text"
            className="search-box"
            placeholder="제품명 또는 브랜드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className={`product-card ${selectedProducts.find(p => p.id === product.id) ? 'selected' : ''}`}
            onClick={() => toggleProductSelection(product)}
          >
            <div className="product-header">
              <span className="product-brand">{product.brand}</span>
              <span className="sugar-emoji">{getSugarEmoji(product.sugar)}</span>
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category} · {product.size}</p>
            <div className="sugar-info">
              <span className="sugar-amount">{product.sugar}</span>
              <span className="sugar-unit">g</span>
            </div>
            <div className="sugar-bar">
              <div 
                className="sugar-bar-fill" 
                style={{ width: `${Math.min((product.sugar / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div className="compare-section">
          <div className="compare-header">
            <h2 className="compare-title">📊 당류 비교</h2>
            <span className="selected-count">{selectedProducts.length}개 선택</span>
          </div>
          
          <div className="compare-chart">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                  label={{ value: '당류 (g)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F1F5F9'
                  }}
                  formatter={(value, name) => [value + 'g', '당류']}
                  labelFormatter={(label) => {
                    const product = compareData.find(d => d.name === label);
                    return product ? product.fullName : label;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', color: '#94A3B8' }}
                />
                <ReferenceLine 
                  y={50} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3" 
                  label={{ value: '일일 권장량 (50g)', position: 'right', fill: '#EF4444', fontSize: 12 }}
                />
                <Bar 
                  dataKey="당류" 
                  fill="#2DD4BF"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className="compare-section">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>제품을 클릭하여 당류를 비교해보세요</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
