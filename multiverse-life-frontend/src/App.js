import React, { useState, useEffect, useRef } from 'react';
import { httpsCallable } from "firebase/functions";
import './App.css';

// ASCII Art for Crystal Ball (Loading State)
const crystalBallAscii = `
     .-------.
    /         \\
   /    .-.    \\
  |    /   \\    |
  |   |  @  |   |
  |    \\   /    |
   \\    '-'    /
    \\         /
     '-------'
`;

// Helper function to generate ASCII bar graph
const generateAsciiBar = (percentage) => {
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
};

const resultSound = new Audio('/sounds/beep.mp3'); // Assuming a beep.mp3 exists in public/sounds

function App({ firebaseFunctions }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    majorJob: '',
    personality: '',
    currentWorries: '', // Changed to string for comma-separated keywords
    scenario: '',
  });

  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5years');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [glitchEffect, setGlitchEffect] = useState(false); // New glitch effect state
  const resultsRef = useRef(null); // Ref for scrolling to results

  useEffect(() => {
    if (simulationResults) {
      // Trigger glitch effect and sound when results are loaded
      setGlitchEffect(true);
      if (resultSound) {
        resultSound.play().catch(e => console.error("Error playing sound:", e));
      }
      const timer = setTimeout(() => {
        setGlitchEffect(false);
        // Scroll to results after glitch effect
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Glitch duration

      return () => clearTimeout(timer);
    }
  }, [simulationResults]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScenarioChange = (e) => {
    setFormData({ ...formData, scenario: e.target.value });
  };

  const handleSimulate = async () => {
    setError(null);
    setIsLoading(true);
    setSimulationResults(null); // Clear previous results

    try {
      const simulateLifeCallable = httpsCallable(firebaseFunctions, 'simulateLife');
      
      // Prepare data for the Firebase Function call, including conversation history
      const requestData = {
        ...formData,
        conversationHistory: conversationHistory,
      };

      const response = await simulateLifeCallable(requestData);

      if (response.data.success) {
        setSimulationResults(response.data.results);
        setSelectedTimeframe('5years'); // Show 5-year results by default

        // Update conversation history
        const newHistoryEntry = {
          role: "user",
          text: `나이: ${formData.age}, 성별: ${formData.gender}, 직업: ${formData.majorJob}, 성격: ${formData.personality}, 고민: ${formData.currentWorries}, 선택: ${formData.scenario}`,
        };
        const aiResponseEntry = {
          role: "model",
          text: `5년 후: ${response.data.results['5years'].story}`, // Simplified summary for history
        };
        setConversationHistory(prevHistory => [...prevHistory, newHistoryEntry, aiResponseEntry]);

      } else {
        setError('시뮬레이션 결과를 가져오지 못했습니다.');
        console.error('Simulation failed:', response.data.error);
      }
    } catch (err) {
      setError('시뮬레이션 중 오류가 발생했습니다: ' + err.message);
      console.error('Error during simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className={`App ${glitchEffect ? 'glitch' : ''}`}> {/* Apply glitch class */}
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
            <label htmlFor="currentWorries">현재 고민 (쉼표로 구분):</label>
            <input
              type="text"
              id="currentWorries"
              name="currentWorries"
              value={formData.currentWorries}
              onChange={handleInputChange}
              placeholder="예: #이직, #짝사랑, #로또"
            />
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

          <button className="simulate-button" onClick={handleSimulate} disabled={isLoading}>
            {isLoading ? '시뮬레이션 중...' : 'AI로 시뮬레이션 하기'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="results-section" ref={resultsRef}>
          <h2>AI가 시뮬레이션한 당신의 평행세계</h2>
          {isLoading && 
            <div className="loading-state">
              <pre className="crystal-ball">{crystalBallAscii}</pre>
              <p className="loading-message">AI가 당신의 운명을 시뮬레이션 중입니다...</p>
            </div>
          }
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
                  {currentResults.imageUrl && (
                    <div className="image-of-destiny">
                      <p>✨ 운명의 이미지 ✨</p>
                      <img src={currentResults.imageUrl} alt="AI Generated Destiny" />
                    </div>
                  )}
                  <p className="life-story">{currentResults.story}</p>

                  <div className="data-points">
                    <p><strong>직업:</strong> {currentResults.job}</p>
                    <p><strong>예상 연봉:</strong> {currentResults.salary}</p>
                    <p><strong>거주 지역:</strong> {currentResults.residence}</p>
                    <p><strong>라이프스타일:</strong> {currentResults.lifestyle}</p>
                    <p><strong>연애 및 결혼 스토리:</strong> {currentResults.relationships}</p>
                  </div>
                  
                  {currentResults.fateIndex && (
                    <div className="fate-index-section">
                      <h4>운명 지수</h4>
                      {Object.entries(currentResults.fateIndex).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key}:</strong> {value}
                          <span className="ascii-bar">{generateAsciiBar(parseInt(value))}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {currentResults.actionGuideline && (
                    <div className="action-guideline-section">
                      <h4>행동 지침</h4>
                      <ul>
                        {currentResults.actionGuideline.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                  <button className="bm-button" onClick={() => alert('실제 결제는 아닙니다! 비즈니스 모델 확장성을 보여주는 버튼입니다.')}>
                    당신의 운명을 바꿀 부적 구매하기
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