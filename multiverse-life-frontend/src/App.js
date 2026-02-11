import React, { useState } from 'react';
import { httpsCallable } from "firebase/functions"; // Import httpsCallable
import './App.css';

function App({ firebaseFunctions }) { // Receive firebaseFunctions prop
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

  const const handleSimulate = () => {
    // --- Dummy Simulation Logic (will be replaced by actual AI call) ---
    // This dummy data now uses formData.scenario for better representation
    const dummyResults = {
      '5years': {
        story: `(AI 시뮬레이션 - 5년 후) 당신이 "${formData.scenario}" 선택했다면, 새로운 환경에서 역량을 발휘하며 안정적인 성장을 이루었습니다. 초기에는 어려움도 있었지만, 당신의 끈기와 노력이 빛을 발했습니다. 새로운 사람들과의 관계 속에서 삶의 활력을 찾고 있습니다.`,
        job: "주니어 AI 전문가",
        salary: "6천만원",
        residence: "판교 테크노밸리 근처 소형 오피스텔",
        lifestyle: "스타트업 문화에 푹 빠져 일과 성장에 몰두하는 삶",
        relationships: "직장 동료들과의 돈독한 유대 형성, 새로운 인연을 기다리는 중",
        timeline: [
          { year: '1년차', event: `새로운 분야 학습 및 ${formData.scenario} 관련 프로젝트 참여` },
          { year: '2년차', event: '핵심 팀원으로 인정받고 중요한 역할 수행' },
          { year: '3년차', event: '첫 창업 제안을 받거나 이직 기회 모색' },
          { year: '4년차', event: '자기 계발을 위한 해외 워크숍 참여' },
          { year: '5년차', event: '업계 내에서 이름 알리기 시작, 멘토 역할 수행' },
        ],
      },
      '10years': {
        story: `(AI 시뮬레이션 - 10년 후) 당신의 선택은 거대한 성공의 씨앗이 되어, 이제는 해당 분야의 선구자로 자리매김했습니다. 수많은 팔로워와 협력자가 당신의 비전을 따르며, 사회에 큰 영향력을 행사하고 있습니다. 여유와 함께 찾아온 책임감으로 더욱 겸손해질 것입니다.`,
        job: "시니어 AI 분석가 / 팀 리더",
        salary: "2억원 이상",
        residence: "강남 고급 주상복합 아파트",
        lifestyle: "성공한 사업가로서 사회적 책임감을 느끼며 워라밸을 추구하는 삶",
        relationships: "오랜 연인과 결혼하여 안정적인 가정을 이룸",
        timeline: [
          { year: '6년차', event: '석사 학위 취득, 전문성 심화' },
          { year: '7년차', event: '해외 지사 파견, 글로벌 경험 축적' },
          { year: '8년차', event: '부동산 투자 성공, 자산 증식 시작' },
          { year: '9년차', event: '결혼 및 자녀 출산' },
          { year: '10년차', event: '자신만의 사업 아이템 구상 시작' },
        ],
      },
      '20years': {
        story: `(AI 시뮬레이션 - 20년 후) 20년이 지난 지금, 당신의 초기 선택은 세상을 바꾸는 혁신을 이끌었습니다. 당신의 이름은 역사에 기록되었고, 많은 이들의 롤모델이 되었습니다. 이제는 다음 세대를 위한 길을 닦으며 평화롭고 의미 있는 삶을 살고 있습니다.`,
        job: "은퇴 후 AI 자문 위원 / 투자자",
        salary: "측정 불가 (자산가)",
        residence: "제주도 해변가 저택",
        lifestyle: "자유로운 영혼으로 전 세계를 여행하며 영감을 주는 삶",
        relationships: "손주들과 행복한 시간, 배우자와 변함없는 사랑",
        timeline: [
          { year: '11년차', event: '성공적인 기업 매각, 새로운 도전 모색' },
          { year: '13년차', event: '인공지능 교육 재단 설립' },
          { year: '15년차', event: '유엔(UN) 자문 위원 활동 시작' },
          { year: '18년차', event: '회고록 출간, 전 세계 독자들에게 감동 선사' },
          { year: '20년차', event: '노벨 평화상 후보 지명' },
        ],
      },
    };
    setSimulationResults(dummyResults);
    setSelectedTimeframe('5years'); // Show 5-year results by default after simulation
  };

  // Function to handle downloading the report
  const handleDownloadReport = async () => {
    if (!simulationResults) {
      alert('시뮬레이션 결과를 먼저 생성해주세요!');
      return;
    }

    try {
      const saveResults = httpsCallable(firebaseFunctions, 'saveResultsToFile');
      const response = await saveResults({ results: simulationResults });

      if (response.data.success) {
        const { fileName, fileContent, fileType } = response.data;
        const decodedContent = atob(fileContent); // Decode base64
        const blob = new Blob([decodedContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('시뮬레이션 보고서가 다운로드되었습니다!');
      } else {
        alert('보고서 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('보고서 다운로드 중 오류가 발생했습니다: ' + error.message);
    }
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
                  <button className="download-button" onClick={handleDownloadReport}>
                    <i className="fas fa-download"></i> 시뮬레이션 보고서 다운로드
                  </button>
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