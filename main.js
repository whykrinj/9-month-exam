let cards = document.querySelector("#cards");
let loading = document.querySelector("#loading")
let searchInput = document.querySelector("#searchInput")
let filterBy = document.querySelector("#filterBy"); 

// Функция для запроса данных
const requestData = async () => {
    try {
        const request = await fetch('https://raw.githubusercontent.com/diyor011/apibest/master/api.json');
        
        if (!request.ok) {
            throw new Error(`Ошибка при загрузке данных: ${request.statusText}`);            
        } else {
            loading.classList.remove('flex')
            loading.classList.add('hidden')
        }

        const data = await request.json();
        console.log(data);

        read(data); // Изначальный вызов функции для отображения карточек
    } catch (error) {
        console.error('Ошибка при запросе:', error);
    }
};

// Функция для отображения данных
function read(data) {
    // Очищаем уже отображённые карточки
    cards.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(item => {
            console.log(item); 

            if (item.pic && item.name && item.price && item.fulldesc) {
                let card = document.createElement('div');
                card.className = 'flex min-w-[15%] flex-col items-center flex-1 bg-base-300 shadow-lg rounded-xl p-4 border border-cyan-300 shadow-md shadow-cyan-300';
                card.innerHTML = `
                    <img src="${item.pic}" class="h-44 mx-auto" alt="Product Image">
                    <div class="cards-body text-center">
                        <h5 class="text-xl text-green pt-2 font-semibold text-red-500">${item.name}</h5>
                        <p class="text-lg py-2 ">Price: ${item.price}</p>
                        <p class="text-sm text-gray-600">${item.fulldesc}</p>
                    </div>
                `;
                cards.appendChild(card);
            } else {
                console.error('Отсутствуют необходимые данные в item:', item);
            }
        });
    } else {
        console.error("Полученные данные не являются массивом:", data);
    }
}

// Функция для сортировки данных по цене
function sortData(data) {
    const sortBy = filterBy.value;

    if (sortBy === 'cheap') {
        // Сортировка по цене в порядке возрастания
        data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'expensive') {
        // Сортировка по цене в порядке убывания
        data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    read(data); // Перерисовываем карточки после сортировки
}

// Обработчик события изменения фильтра
filterBy.addEventListener('change', () => {
    const request = fetch('https://raw.githubusercontent.com/diyor011/apibest/master/api.json');
    request.then(response => response.json()).then(data => {
        sortData(data); // Сортируем и отображаем данные
    });
});

// Обработчик события для поиска
searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const cardsArray = Array.from(cards.children);
    
    cardsArray.forEach(card => {
        const nameText = card.querySelector('.cards-body h5').textContent.toLowerCase();
        const priceText = card.querySelector('.cards-body p:nth-child(2)').textContent.toLowerCase();
        
        if (nameText.includes(searchText) || priceText.includes(searchText)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    console.log(searchText);
});

requestData(); // Запрашиваем и отображаем данные при загрузке страницы
