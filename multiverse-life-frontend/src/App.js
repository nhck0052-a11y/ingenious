import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    majorJob: '',
    personality: '',
    currentWorries: '',
    scenario: '',
  });

  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5years'); // '5years', '10years', '20years'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScenarioChange = (e) => {
    setFormData({ ...formData, scenario: e.target.value });
  };

  const handleSimulate = () => {
    // --- Dummy Simulation Logic (will be replaced by actual AI call) ---
    const dummyResults = {
      '5years': {
        story: "5년 후 당신은 선택한 시나리오에 따라 새로운 분야에서 역량을 발휘하며 안정적인 성장을 이루었습니다. 초기에는 어려움도 있었지만, 당신의 끈기와 노력이 빛을 발했습니다. 새로운 사람들과의 관계 속에서 삶의 활력을 찾고 있습니다.",
        job: "주니어 데이터 분석가",
        salary: "5천만원",
        residence: "서울 교외 신축 아파트",
        lifestyle: "주말에는 등산과 독서 모임에 참여하며 자기계발에 힘쓰는 라이프스타일",
        relationships: "안정적인 연애 중",
        timeline: [
          { year: '1년차', event: '새로운 분야 교육 이수 및 자격증 취득' },
          { year: '2년차', event: '첫 이직 성공, 직무 만족도 상승' },
          { year: '3년차', event: '주택 청약 당첨, 내 집 마련의 꿈 시작' },
          { year: '4년차', event: '해외 배낭여행으로 견문 확장' },
          { year: '5년차', event: '팀 프로젝트 성공으로 핵심 인재로 인정받음' },
        ],
      },
      '10years': {
        story: "10년 후 당신은 해당 분야의 전문가로 성장하여 팀을 이끄는 리더가 되었습니다. 경제적인 여유를 바탕으로 투자에도 성공하여 안정적인 자산가로 발돋움했습니다. 가족과 함께 여유로운 시간을 보내며 삶의 진정한 의미를 찾아가고 있습니다.",
        job: "시니어 데이터 분석가 / 팀 리더",
        salary: "1억원",
        residence: "서울 도심 고급 오피스텔",
        lifestyle: "워라밸을 중시하며, 고급 문화생활과 해외여행을 즐기는 라이프스타일",
        relationships: "결혼하여 행복한 가정을 꾸림",
        timeline: [
          { year: '6년차', event: '석사 학위 취득, 전문성 심화' },
          { year: '7년차', event: '해외 지사 파견, 글로벌 경험 축적' },
          { year: '8년차', event: '부동산 투자 성공, 자산 증식 시작' },
          { year: '9년차', event: '결혼 및 자녀 출산' },
          { year: '10년차', event: '자신만의 사업 아이템 구상 시작' },
        ],
      },
      '20years': {
        story: "20년 후 당신은 시뮬레이션된 분야에서 성공적인 스타트업을 창업하여 사회에 긍정적인 영향력을 미치는 기업가가 되었습니다. 당신의 통찰력과 리더십으로 많은 사람에게 영감을 주고 있습니다. 은퇴 후에는 사회 공헌 활동에 집중하며 존경받는 삶을 살고 있습니다.",
        job: "스타트업 CEO / 멘토",
        salary: "3억원 이상",
        residence: "제주도 타운하우스",
        lifestyle: "사회 공헌 활동과 후학 양성에 집중하며 여유롭고 명예로운 라이프스타일",
        relationships: "자녀들이 독립하여 성공적인 삶을 살고 있음",
        timeline: [
          { year: '11년차', event: '성공적인 스타트업 창업 및 투자 유치' },
          { year: '13년차', event: '사업 확장, 사회적 기업으로 성장' },
          { year: '15년차', event: '자서전 출간, 베스트셀러 등극' },
          { year: '18년차', event: '대학교 겸임교수로 후학 양성' },
          { year: '20년차', event: '명예로운 은퇴, 사회 공헌 재단 설립' },
        ],
      },
    };
    setSimulationResults(dummyResults);
    setSelectedTimeframe('5years'); // Show 5-year results by default after simulation
  };

  const currentResults = simulationResults ? simulationResults[selectedTimeframe] : null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>멀티버스 라이프: AI 평행세계 인생 시뮬레이터</h1>
        <p>선택 하나로 인생은 얼마나 달라질까?</p>
      </header>

      <main className="App-main">
        <section className="input-section">
          <h2>당신의 현재와 선택을 입력해주세요</h2>
          <div className="form-group">
            <label htmlFor="age">나이:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="예: 30"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">성별:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">그 외</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="majorJob">전공 또는 직업:</label>
            <input
              type="text"
              id="majorJob"
              name="majorJob"
              value={formData.majorJob}
              onChange={handleInputChange}
              placeholder="예: 소프트웨어 엔지니어"
            />
          </div>
          <div className="form-group">
            <label htmlFor="personality">성격 (키워드):</label>
            <input
              type="text"
              id="personality"
              name="personality"
              value={formData.personality}
              onChange={handleInputChange}
              placeholder="예: 외향적, 분석적"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentWorries">현재 고민:</label>
            <textarea
              id="currentWorries"
              name="currentWorries"
              value={formData.currentWorries}
              onChange={handleInputChange}
              placeholder="예: 커리어 전환, 재정적 불안정"
            ></textarea>
          </div>

          <h3>인생 분기 선택지:</h3>
          <div className="scenario-options">
            <label>
              <input
                type="radio"
                name="scenario"
                value="다른 대학을 갔으면?"
                checked={formData.scenario === "다른 대학을 갔으면?"}
                onChange={handleScenarioChange}
              />
              다른 대학을 갔으면?
            </label>
            <label>
              <input
                type="radio"
                name="scenario"
                value="창업을 했으면?"
                checked={formData.scenario === "창업을 했으면?"}
                onChange={handleScenarioChange}
              />
              창업을 했으면?
            </label>
            <label>
              <input
                type="radio"
                name="scenario"
                value="해외로 나갔으면?"
                checked={formData.scenario === "해외로 나갔으면?"}
                onChange={handleScenarioChange}
              />
              해외로 나갔으면?
            </label>
            <label>
              <input
                type="radio"
                name="scenario"
                value="공무원이 되었으면?"
                checked={formData.scenario === "공무원이 되었으면?"}
                onChange={handleScenarioChange}
              />
              공무원이 되었으면?
            </label>
            <label>
              <input
                type="radio"
                name="scenario"
                value="투자를 시작했으면?"
                checked={formData.scenario === "투자를 시작했으면?"}
                onChange={handleScenarioChange}
              />
              투자를 시작했으면?
            </label>
          </div>

          <button className="simulate-button" onClick={handleSimulate}>
            AI로 시뮬레이션 하기
          </button>
        </section>

        <section className="results-section">
          <h2>AI가 시뮬레이션한 당신의 평행세계</h2>
          {simulationResults ? (
            <>
              <div className="timeframe-selector">
                <button
                  className={selectedTimeframe === '5years' ? 'active' : ''}
                  onClick={() => setSelectedTimeframe('5years')}
                >
                  5년 후
                </button>
                <button
                  className={selectedTimeframe === '10years' ? 'active' : ''}
                  onClick={() => setSelectedTimeframe('10years')}
                >
                  10년 후
                </button>
                <button
                  className={selectedTimeframe === '20years' ? 'active' : ''}
                  onClick={() => setSelectedTimeframe('20years')}
                >
                  20년 후
                </button>
              </div>

              {currentResults && (
                <div className="simulation-output">
                  <h3>{selectedTimeframe === '5years' ? '5년 후' : selectedTimeframe === '10years' ? '10년 후' : '20년 후'}</h3>
                  <p className="life-story">{currentResults.story}</p>

                  <div className="data-points">
                    <p><strong>직업:</strong> {currentResults.job}</p>
                    <p><strong>예상 연봉:</strong> {currentResults.salary}</p>
                    <p><strong>거주 지역:</strong> {currentResults.residence}</p>
                    <p><strong>라이프스타일:</strong> {currentResults.lifestyle}</p>
                    <p><strong>연애 및 결혼 스토리:</strong> {currentResults.relationships}</p>
                  </div>

                  <h4>인생 주요 이벤트 타임라인</h4>
                  <ul className="timeline">
                    {currentResults.timeline.map((item, index) => (
                      <li key={index}><strong>{item.year}:</strong> {item.event}</li>
                    ))}
                  </ul>

                  <div className="share-card-placeholder">
                    <p>✨ 시뮬레이션 결과 카드 (SNS 공유용) ✨</p>
                    {/* Placeholder for an image or dynamically generated card */}
                    <div style={{
                      width: '100%',
                      height: '150px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      border: '1px dashed #ccc'
                    }}>
                      [여기에 공유할 결과 이미지가 표시됩니다]
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>시뮬레이션 버튼을 눌러 당신의 평행세계를 탐험해보세요!</p>
          )}
        </section>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Multiverse Life. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
