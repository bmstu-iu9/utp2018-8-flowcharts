var numOfM=0;

function nextT(){
	numOfM++;
	nextText();
}

function privT(){
	numOfM--;
	nextText()
}

function nextText() {
	let startM = document.getElementById("hello");
	if (numOfM==0){
		startM.innerHTML="<i>Это краткий туториал по интепретатору блок-схем. В общем, Привет.<br>(наводя на элементы интерфейса вы получите информацию о них)<br><br>Этот проект создан для интерпретации блок схем и, возможно в дальнейшем, перевода кода в блок-схему. бла-бла-бла... <strong>НАЖМИТЕ Enter чтобы свалить с этой страницы и попробовать сделать свою блок-схему)))</strong><br>P.S если конечно что-то там в рабочем состояние.<br>-----------------------------------------------------1/2----------------------------------------------------</i>";
	} else if (numOfM==1){
		startM.innerHTML="''Коротко'' о синтаксисе и происходящем.<br> в каждом блоке хранится выражение (логическое, присваивание, инициализация). Поддерживаются тернарные операции и все основные арифм выражения. <br> В столбце Information отображаются переменные которые можно динамически менять, и тем самым вычислять блок-схему от различных значений. После инициализации эти переменные будут доступны для любого блока в схеме. Так же результатом работы будет то или иное изменение этих переменных.<br>-----------------------------------------------------2/2----------------------------------------------------</i>";
	} else {
		startM.style.display="none";
		document.getElementById("nav").style.display="none";
		document.getElementById("main").style.background="rgba(0,0,0,.2)";
	}
}