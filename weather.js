// 날씨 설명 ID를 한국어로 변환하는 함수
function wDescEngToKor(w_id) {
    var w_id_arr = [201,200,202,210,211,212,221,230,231,232,
        300,301,302,310,311,312,313,314,321,500,
        501,502,503,504,511,520,521,522,531,600,
        601,602,611,612,615,616,620,621,622,701,
        711,721,731,741,751,761,762,771,781,800,
        801,802,803,804,900,901,902,903,904,905,
        906,951,952,953,954,955,956,957,958,959,
        960,961,962];
    var w_kor_arr = ["가벼운 비를 동반한 천둥구름","비를 동반한 천둥구름","폭우를 동반한 천둥구름","약한 천둥구름",
        "천둥구름","강한 천둥구름","불규칙적 천둥구름","약한 연무를 동반한 천둥구름","연무를 동반한 천둥구름",
        "강한 안개비를 동반한 천둥구름","가벼운 안개비","안개비","강한 안개비","가벼운 적은비","적은비",
        "강한 적은비","소나기와 안개비","강한 소나기와 안개비","소나기","악한 비","중간 비","강한 비",
        "매우 강한 비","극심한 비","우박","약한 소나기 비","소나기 비","강한 소나기 비","불규칙적 소나기 비",
        "가벼운 눈","눈","강한 눈","진눈깨비","소나기 진눈깨비","약한 비와 눈","비와 눈","약한 소나기 눈",
        "소나기 눈","강한 소나기 눈","박무","연기","연무","모래 먼지","안개","모래","먼지","화산재","돌풍",
        "토네이도","구름 한 점 없는 맑은 하늘","약간의 구름이 낀 하늘","드문드문 구름이 낀 하늘","구름이 거의 없는 하늘",
        "구름으로 뒤덮인 흐린 하늘","토네이도","태풍","허리케인","한랭","고온","바람부는","우박","바람이 거의 없는",
        "약한 바람","부드러운 바람","중간 세기 바람","신선한 바람","센 바람","돌풍에 가까운 센 바람","돌풍",
        "심각한 돌풍","폭풍","강한 폭풍","허리케인"];
    
    for (var i = 0; i < w_id_arr.length; i++) {
        if (w_id_arr[i] == w_id) {
            return w_kor_arr[i];
        }
    }
    return "none"; // 일치하는 ID가 없으면 기본값 "none" 반환
}

// 날짜 및 요일 계산
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
}

// 날씨 API 호출 및 업데이트
async function fetchWeather(city) {
    const apiKey = 'c8139fb241d103f8ffa997b0df4ec4eb'; // 날씨 API 키
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=kr&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('날씨 정보를 가져오는 데 문제가 발생했습니다.');
        const data = await response.json();

        // 날씨 정보 업데이트
        document.getElementById('city-name').textContent = `${data.name} 날씨`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('weather-description').textContent = data.weather[0].description;
        document.getElementById('date').textContent = formatDate(data.dt);
        document.getElementById('current-location').textContent = `위도: ${data.coord.lat}°N, 경도: ${data.coord.lon}°E`;
    } catch (error) {
        alert('날씨 정보를 불러오는 데 실패했습니다.');
    }
}

// 현재 위치의 날씨와 위치 이름 가져오기
async function fetchWeatherByLocation() {
    if (userLocation) {
        const lat = userLocation.lat;
        const lon = userLocation.lng;
        const apiKey = 'c8139fb241d103f8ffa997b0df4ec4eb'; // 날씨 API 키
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('현재 위치 날씨 정보를 가져오는 데 문제가 발생했습니다.');
            const data = await response.json();

            const weatherId = data.weather[0].id;
            const weatherDescription = wDescEngToKor(weatherId); // 한국어로 설명 가져오기

            // 날짜 포맷
            const date = new Date(data.dt * 1000);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('ko-KR', options);

            // 날씨 정보 업데이트
            document.getElementById('weather-info').innerHTML = `
                 <div class="weather-header">
                    <h2>${data.main.temp}°C</h2> <!-- 온도를 먼저 배치 -->
                    <h4>${data.name}</h4> <!-- 위치를 나중에 배치 -->
                </div>
                <div class="weather-body">
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="날씨 아이콘" />
                    </div>
                    <div class="weather-details">
                        <p>${weatherDescription}</p>
                    </div>
                </div>
                <div class="weather-footer">
                    <p>${formattedDate}</p>
                    <p>체감 온도: ${data.main.feels_like} °C</p>
                    <p>최저: ${data.main.temp_min} °C / 최고: ${data.main.temp_max} °C</p>
                </div>
            `;
        } catch (error) {
            document.getElementById('weather-info').innerHTML = error.message;
        }
    }
}

// 날씨 검색 버튼 클릭 이벤트 추가
document.getElementById('weather-search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
    } else {
        alert('도시 이름을 입력하세요.');
    }
});

// 내 위치 날씨 보기 버튼 클릭 이벤트 추가
document.getElementById('current-weather-button').addEventListener('click', fetchWeatherByLocation);
