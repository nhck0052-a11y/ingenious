document.getElementById("userInfoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const job = document.getElementById("job").value;

    const scenarios = [
        `만약 ${name}님이 ${job} 대신 화가가 되었다면, 당신은 파리에서 작은 스튜디오를 얻어 그림을 그리며 살고 있을지 모릅니다. 당신의 그림은 독특한 색채로 유명해져, 곧 개인전을 열게 될 것입니다.`,
        `만약 ${name}님이 10년 전, 다른 나라로 떠나는 선택을 했다면, 당신은 현재 새로운 언어와 문화를 배우며 완전히 다른 삶을 살고 있을 겁니다. 그곳에서 소중한 인연을 만나 새로운 가족을 꾸렸을지도 모릅니다.`,
        `만약 ${name}님이 어릴 적 꿈이었던 우주비행사가 되었다면, 당신은 지금쯤 화성 탐사선에 탑승해 인류의 새로운 역사를 쓰고 있을 것입니다. 지구를 바라보며 어떤 생각을 하게 될까요?`
    ];

    let resultHTML = "<ul>";
    scenarios.forEach(scenario => {
        resultHTML += `<li>${scenario}</li>`;
    });
    resultHTML += "</ul>";

    document.getElementById("resultContainer").innerHTML = resultHTML;
});