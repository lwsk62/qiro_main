document.getElementById("search-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // Enter 키를 누를 때
        event.preventDefault();  // 폼의 기본 제출 동작을 막습니다.
        const query = this.value.trim();  // 입력된 검색어 가져오기
        if (query) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});
