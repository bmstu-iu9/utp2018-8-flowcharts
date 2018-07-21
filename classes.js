class block{
	constructor (typeOfBlock, parentId)
}

block.prototype.addVal = function (value) {
	//предворительные парсер
	this.value=value;
}

workSpace = {
	cont : 0,

}

workSpace.addBlock = function (typeOfBlock, parentId) {
	this.graph.push(new bloc(typeOfblock,parentId))
	this.cont++;

}
