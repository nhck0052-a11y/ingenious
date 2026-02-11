// multiverse-life-backend/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (if not already initialized)
// This is typically done automatically when deployed to Firebase Functions
// but might be needed for local testing or specific configurations.
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

/**
 * Helper to format simulation results into a readable text string.
 * @param {object} results The simulation results object.
 * @returns {string} Formatted text content.
 */
function formatResultsForFile(results) {
  let content = "--- Multiverse Life Simulation Report ---\n\n";

  for (const timeframe in results) {
    const data = results[timeframe];
    const displayTimeframe = timeframe === '5years' ? '5년 후' : timeframe === '10years' ? '10년 후' : '20년 후';
    content += `## ${displayTimeframe} 시뮬레이션 결과\n`;
    content += `스토리: ${data.story}\n`;
    content += `직업: ${data.job}\n`;
    content += `예상 연봉: ${data.salary}\n`;
    content += `거주 지역: ${data.residence}\n`;
    content += `라이프스타일: ${data.lifestyle}\n`;
    content += `연애 및 결혼 스토리: ${data.relationships}\n`;
    content += `인생 주요 이벤트 타임라인:\n`;
    data.timeline.forEach(item => {
      content += `  - ${item.year}: ${item.event}\n`;
    });
    content += "\n";
  }
  content += "--- 리포트 끝 ---\n";
  return content;
}

/**
 * HTTP function that simulates a parallel life path based on user input.
 * This is currently a dummy implementation.
 * @param {object} data The data object passed to the function.
 * @param {object} context The context object.
 */
exports.simulateLife = functions.https.onCall(async (data, context) => {
  // Check for authenticated user (optional, depending on your auth strategy)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called while authenticated.'
  //   );
  // }

  const { age, gender, majorJob, personality, currentWorries, scenario } = data;

  console.log("Received simulation request:", { age, gender, majorJob, personality, currentWorries, scenario });

  // --- Dummy Simulation Logic (similar to frontend for now) ---
  const dummyResults = {
    '5years': {
      story: `(AI 시뮬레이션 - 5년 후) 당신이 "${scenario}" 선택했다면, 새로운 환경에서 빠르게 적응하며 기술을 연마했을 것입니다. 예상치 못한 기회와 도전에 직면하며 성장통을 겪겠지만, 이는 당신을 더욱 단단하게 만들 것입니다.`,
      job: "주니어 AI 전문가",
      salary: "6천만원",
      residence: "판교 테크노밸리 근처 소형 오피스텔",
      lifestyle: "스타트업 문화에 푹 빠져 일과 성장에 몰두하는 삶",
      relationships: "직장 동료들과의 돈독한 유대 형성, 새로운 인연을 기다리는 중",
      timeline: [
        { year: '1년차', event: `새로운 분야 학습 및 ${scenario} 관련 프로젝트 참여` },
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

  return {
    success: true,
    results: dummyResults,
  };
});

/**
 * HTTP function to save simulation results to a text file.
 * Returns the content as a base64 encoded string for download.
 * @param {object} data The data object containing simulation results.
 * @param {object} context The context object.
 */
exports.saveResultsToFile = functions.https.onCall(async (data, context) => {
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called while authenticated.'
  //   );
  // }

  const simulationResults = data.results;
  if (!simulationResults) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Simulation results are required.'
    );
  }

  const fileContent = formatResultsForFile(simulationResults);
  const base64Content = Buffer.from(fileContent).toString('base64');

  return {
    success: true,
    fileName: 'multiverse_life_report.txt',
    fileContent: base64Content,
    fileType: 'text/plain',
  };
});
