var originalHTML, 
	showSearchElem,
	widgetSearchVn,
	closeSearchElem,
	searchInputElem,
	errorBlock,
	numberCoincidences = 0,
	numberCoincidencesBlock,
	timeOut,
	coincidencesElem;

const addSearchBlock = () => {
  return new Promise((resolve, reject) => {
	  	let div = document.createElement('div');
		div.id = 'search-block';
		div.className = '.widget-search-main';
		div.setAttribute("style", "right:15px;position:fixed;top:5px;z-index:9999;");
		div.innerHTML = `<div style="text-align:right;display:grid;grid-template-columns:1fr 1fr;">
				<div id="number-coincidences" style="text-align:left;color:#fff;"></div>
				<div>
					<span id="show-search" style="text-align:right;color: #fff;cursor:pointer;border-bottom: 1px solid #fff;display:inline-block"  onclick="showSearch()">
						Поиск по странице
					</span>
					<span id="close-search" style="text-align:right;color: #fff;cursor:pointer;border-bottom: 1px solid #fff;display:none" onclick="closeSearch()">
						Закрыть
					</span>
				</div>
			</div>
			<div id="widget-search-vn" style="display:none;grid-template-columns:3fr 1fr;align-items:center;grid-gap:8px;padding-top:10px;">
				<input type="search" id="searchInput" style="height:35px;width:100%;font-size:16px;padding: 0 5px">
				<button id="searchButton" onclick="searchMatches()" style="height:34px;width:100%;margin:0;padding:0;font-size:17px;cursor:pointer">Найти</button>
			</div>
			<div id="error" style="color:red; font-size:16px;"></div>`;

		if (document.body.prepend(div) === undefined) {
			document.body.prepend(div);
			resolve(console.log("успешно"));
		} else {
			reject(Error('Произошла ошибка'));
		}
    });
};

const getPageHTML = () => {
	addSearchBlock().then((result) => {
	    originalHTML = document.body.innerHTML;
	    showSearchElem = document.getElementById('show-search');
	    closeSearchElem = document.getElementById('close-search');
	    widgetSearchVn = document.getElementById('widget-search-vn');
	    searchInputElem = document.getElementById('searchInput');
	    errorBlock = document.getElementById('error');
	    numberCoincidencesBlock = document.getElementById('number-coincidences');

		searchInputElem.onfocus = function() {
		    errorBlock.textContent = "";
		};
    },
    (err) => {
      console.log(err);
    });
};

const elemDisplayStyle = (element) => {
	return element.currentStyle ? 
		element.currentStyle.display :
        getComputedStyle(element, null).display;
};

const showSearch = () => {
	closeSearchElem = document.getElementById('close-search');
	widgetSearchVn.style.display="grid";
	showSearchElem.style.display = "none";
	closeSearchElem.style.display = "inline-block";
};

const closeSearch = () => {
	document.body.innerHTML = originalHTML;
	showSearchElem = document.getElementById('show-search');
	widgetSearchVn = document.getElementById('widget-search-vn');
}

const scrollSearchElem = () => {
	coincidencesElem = document.getElementsByClassName('coincidences-elem');
	if (coincidencesElem) {
		coincidencesElem[0].scrollIntoView({block: "center", behavior: "smooth"});
	}
}

const searchMatches = () => {
	let searchInput = document.getElementById('searchInput');
	let searchText = searchInput.value.trim();
	const init = () => {
		showSearchElem = document.getElementById('show-search');
	    closeSearchElem = document.getElementById('close-search');
	    widgetSearchVn = document.getElementById('widget-search-vn');
	    searchInputElem = document.getElementById('searchInput');
	    errorBlock = document.getElementById('error');
	    numberCoincidencesBlock = document.getElementById('number-coincidences');
	    coincidencesElem = document.getElementsByClassName('coincidences-elem');

		searchInputElem.onfocus = function() {
		    errorBlock.textContent = "";
		}
	};
	if (searchText) {
		let rex = />(.*?)</g;
	    let editBodyTags = originalHTML;
	    let pageText = editBodyTags.match(rex);
		let arrayResultText = [];
		let rexTextSearch = '/'+searchText+'/gi';
		let result = '';
		let pageTextMatch = [];
		let counter = 0;

		for(let i = 0; i < pageText.length; i++) {
			arrayResultText[i] = pageText[i].replace(eval(rexTextSearch), `<span class="coincidences-elem" style="background-color:yellow;color:#000;">$&</span>`);
			pageTextMatch = pageText[i].match(eval(rexTextSearch));
			numberCoincidences += pageTextMatch != null ? pageTextMatch.length : 0;			
		}
		console.log(numberCoincidences);

		for(let i = 0; i < pageText.length; i++) {
			editBodyTags=editBodyTags.replace(pageText[i],arrayResultText[i]);
		}

		document.body.innerHTML = editBodyTags;
		init();
		scrollSearchElem();

		counter = 0;
		numberCoincidencesBlock.textContent = `Кол-во совпадений - ${numberCoincidences}`;
		numberCoincidences = 0;
		searchInputElem.value = searchText;
	  	widgetSearchVn.style.display="grid";
	  	showSearchElem.style.display = "none";
		closeSearchElem.style.display = "inline-block";
	} else {
		document.body.innerHTML = originalHTML;
		init();

		numberCoincidencesBlock.textContent = '';
		numberCoincidences = 0;
		errorBlock.textContent = 'Введите текст для поиска';
		closeSearchElem.style.display = "inline-block";
		showSearchElem.style.display = "none";
		widgetSearchVn.style.display="block";
	}
};

document.addEventListener('DOMContentLoaded', () => {
	getPageHTML();
});


